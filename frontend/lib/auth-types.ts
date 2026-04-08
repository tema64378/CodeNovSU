export interface AuthUser {
  id: string;
  email: string;
  display_name: string;
  email_verified: boolean;
  role: string;
  locale: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: "bearer";
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  display_name: string;
}
