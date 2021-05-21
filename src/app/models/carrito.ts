import { Producto } from "./producto";

export class Carrito {
  id: number;
  nombre: string;
  imageUrl: string;
  precioUnit: number;
  marca: string;

  cantidad: number;

  constructor(producto: Producto) {
    this.id = producto.idproducto;
    this.nombre = producto.nombre;
    this.marca = producto.marca.nombre;
    this.imageUrl = producto.foto1;
    this.precioUnit = producto.precio;

    this.cantidad = 1;
  }
}
