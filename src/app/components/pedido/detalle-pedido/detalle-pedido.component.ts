import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DetallePedidoProducto } from "src/app/models/detalle-pedido-producto";
import { DetallePedidoServicio } from "src/app/models/detalle-pedido-servicio";
import { Pedido } from "src/app/models/pedido";
import { Tracking } from "src/app/models/tracking";
import { AuthService } from "src/app/services/auth.service";
import { ClienteService } from "src/app/services/cliente.service";
import { PedidoService } from "src/app/services/pedido.service";
import { TrackingService } from "src/app/services/tracking.service";

@Component({
  selector: "app-detalle-pedido",
  templateUrl: "./detalle-pedido.component.html",
  styleUrls: ["./detalle-pedido.component.scss"],
})
export class DetallePedidoComponent implements OnInit {
  pedido: Pedido = new Pedido();

  tracking: Tracking = new Tracking();

  detallePedidoProducto: Array<DetallePedidoProducto>;
  detallePedidoServicio: Array<DetallePedidoServicio>;

  constructor(
    public pedidoService: PedidoService,
    public clienteService: ClienteService,
    private activateRoute: ActivatedRoute,
    private trackingService: TrackingService
  ) {}

  ngOnInit(): void {
    this.cargarPedido();
    this.estadoTracking();
  }

  cargarPedido(): void {
    this.activateRoute.params.subscribe((params) => {
      let id = params["id"];
      if (id) {
        this.pedidoService.getPedido(id).subscribe((pedido) => {
          this.pedido = pedido;
          this.detallePedidoProducto = pedido.detallesProducto;
          this.detallePedidoServicio = pedido.detallePedidoServicio;
          console.log(this.pedido);
        });
      }
    });
  }

  idPedido: number;

  estadoTracking() {
    this.activateRoute.params.subscribe((params) => {
      let id = params["id"];
      if (id) {
        this.trackingService.getTracking(id).subscribe((track) => {
          this.tracking = track;
          console.log(this.tracking.pedido.idpedido);

          let processed = document.getElementById("orderProcess");
          let shipped = document.getElementById("orderShipped");
          let route = document.getElementById("orderEnRout");
          let arrived = document.getElementById("orderArrived");

          if (track.estado.idestado == 1) {
            processed.className += " active";
          } else if (track.estado.idestado == 2) {
            processed.className += " active";
            shipped.className += " active";
          } else if (track.estado.idestado == 3) {
            processed.className += " active";
            shipped.className += " active";
            route.className += " active";
          } else if (track.estado.idestado == 4) {
            processed.className += " active";
            shipped.className += " active";
            route.className += " active";
            arrived.className += " active";
          }
        });
      }
    });
  }
}
