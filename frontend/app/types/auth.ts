export interface User {
  id: number;
  email: string;
  token?: string;
  is_active?: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
  expires_in?: number;
  user_id?: number;
  email?: string;
}
