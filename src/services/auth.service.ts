import { api } from "./api";
import type { AuthResponse, Rol } from "../types/auth";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegistroData {
  nombre_completo: string;
  email: string;
  password: string;
  telefono: string;
}

export async function iniciarSesion(datos: LoginData): Promise<AuthResponse> {
  const respuesta = await api.post<AuthResponse>("/auth/login", datos);

  return respuesta.data;
}

export async function registrarUsuario(
  datos: RegistroData,
): Promise<AuthResponse> {
  const respuesta = await api.post<AuthResponse>("/auth/register", datos);

  return respuesta.data;
}

export async function obtenerRoles(): Promise<Rol[]> {
  const respuesta = await api.get<Rol[]>("/roles/");
  return respuesta.data;
}
