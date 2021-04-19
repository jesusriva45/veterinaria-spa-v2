import { ProCategoria } from './pro-categoria';
import { Marca } from './marca';
import { Proveedor } from './proveedor';

export class Producto {
  idproducto: number;
  nombre: string;
  precio: number;
  stock: number;
  serie: number;
  descripcion: string;
  indicaciones: string;
  foto1: string;
  foto2: string;
  foto3: string;
  marca: Marca;
  proveedor: Proveedor;
  categoria: ProCategoria;
}
