export interface Ingrediente {
  ingrediente_id: number;
  nombre: string;
}

export interface Plato {
  plato_id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  imagen_url: string;
  ingredientes: Ingrediente[];
}
