import { Historial } from "./historial";
import { Servicio } from "./servicio";
import { Usuario } from "./usuario";

export class Consulta {

    idconsulta: number;
    fecha_atencion: string;
    fecha_modificacion: string;
    estado: string;
    diagnostico: string;
    usuario: Usuario;
    servicio: Servicio;
    historialMascota: Historial;

}


//CLI 11.2.2
//node 14.16.0


