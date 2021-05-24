import { Servicio } from './servicio';

export class CarritoServicio {

    id?: number;
    servicio: Servicio;

    constructor(servicio: Servicio){
        this.servicio=servicio;
    }
}
