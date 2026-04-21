export interface Movie {
  id: number;
  title: string;
  year: number;
  image: string;
  description?: string;
}

export interface AuthResponse {
  token: string;
}