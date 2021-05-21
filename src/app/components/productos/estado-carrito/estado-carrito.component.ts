import { Component, OnInit } from "@angular/core";
import { CarritoService } from "src/app/services/carrito.service";

@Component({
  selector: "app-estado-carrito",
  templateUrl: "./estado-carrito.component.html",
  styleUrls: ["./estado-carrito.component.scss"],
})
export class EstadoCarritoComponent implements OnInit {
  precioTotal: number = 0.0;
  cantidadTotal: number = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.updateEstadoCarrito();
  }

  updateEstadoCarrito() {
    // suscribirse al Observable precioTotal para traer el precio total del Carrito
    this.carritoService.precioTotal.subscribe(
      (data) => (this.precioTotal = data)
    );

    // suscribirse al Observable cantidadTotal para traer la cantidad total del Carrito
    this.carritoService.cantidadTotal.subscribe(
      (data) => (this.cantidadTotal = data)
    );
  }
}
