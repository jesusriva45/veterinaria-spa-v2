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
import Swal from "sweetalert2";
//----------------- DATA TABLE ------------------------
import {
  MdbTableDirective,
  MdbTablePaginationComponent,
} from "angular-bootstrap-md";
import { WavesModule, TableModule, InputsModule } from "angular-bootstrap-md";
import { FormsModule } from "@angular/forms";
import { F } from "projects/angular-bootstrap-md/src/lib/free/utils/keyboard-navigation";
import { DetallePedidoProducto } from "src/app/models/detalle-pedido-producto";
import { DetallePedidoServicio } from "src/app/models/detalle-pedido-servicio";
//-------------------------------------------------------

@Component({
  selector: "app-pedido",
  templateUrl: "./pedido.component.html",
  styleUrls: ["./pedido.component.scss"],
})
export class PedidoComponent implements OnInit {
  usuario?: Usuario;

  pedidos: Pedido[] = [];

  constructor(
    public pedidoService: PedidoService,
    public clienteService: ClienteService,
    public authService: AuthService,
    public cdRef: ChangeDetectorRef
  ) {
    this.estadoPedido = null
  }

  ngOnInit(): void {

    this.getPedidos();

    if (this.authService.hasRole("ROLE_CLIENTE")) {
      this.dniUser = this.authService.usuario.dni;
    }
  }


  getPedidosSistema() {

    this.pedidoService.getPedidosDeUsuario(this.authService.usuario.idusuario).subscribe((data) => {
      this.pedidos = data;
      this.data(data);
    })

  }

  getPedidos() {
    if (this.authService.hasRole('ROLE_CLIENTE')) {
      this.pedidoService.getPedidosDeUsuario(this.authService.usuario.idusuario).subscribe((data) => {
        this.pedidos = data;
        this.data(data);
      })
    }
  }


  dniUser: string;
  estadoPedido: string;

  estados: string[] = ["TODOS", "PAGADO", "FINALIZADO", "ANULADO"];

  onChangeFiltrarPedidoPorEstado(e) {

    let dni = (document.getElementById("search") as HTMLInputElement).value



    if (dni != "" && e != "TODOS") {

      console.log(dni + " " + e)

      this.filtrarPedidosPorDniAndEstado(dni, e);

    } else if ((dni == "") && e == "TODOS") {

      this.pedidoService.getPedidosDeUsuario(this.authService.usuario.idusuario).subscribe((data) => {
        this.pedidos = data;
        this.data(data);

      })
    } else if ((dni != "") && e == "TODOS") {
      this.pedidoService.getPedidosDeUsuarioPorDni(dni).subscribe((data) => {
        this.pedidos = data;
        this.data(data);
      })
    } else if (dni == "" && e == "TODOS") {

      console.log("gaa");
    }
  }

  cancelarPedido(pedido: Pedido) {

    console.log(pedido.idpedido)
    this.updateEstadoForm(pedido);
    //}
    //this.modalEstado.show();
  }

  updateEstadoForm(pedido: Pedido) {

    //this.click = false;
    Swal
      .fire({
        title: "Deseas cancelar tu Pedido?...",
        text: "",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          pedido.estado = "CANCELADO"
          this.updateEstado(pedido);
        }
      });
  }

  updateEstado(pedido: Pedido) {
    this.pedidoService.updateEstado(pedido).subscribe((data) => {
      this.getPedidos()
      Swal.fire({
        title: "Pedido cancelado",
        text: "",
        icon: "success",
        confirmButtonText: "Ok",
      });
    })
  };

  filtrarPedidosPorDniAndEstado(dni_user: string, estado_user: string) {
    this.pedidoService
      .getPedidosDeUsuarioPorDniAndEstado(dni_user, estado_user)
      .subscribe((data) => { this.pedidos = data; this.data(data); });
  }




  idpedido: number;
  fecha_pedido: string;

  user: any;

  detallesProducto: Array<DetallePedidoProducto> = [];

  detallePedidoServicio: Array<DetallePedidoServicio> = [];


  print(pedido: Pedido): void {

    this.idpedido = pedido.idpedido
    console.log(pedido.idpedido);
    /*this.pedidoService.getPedido(pedido).subscribe((data) => {

    })*/

    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css" rel="stylesheet">
<!-- Material Design Bootstrap -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.19.1/css/mdb.min.css" rel="stylesheet">
          <title>Print tab</title>
          <style >
          //........Customized style.......
         
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  //---------------------- DATA TABLE ---------------------------------
  @ViewChild(MdbTablePaginationComponent, { static: true })
  mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;

  previous: any = [];
  searchText: string = "";



  @HostListener("input") oninput() {
    this.searchItems();
  }
  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.pedidos = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.pedidos = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(6);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  data(pedidos: Array<any>) {

    this.mdbTable.setDataSource(pedidos);
    pedidos = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }
}


/*data(pedidos: any) {
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
    //  console.log(pedido);
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
}*/
