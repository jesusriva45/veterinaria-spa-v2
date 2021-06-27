import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";

import { Estado } from "src/app/models/estado";
import { Tracking } from "src/app/models/tracking";
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
import { F } from "projects/angular-bootstrap-md/src/lib/free/utils/keyboard-navigation";
import { Pedido } from "src/app/models/pedido";
import { AuthService } from "src/app/services/auth.service";
//-------------------------------------------------------

@Component({
  selector: "app-estado-tracking",
  templateUrl: "./estado-tracking.component.html",
  styleUrls: ["./estado-tracking.component.scss"],
})
export class EstadoTrackingComponent implements OnInit {
  tracking: Tracking = new Tracking();

  estados: Estado[];

  trackings: Tracking[];

  pedidos: Pedido[];

  constructor(
    public pedidoService: PedidoService,
    public clienteService: ClienteService,
    public trackingService: TrackingService,
    public cdRef: ChangeDetectorRef,
    public router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.listarEstados();
    this.listarTracking();
    setTimeout(() => {
      if (this.elements != null) {
        this.checkBox();
      }
    }, 1000);
  }

  listarEstados() {
    this.trackingService.getEstados().subscribe((estado) => {
      this.estados = estado;
    });
  }

  updateEstadoTracking() {
    this.trackingService.updateTracking(this.tracking).subscribe((track) => {
      this.tracking = track;

      let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    });
  }

  listarTracking() {
    this.trackingService.getTacking().subscribe((tracks) => {
      this.trackings = tracks;
      this.data(this.trackings);
    });
  }

  selectPedido(pedido: Pedido) {
    this.pedidoService.getPedido(pedido).subscribe((pedido) => {
      this.tracking.pedido = pedido;

      // this.dataServicios(pedido.detallePedidoServicio);
    });
  }

  //----------------- CHECK BOX -------------------
  box = document.getElementsByClassName("check");
  Checked = null;

  checkBox() {
    for (let index = 0; index < this.box.length; index++) {
      this.box[index].addEventListener("click", () => {
        if (this.Checked != null) {
          this.Checked.checked = false;
          this.Checked = this.box[index];
        }
        this.Checked = this.box[index];
      });
    }
  }

  eventCheck(event, el: any) {
    this.tracking.pedido = el.pedido;
    this.tracking.idtracking = el.idtracking;
  }

  //--------------------------------------------

  //---------------------- DATA TABLE ---------------------------------
  @ViewChild(MdbTablePaginationComponent, { static: true })
  mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;

  previous: any = [];
  searchText: string = "";

  elements: any = [];

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
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(6);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  data(trackings: any) {
    for (let track of trackings) {
      //console.log(track);
      this.elements.push({
        idtracking: track.idtracking.toString(),
        pedido: track.pedido,
        estado: track.estado,
      });
    }

    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }
}
