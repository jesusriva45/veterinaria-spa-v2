import { Component, OnInit } from "@angular/core";

import { Router, ActivatedRoute } from "@angular/router";
import { ProductoService } from "../../../services/producto.service";

import { Producto } from "../../../models/producto";

//import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import swal from "sweetalert2";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Carrito } from "src/app/models/carrito";
import { CarritoService } from "src/app/services/carrito.service";

@Component({
  selector: "app-carrito-productos",
  templateUrl: "./carrito-productos.component.html",
  styleUrls: ["./carrito-productos.component.scss"],
})
export class CarritoProductosComponent implements OnInit {
  producto: Producto = new Producto();

  descripcion: string;
  nomMarca: string;

  //----------- ITEMS DE CARRITO --------------
  cartItems: Carrito[] = [];

  precioTotal: number = 0;
  cantidadTotal: number = 0;

  //----------------------

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarProducto();
    this.listarItems();
  }

  listarItems() {
    // get a handle to the cart items
    this.cartItems = this.carritoService.cartItems;

    // precio total de carrito por item
    this.carritoService.precioTotal.subscribe(
      (data) => (this.precioTotal = data)
    );

    // cantidad total de carrito por Item
    this.carritoService.cantidadTotal.subscribe(
      (data) => (this.cantidadTotal = data)
    );

    // calcular el precio total y la cantidad del carrito
    this.carritoService.calcularPrecioPorCantidadTotal();
  }

  incrementCantidad(item: Carrito) {
    this.carritoService.agregarItem(item);
  }

  decrementCantidad(item: Carrito) {
    this.carritoService.diminuirCantidad(item);
  }

  removeItem(item: Carrito) {
    this.carritoService.removeItem(item);
  }

  cargarProducto(): void {
    this.activateRoute.params.subscribe((params) => {
      let id = params["id"];
      if (id) {
        this.productoService.getProducto(id).subscribe((producto) => {
          this.producto = producto;
          this.descripcion = this.producto.descripcion;
          this.nomMarca = this.producto.marca.nombre;
        });
      }
    });
  }
}
