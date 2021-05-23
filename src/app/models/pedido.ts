import { DetallePedidoProducto } from "./detalle-pedido-producto";
import { DetallePedidoServicio } from "./detalle-pedido-servicio";
import { Usuario } from "./usuario";

export class Pedido {
  idpedido: number;
  fecha_pedido: string;

  usuario: Usuario;

  detallesProducto: Array<DetallePedidoProducto> = [];

  detallePedidoServicio: Array<DetallePedidoServicio> = [];
}
