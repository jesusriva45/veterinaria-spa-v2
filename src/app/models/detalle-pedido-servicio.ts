import { Servicio } from "./servicio";

export class DetallePedidoServicio {
  id?: number;
  servicio: Servicio;
  precio: number;
  cantidad: number;
  fecha_atencion: string;

  constructor(servicio: Servicio) {
    this.servicio = servicio;
    this.precio = servicio.precio;
    this.cantidad = 1;
  }
}
