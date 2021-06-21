import { Servicio } from "./servicio"
import { Usuario } from "./usuario"

export class Cita {

    idcita: number
    fecha_registro: string
    dia_atencion: string
    hora_inicio: string
    hora_fin: string
    estado: string
    servicio: Servicio
    usuario: Usuario

}

