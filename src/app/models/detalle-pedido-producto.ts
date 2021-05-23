import { Producto } from "./producto";

export class DetallePedidoProducto {
  idpedido?: number;
  producto: Producto;
  precio: number;
  cantidad: number;
}
