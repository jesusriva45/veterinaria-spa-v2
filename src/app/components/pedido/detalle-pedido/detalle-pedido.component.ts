import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DetallePedidoProducto } from "src/app/models/detalle-pedido-producto";
import { DetallePedidoServicio } from "src/app/models/detalle-pedido-servicio";
import { Pedido } from "src/app/models/pedido";
import { AuthService } from "src/app/services/auth.service";
import { ClienteService } from "src/app/services/cliente.service";
import { PedidoService } from "src/app/services/pedido.service";

@Component({
  selector: "app-detalle-pedido",
  templateUrl: "./detalle-pedido.component.html",
  styleUrls: ["./detalle-pedido.component.scss"],
})
export class DetallePedidoComponent implements OnInit {
  pedido: Pedido;

  detallePedidoProducto: Array<DetallePedidoProducto>;
  detallePedidoServicio: Array<DetallePedidoServicio>;

  constructor(
    public pedidoService: PedidoService,
    public clienteService: ClienteService,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarPedido();
  }

  cargarPedido(): void {
    this.activateRoute.params.subscribe((params) => {
      let id = params["id"];
      if (id) {
        this.pedidoService.getPedido(id).subscribe((pedido) => {
          this.pedido = pedido;
          this.detallePedidoProducto = pedido.detallesProducto;
          this.detallePedidoServicio =  pedido.detallePedidoServicio;
          console.log(this.detallePedidoProducto);
        });
      }
    });
  }
}
