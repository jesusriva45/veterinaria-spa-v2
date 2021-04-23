import { Cliente } from "./cliente";
import { Tipomascota } from "./tipomascota";

export class Mascota {
  idmascota: number;
  nombre: string;
  raza: string;
  fecha_nacimiento: string;
  sexo: string;
  tipomascota: Tipomascota;
  cliente: Cliente;
}
