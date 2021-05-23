import { Producto } from "./producto";

export class Carrito {
  id?: number;
  producto: Producto;
  precio: number;
  cantidad: number;

  constructor(producto: Producto) {
    this.producto = producto;
    this.precio = producto.precio;
    this.cantidad = 1;
  }
}
