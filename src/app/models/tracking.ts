import { Estado } from "./estado";
import { Pedido } from "./pedido";

export class Tracking {
  idtracking: number;
  pedido: Pedido;
  estado: Estado;
}
