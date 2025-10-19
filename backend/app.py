from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, Integer, String, create_engine, Text, DateTime, ForeignKey, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.middleware.cors import CORSMiddleware
import os
import json

app = FastAPI()

env = {}
try:
    with open('.env', 'r') as f:
        d = f.read().splitlines()
        for i in d:
            a = i.partition('=')
            env[a[0]] = env[a[-1]]
except:
    env = {
        'SECRET_KEY': 'very-secret-key',
        'ALGORIHTM': 'HS256'
    }


SECRET_KEY = env['SECRET_KEY']
ALGORITHM = env['ALGORIHTM']
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # expire after 1 hour

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://ec2-3-109-198-229.ap-south-1.compute.amazonaws.com",
    "https://ec2-3-109-198-229.ap-south-1.compute.amazonaws.com"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

DB_URL = "sqlite:///./test.db"

engine = create_engine(DB_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class UserDB (Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)


class CommentDB (Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    text = Column(Text, nullable=False)
    upvotes = Column(Integer, default=0)
    created_at = Column(String, nullable=False)
    user_id = Column(String, nullable=False)


Base.metadata.create_all(bind=engine)


class UserCreate (BaseModel):
    email: EmailStr
    password: str


class UserOut (BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True


class Token (BaseModel):
    access_token: str
    token_type: str


class Comment (BaseModel):
    id: int
    parent_id: Optional[int] = None
    text: str
    upvotes: int
    created_at: str
    user_id: str

    class Config:
        orm_mode = True


class CommentCreate (BaseModel):
    text: str
    parent_id: Optional[int] = None


pwd_context = CryptContext(schemes=['bcrypt'], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def seed_comments():
    COMMENTS_FILE_PATH = './comments.json'
    engine = create_engine("sqlite:///./test.db",
                           connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()

    Base.metadata.create_all(bind=engine)

    with open(COMMENTS_FILE_PATH, 'r') as file:
        comments_data = json.load(file)

    existing_comments = session.query(CommentDB).first()
    if existing_comments:
        print("Comments table already has data. Skipping seeding.")
        session.close()
        return

    for comment in comments_data:
        db_comment = CommentDB(
            id=comment['id'],
            parent_id=comment['parent_id'],
            text=comment['text'],
            upvotes=comment['upvotes'],
            created_at=comment['created_at'],
            user_id=comment['user_id']
        )
        session.add(db_comment)

    try:
        session.commit()
        print(f"Successfully seeded {len(comments_data)} comments")
    except Exception as e:
        session.rollback()
        print(f"Error seeding comments: {e}")
    finally:
        session.close()


seed_comments()


def get_password_hash(pwd: str) -> str:
    return pwd_context.hash(pwd)


def verify_password(plain_pwd: str, hash_pwd: str) -> bool:
    return pwd_context.verify(plain_pwd, hash_pwd)


def create_access_token(data: dict, expires_delta):
    to_encode = data.copy()
    now = datetime.now()
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": now})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user_by_email(db: Session, email: str):
    return db.query(UserDB).filter(UserDB.email == email).first()


def create_user(db: Session, email: str, pwd: str) -> UserDB:
    user = UserDB(email=email, hashed_password=get_password_hash(pwd=pwd))
    db.add(user)

    try:
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        raise


def authenticate_user(db: Session, email: str, pwd: str):
    user = get_user_by_email(db, email=email)

    if not user:
        return None

    if not verify_password(pwd, user.hashed_password):
        return None

    return user


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserDB:
    creds_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise creds_exception
    except JWTError:
        raise creds_exception

    user = get_user_by_email(db, email=email)
    if user is None:
        raise creds_exception
    return user


@app.post('/register', response_model=UserOut, status_code=201)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    try:
        user = create_user(db, user_in.email, user_in.password)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Could not create user")
    return user


@app.post('/token', response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password", headers={
                            "WWW-Authenticate": "Bearer"})

    ate = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=ate
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@app.get("/users/me", response_model=UserOut)
def read_users_me(current_user: UserDB = Depends(get_current_user)):
    return current_user


@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


def get_comments(db: Session, skip: int = 0, limit: int = None):
    query = db.query(CommentDB).order_by(CommentDB.id)
    if limit:
        return query.offset(skip).limit(limit).all()
    return query.all()


@app.get("/comment", response_model=List[Comment])
def read_comments(db: Session = Depends(get_db)):
    comments = get_comments(db)
    return comments


@app.get("/comment/{n}", response_model=List[Comment])
def read_n_comments(n: int, db: Session = Depends(get_db)):
    if n <= 0:
        raise HTTPException(
            status_code=400, detail="Parameter 'n' must be greater than 0")

    comments = get_comments(db, limit=n)
    return comments


@app.post("/comment", response_model=Comment, status_code=201)
def create_comment(comment_data: CommentCreate, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    if comment_data.parent_id is not None:
        parent_comment = db.query(CommentDB).filter(
            CommentDB.id == comment_data.parent_id).first()
        if not parent_comment:
            raise HTTPException(
                status_code=404, detail=f"Parent comment with id {comment_data.parent_id} not found")

    max_id_result = db.query(func.max(CommentDB.id)).first()
    next_id = 1 if max_id_result[0] is None else max_id_result[0] + 1

    new_comment = CommentDB(
        id=next_id,
        parent_id=comment_data.parent_id,
        text=comment_data.text,
        upvotes=0,
        created_at=datetime.now().isoformat(),
        user_id=str(current_user.id)
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return new_comment
