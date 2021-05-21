import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Acordion } from "src/app/animations/animaciones";
import { Carrito } from "src/app/models/carrito";
import { Producto } from "src/app/models/producto";
import { CarritoService } from "src/app/services/carrito.service";
import { ProductoService } from "src/app/services/producto.service";

@Component({
  selector: "app-detalle-producto",
  templateUrl: "./detalle-producto.component.html",
  animations: [Acordion("enterAnimation")],
  styleUrls: ["./detalle-producto.component.scss"],
})
export class DetalleProductoComponent implements OnInit {
  producto: Producto = new Producto();

  descripcion: string;
  nomMarca: string;

  imgNotFound: string;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private carritoService: CarritoService
  ) {
    this.imgNotFound = "../../../../assets/img/no-image.png";
  }

  ngOnInit(): void {
    this.imgNotFound;
    this.cargarProducto();
  }

  cargarProducto(): void {
    this.activateRoute.params.subscribe((params) => {
      let id = params["id"];
      if (id) {
        this.productoService.getProducto(id).subscribe((producto) => {
          this.producto = producto;
          this.descripcion = this.producto.descripcion;
          this.nomMarca = this.producto.marca.nombre;
          this.classAdd();
        });
      }
    });
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
    console.log(this.producto);

    const itemCarrito = new Carrito(this.producto);

    this.carritoService.agregarItem(itemCarrito);
  }
}
