import { Producto } from "./producto";

export class DetallePedidoProducto {
  idpedido?: number;
  producto: Producto;
  precio: number;
  cantidad: number;

  constructor(producto: Producto) {
    this.producto = producto;
    this.precio = producto.precio;
    this.cantidad = 1;
  }
}
