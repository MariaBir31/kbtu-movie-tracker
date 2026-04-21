export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    username: string;
    email: string;
  };
}
