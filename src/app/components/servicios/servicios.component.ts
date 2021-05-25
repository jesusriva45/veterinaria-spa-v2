import { Component, OnInit } from "@angular/core";
import { Producto } from "../../models/producto";

import { Router, ActivatedRoute } from "@angular/router";

import { ProductoService } from "../../services/producto.service";
//import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstra

import swal from "sweetalert2";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CarritoService } from "src/app/services/carrito.service";
import { CarritoProducto } from "src/app/models/carrito-producto";
import { Pedido } from "../../models/pedido";
import { DetallePedidoProducto } from "../../models/detalle-pedido-producto";
import { Servicio } from "../../models/servicio";
import { ServicioService } from "../../services/servicio.service";
import { DetallePedidoServicio } from "../../models/detalle-pedido-servicio";

@Component({
  selector: "app-servicios",
  templateUrl: "./servicios.component.html",
  styleUrls: ["./servicios.component.scss"],
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  pedido: Pedido = new Pedido();
  servicio: Servicio = new Servicio();
  precioMin: number;
  precioMax: number;
  imgNotFound: string;
  constructor(
    public servicioService: ServicioService,
    public carritoService: CarritoService
  ) {
    this.imgNotFound = "../../../../assets/img/no-image.png";
  }
  ngOnInit(): void {
    this.listarServicios();
  }
  /*this.usuarioService .getUsuarios().subscribe(
      usuarios => this.usuarios = usuarios
    ); */
  addToCart(servicio: Servicio) {
    console.log(this.servicio);
    const itemCarrito = new DetallePedidoServicio(servicio);
    this.carritoService.agregarItemServicio(itemCarrito);
  }

  listarServicios() {
    this.servicioService.getServicios().subscribe((servicios) => {
      this.servicios = servicios;
      console.log(this.servicio);
    });
  }
}
