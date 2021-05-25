import { Component, OnInit } from "@angular/core";

import { Router, ActivatedRoute } from "@angular/router";
import { ProductoService } from "../../../services/producto.service";

import { Producto } from "../../../models/producto";

//import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import swal from "sweetalert2";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CarritoProducto } from "src/app/models/carrito-producto";
import { CarritoService } from "src/app/services/carrito.service";
import { DetallePedidoServicio } from "src/app/models/detalle-pedido-servicio";
import { PedidoService } from "src/app/services/pedido.service";
import { AuthService } from "src/app/services/auth.service";
import { DetallePedidoProducto } from "src/app/models/detalle-pedido-producto";
import { Pedido } from "src/app/models/pedido";
import { ClienteService } from "src/app/services/cliente.service";
import { Servicio } from "../../../models/servicio";

@Component({
  selector: "app-carrito-pedido",
  templateUrl: "./carrito-pedido.component.html",
  styleUrls: ["./carrito-pedido.component.scss"],
})
export class CarritoPedidoComponent implements OnInit {
  producto: Producto = new Producto();
  Servicio: Servicio = new Servicio();

  descripcion: string;
  nomMarca: string;
  //----------- ITEMS DE CARRITO --------------
  cartItems: Pedido = new Pedido();
  precioTotal: number = 0;
  cantidadTotal: number = 0;
  //----------------------
  myImgUrl: string;
  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private clienteService: ClienteService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private pedidoService: PedidoService,
    private authService: AuthService
  ) {
    this.myImgUrl = "../../../../assets/img/no-image.png";
  }

  ngOnInit(): void {
    this.cargarProducto();
    this.listarItems();
  }

  listarItems() {
    // get a handle to the cart items
    this.cartItems.detallesProducto = this.carritoService.cartItems;
    this.cartItems.detallePedidoServicio =
      this.carritoService.cartItemsServicio;
    //console.log(this.carritoService.cartItems);

    //console.log(this.cartItems.detallesProducto);

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
  incrementCantidad(item: CarritoProducto) {
    this.carritoService.agregarItem(item);
  }
  decrementCantidad(item: CarritoProducto) {
    this.carritoService.diminuirCantidad(item);
  }
  removeItem(item: CarritoProducto) {
    this.carritoService.removeItem(item);
  }

  //--------------- AGREGAR-DISMINUIR-REMOVER SERVICIO -----------------
  incrementCantidadServicio(item: DetallePedidoServicio) {
    this.carritoService.agregarItemServicio(item);
  }
  decrementCantidadServicio(item: DetallePedidoServicio) {
    this.carritoService.diminuirCantidadServicio(item);
  }
  removeItemServicio(item: DetallePedidoServicio) {
    this.carritoService.removeItemServicio(item);
  }
  //------------------------------------------

  pedido: Pedido = new Pedido();
  //arr: Array<DetallePedidoProducto>;
  insertar() {
    if (
      this.authService.usuario === null ||
      this.authService.usuario === undefined
    ) {
      swal.fire(
        `Escoja su fecha de atención preferida según el horario que se brinde el servicio...!`,
        `fecha inválida`,
        "warning"
      );
    } else {
      this.clienteService
        .continueCompra(this.authService.usuario.idusuario)
        .subscribe((usuario) => {
          this.pedido.usuario = usuario;

          this.pedido.detallesProducto = this.cartItems.detallesProducto;
          this.pedido.detallePedidoServicio =
            this.cartItems.detallePedidoServicio;
          //console.log(this.pedido.detallesProducto);
          let fecha;
          fecha = this.carritoService.cartItemsServicio.find((e) => {
            if (e.fecha_atencion == undefined) {
              return (fecha = true);
            } else {
              return (fecha = false);
            }
          });

          if (fecha) {
            swal.fire(
              `Escoja su fecha de atención preferida según el horario que se brinde el servicio...!`,
              `fecha inválida`,
              "warning"
            );
            console.log("NULL FECHA " + fecha);
          } else if (!fecha) {
            swal
              .fire({
                title:
                  "Por favor verifique sus productos y/o servicios antes de continuar",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, realizar pedido",
              })
              .then((result) => {
                if (result.isConfirmed) {
                  swal.fire(
                    "Registro Exitoso...!",
                    `Gracias por su compra, estaremos en contacto con usted`,
                    "success"
                  );
                  this.registrarPedido();
                } else {
                }
              });
          }
        });
    }
    // this.pedido.usuario = this.authService.usuario;
  }

  registrarPedido() {
    this.pedidoService.insert(this.pedido).subscribe((resp) => {
      let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
        this.carritoService.vaciarCarrito();
      });
      //console.log(resp);
    });
  }

  fecha(item: DetallePedidoServicio) {
    //item.fecha_atencion = this.fechaServicio;

    this.cartItems.detallePedidoServicio.forEach((e) => {
      console.log(e.fecha_atencion);
      item = e;
      this.carritoService.addFecha(e);
    });
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
