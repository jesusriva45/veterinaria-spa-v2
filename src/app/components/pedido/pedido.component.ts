import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  AfterViewInit,
  ChangeDetectorRef,
} from "@angular/core";
import { Pedido } from "src/app/models/pedido";
import { Usuario } from "src/app/models/usuario";
import { AuthService } from "src/app/services/auth.service";
import { ClienteService } from "src/app/services/cliente.service";
import { PedidoService } from "src/app/services/pedido.service";
import { UsuarioService } from "src/app/services/usuario.service";

//----------------- DATA TABLE ------------------------
import {
  MdbTableDirective,
  MdbTablePaginationComponent,
} from "angular-bootstrap-md";
import { WavesModule, TableModule, InputsModule } from "angular-bootstrap-md";
import { FormsModule } from "@angular/forms";
import { F } from "projects/angular-bootstrap-md/src/lib/free/utils/keyboard-navigation";
//-------------------------------------------------------

@Component({
  selector: "app-pedido",
  templateUrl: "./pedido.component.html",
  styleUrls: ["./pedido.component.scss"],
})
export class PedidoComponent implements OnInit {
  usuario?: Usuario;

  pedidos: Pedido[];

  constructor(
    public pedidoService: PedidoService,
    public clienteService: ClienteService,
    public authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUsuarioId(this.authService.usuario.idusuario);
  }

  getUsuarioId(id: number) {
    this.clienteService.getUsuario(id).subscribe((usuario) => {
      this.usuario = usuario;
      this.pedidos = usuario.pedidos;
      this.data(usuario.pedidos);
    });
  }

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

  data(pedidos: any) {
    let descripcion;
    for (let pedido of pedidos) {
      if (pedido.detallePedidoServicio.length === 0) {
        descripcion = "Productos";
        console.log(pedido.detallePedidoServicio);
      } else if (pedido.detallesProducto.length === 0) {
        descripcion = "Servicios";
      } else if (
        pedido.detallePedidoServicio.length != 0 &&
        pedido.detallesProducto.length != 0
      ) {
        descripcion = "Productos y Servicios";
      }
      console.log(pedido);
      this.elements.push({
        idpedido: pedido.idpedido.toString(),
        fecha_pedido: pedido.fecha_pedido,
        descripcion: descripcion,
      });
    }

    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }
}
