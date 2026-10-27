import { api } from "./api";
import type { Plato } from "../types/plato";

export async function obtenerPlatos(): Promise<Plato[]> {
  const respuesta = await api.get<Plato[]>("/catalogo/platos");

  return respuesta.data;
}
