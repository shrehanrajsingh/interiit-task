from datetime import datetime, timedelta

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

SECRET_KEY = "very-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # expire after 1 hour

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
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


pwd_context = CryptContext(schemes=['bcrypt'], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


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
