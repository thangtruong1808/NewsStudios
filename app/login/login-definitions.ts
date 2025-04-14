export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "admin" | "user" | "editor";
  status: "active" | "inactive";
  description?: string;
  user_image?: string;
  created_at: string;
  updated_at: string;
}

export interface UserFormData {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  role: "admin" | "user" | "editor";
  status: "active" | "inactive";
  description?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, "password">;
  error?: string;
  token?: string;
}
