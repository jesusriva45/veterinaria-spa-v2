import { Component, OnInit } from "@angular/core";
import { Producto } from "../../models/producto";

import { Router, ActivatedRoute } from "@angular/router";

import { ProductoService } from "../../services/producto.service";
//import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import swal from "sweetalert2";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CarritoService } from "src/app/services/carrito.service";
import { Carrito } from "src/app/models/carrito";

@Component({
  selector: "app-productos",
  templateUrl: "./productos.component.html",
  styleUrls: ["./productos.component.scss"],
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];

  producto: Producto = new Producto();

  precioMin: number;
  precioMax: number;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.listarProductos();
  }

  /*this.usuarioService .getUsuarios().subscribe(
      usuarios => this.usuarios = usuarios
    ); */

  addToCart(producto: Producto) {
    console.log(this.producto);

    const itemCarrito = new Carrito(producto);

    this.carritoService.agregarItem(itemCarrito);
  }

  getProductoXPrecio(precioMin, precioMax) {
    this.productoService
      .getProductoProPrecio(precioMin, precioMax)
      .subscribe((productos) => (this.productos = productos));
  }

  listarProductos() {
    this.productoService
      .getProductos()
      .subscribe((productos) => (this.productos = productos));
  }
}
