import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  AfterViewInit,
  ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DetallePedidoProducto } from "src/app/models/detalle-pedido-producto";
import { DetallePedidoServicio } from "src/app/models/detalle-pedido-servicio";
import { Pedido } from "src/app/models/pedido";
import { Tracking } from "src/app/models/tracking";
import { AuthService } from "src/app/services/auth.service";
import { ClienteService } from "src/app/services/cliente.service";
import { PedidoService } from "src/app/services/pedido.service";
import { TrackingService } from "src/app/services/tracking.service";

//----------------- DATA TABLE ------------------------
import {
  MdbTableDirective,
  MdbTablePaginationComponent,
} from "angular-bootstrap-md";
import { WavesModule, TableModule, InputsModule } from "angular-bootstrap-md";
import { FormsModule } from "@angular/forms";
import { Estado } from "src/app/models/estado";
//-------------------------------------------------------

@Component({
  selector: "app-detalle-pedido",
  templateUrl: "./detalle-pedido.component.html",
  styleUrls: ["./detalle-pedido.component.scss"],
})
export class DetallePedidoComponent implements OnInit, AfterViewInit {
  pedido: Pedido = new Pedido();

  tracking: Tracking = new Tracking();

  estados: Estado[];

  detallePedidoProducto: Array<DetallePedidoProducto>;
  detallePedidoServicio: Array<DetallePedidoServicio>;

  constructor(
    public pedidoService: PedidoService,
    public clienteService: ClienteService,
    public activateRoute: ActivatedRoute,
    public trackingService: TrackingService,
    public cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPedido();
    this.estadoTracking();
    // this.updateEstadoTracking();
  }

  cargarPedido(): void {
    this.activateRoute.params.subscribe((params) => {
      let id = params["id"];
      if (id) {
        this.pedidoService.getPedido(id).subscribe((pedido) => {
          this.pedido = pedido;
          this.detallePedidoProducto = pedido.detallesProducto;
          this.detallePedidoServicio = pedido.detallePedidoServicio;
          console.log(pedido.detallePedidoServicio);
          this.data(pedido.detallesProducto);
          // this.dataServicios(pedido.detallePedidoServicio);
        });
      }
    });
  }

  //idPedido: number;

  estadoTracking() {
    this.activateRoute.params.subscribe((params) => {
      let id = params["id"];
      if (id) {
        this.trackingService.getTrackingPorPedido(id).subscribe((track) => {
          this.tracking = track;

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

  //---------------------- DATA TABLE ---------------------------------
  @ViewChild(MdbTablePaginationComponent, { static: true })
  mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  elements: any = [];
  previous: any = [];
  headElements = ["ID", "First", "Last", "Handle"];
  searchText: string = "";

  @HostListener("input") oninput() {
    this.searchItems();
  }
  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.elements = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.elements = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(10);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  data(detallePedidos) {
    for (let detalle of detallePedidos) {
      this.elements.push({
        nomProducto: detalle.producto.nombre,
        cantidad: detalle.cantidad,
        precio: detalle.precio,
      });
    }

    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }

  //------ SERVICIO ------------
  /*
  servicios: any = [];
  previousServicio: any = [];
  @ViewChild(MdbTableDirective, { static: true })
  mdbTableServicio: MdbTableDirective;

  @ViewChild(MdbTablePaginationComponent, { static: true })
  mdbTablePaginationServicio: MdbTablePaginationComponent;

  dataServicios(detalleServicios) {
    for (let detalle of detalleServicios) {
      this.servicios.push({
        nomServicio: detalle.servicio.nombre,
        cantidad: detalle.cantidad,
        precio: detalle.precio,
      });
    }

    this.mdbTableServicio.setDataSource(this.servicios);
    this.servicios = this.mdbTableServicio.getDataSource();
    this.previousServicio = this.mdbTableServicio.getDataSource();
  }*/
}
