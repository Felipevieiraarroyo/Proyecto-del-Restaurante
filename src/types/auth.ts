export interface AuthResponse {
  access_token: string;
  token_type: string;
  usuario_id: number;
  rol_id: number;
  nombre_completo: string;
  email: string;
}

export interface Rol {
  rol_id: number;
  nombre_rol: string;
}

export type RolId = 1 | 2 | 3 | 4;

export interface UsuarioSesion {
  usuario_id: number;
  rol_id: RolId;
  nombre_completo: string;
  email: string;
}
