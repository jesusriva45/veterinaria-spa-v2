import { Ubigeo } from "./ubigeo";

export class Usuario {
  idusuario: number;
  nombres: string;
  apellidos: string;
  dni: string;
  correo: string;
  fechaReg: string;
  telefono: string;
  direccion: string;
  fechaNac: string;
  ubigeo: Ubigeo;
  //estado agregado
  estado: boolean;
  //---------------
  username: string;
  password: string;
  roles: string[] = [];
}
