import { Component, OnInit } from "@angular/core";
import { Producto } from "../../models/producto";

import { Router, ActivatedRoute } from "@angular/router";

import { ProductoService } from "../../services/producto.service";
//import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import swal from "sweetalert2";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-productos",
  templateUrl: "./productos.component.html",
  styleUrls: ["./productos.component.css"],
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];

  producto: Producto = new Producto();

  precioMin: number;
  precioMax: number;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.getProductoXPrecio(12, 14);
  }

  /*this.usuarioService .getUsuarios().subscribe(
      usuarios => this.usuarios = usuarios
    ); */

  getProductoXPrecio(precioMin, precioMax) {
    this.productoService
      .getProductoProPrecio(precioMin, precioMax)
      .subscribe((productos) => (this.productos = productos));
  }
}
