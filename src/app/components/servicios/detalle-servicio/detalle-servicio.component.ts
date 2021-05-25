import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Acordion } from "src/app/animations/animaciones";
import { CarritoServicio } from "src/app/models/carrito-servicio";
import { DetallePedidoServicio } from "src/app/models/detalle-pedido-servicio";
import { Servicio } from "src/app/models/servicio";
import { CarritoService } from "src/app/services/carrito.service";
import { ServicioService } from "src/app/services/servicio.service";

@Component({
  selector: "app-detalle-servicio",
  templateUrl: "./detalle-servicio.component.html",
  animations: [Acordion("enterAnimation")],
  styleUrls: ["./detalle-servicio.component.scss"],
})
export class DetalleServicioComponent implements OnInit {
  servicio: Servicio = new Servicio();

  descripcion: string;

  imgNotFound: string;
  horarioAten: string;

  constructor(
    public servicioService: ServicioService,
    public router: Router,
    public activateRoute: ActivatedRoute,
    private carritoService: CarritoService
  ) {
    this.imgNotFound = "../../../../assets/img/no-image.png";
  }

  ngOnInit(): void {
    this.cargarProducto();
  }

  cargarProducto(): void {
    this.activateRoute.params.subscribe((params) => {
      let id = params["id"];
      if (id) {
        this.servicioService.getServicio(id).subscribe((servicio) => {
          this.servicio = servicio;
          this.descripcion = `${this.servicio.descripcion}`;
          this.horarioAten = `${this.servicio.fecha_atencion}`;
          this.classAdd();
        });
      }
    });
  }

  //------- VISIBILIDAD DEL ACORDION -----------
  descProduct: boolean = true;

  especProduct: boolean = true;

  acordionDescripcion() {
    if (this.descProduct == true) {
      this.descProduct = false;
    } else {
      this.descProduct = true;
    }
  }
  acordionEspecificaciones() {
    if (this.especProduct == true) {
      this.especProduct = false;
    } else {
      this.especProduct = true;
    }
  }

  addToCart() {
    console.log(this.servicio);
    const itemCarrito = new DetallePedidoServicio(this.servicio);
    this.carritoService.agregarItemServicio(itemCarrito);
  }

  classAdd() {
    var element = document.getElementsByClassName("carousel-control-next-icon");

    for (let index = 0; index < element.length; index++) {
      element[index].className += " bg-dark ml-3";
    }

    var element = document.getElementsByClassName("carousel-control-prev-icon");

    for (let index = 0; index < element.length; index++) {
      element[index].className += " bg-dark mr-3";
    }
  }
}
