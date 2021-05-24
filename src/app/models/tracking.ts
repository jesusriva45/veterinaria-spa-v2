import { Estado } from "./estado";
import { Pedido } from "./pedido";

export class Tracking {
  idpedido: number;
  pedido: Pedido;
  estado: Estado;
}
