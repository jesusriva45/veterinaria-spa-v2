import { Component, OnInit } from "@angular/core";

import { Router, ActivatedRoute } from "@angular/router";
import { ProductoService } from "../../../services/producto.service";

import { Producto } from "../../../models/producto";

//import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import swal from "sweetalert2";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-carrito-productos",
  templateUrl: "./carrito-productos.component.html",
  styleUrls: ["./carrito-productos.component.css"],
})
export class CarritoProductosComponent implements OnInit {
  producto: Producto = new Producto();

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarProducto();
  }

  cargarProducto(): void {
    this.activateRoute.params.subscribe((params) => {
      let id = params["id"];
      if (id) {
        this.productoService.getProducto(id).subscribe((producto) => {
          this.producto = producto;
        });
      }
    });
  }
}
