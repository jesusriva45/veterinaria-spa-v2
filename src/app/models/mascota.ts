import { Raza } from "./raza";
import { Tipomascota } from "./tipomascota";
import { Usuario } from "./usuario";

export class Mascota {
  idmascota: number;
  foto: string;
  nombre: string;
  fecha_nacimiento: string;
  sexo: string;
  estado: number;
  tipomascota: Tipomascota;
  usuario: Usuario;
  raza: Raza;
}
