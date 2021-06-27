import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from "@angular/core";
import { Router } from '@angular/router';
import { Cita } from 'src/app/models/cita';
import { AuthService } from 'src/app/services/auth.service';
import { CitaService } from 'src/app/services/cita.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from "sweetalert2";
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDirective } from "projects/angular-bootstrap-md/src/public_api";
//----------------- DATA TABLE ------------------------
import {
  MdbTableDirective,
  MdbTablePaginationComponent,
} from "angular-bootstrap-md";
import { ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
//--------------------------------------------------

@Component({
  selector: 'app-detalle-cita',
  templateUrl: './detalle-cita.component.html',
  styleUrls: ['./detalle-cita.component.scss']
})
export class DetalleCitaComponent implements OnInit {

  citas: Cita[] = [];

  cita: Cita = new Cita;

  dniUser: string;
  estadoCita: string;

  constructor(private citaService: CitaService,
    private router: Router,
    public cdRef: ChangeDetectorRef,
    public authService: AuthService,
    private sserviceUsuario: UsuarioService) {
    this.dniUser = null;
    this.estadoCita = null;
  }

  ngOnInit(): void {
    this.listarCitasDeUsuario();
    this.createFormControls()



    if (this.authService.hasRole("ROLE_CLIENTE")) {
      this.dniUser = this.authService.usuario.dni;
    }

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
    sessionStorage.setItem('servicio', JSON.stringify(el.servicio));
  }

  timeCheck() {
    setTimeout(() => {
      if (this.citas != null) {
        this.checkBox();
      }
    }, 500);
  }

  //--------------------------------



  //--------------------------- MODAL DETALLE -----------

  @ViewChild("modalPago", { static: true }) modalPago: ModalDirective;
  ProDescrip: string;

  cerrarmodalPago() {
    //this.modalService.dismissAll();
    this.modalPago.hide();
    this.myform.reset()
    //this.usuarioService.getRegiones().subscribe((ubigeo) => (this.ubigeo = []));
  }


  costo: number;
  nombreServ: string;
  categoriaServ: string;

  openModalPago(cita: Cita) {
    this.modalPago.show();
    this.cita = cita;
    this.nombreServ = cita.servicio.nombre
    this.costo = cita.servicio.precio
    this.categoriaServ = cita.servicio.serCategoria.descripcion
  }

  myform: FormGroup;

  createFormControls() {
    this.myform = new FormGroup({
      creditNumberForm: new FormControl("", [Validators.nullValidator,
      Validators.pattern(
        "^([1-9]{4}[ ])([1-9]{4}[ ])([1-9]{4}[ ])([1-9]{4})$"
      ),]),
      creditExpirationForm: new FormControl("", [
        Validators.required,
        Validators.pattern(
          "^([0-3][0-9][/])([2][0][2-9][1-9])$"
        ),
      ]),
      creditCVVForm: new FormControl("", [Validators.nullValidator,
      Validators.pattern(
        "^([0-9]{3})$"
      ),]),
    });
    //this.Cliente = new FormControl("", [Validators.required]);
  }

  get creditNumberForm() {
    return this.myform.get("creditNumberForm");
  }
  get creditExpirationForm() {
    return this.myform.get("creditExpirationForm");
  }
  get creditCVVForm() {
    return this.myform.get("creditCVVForm");
  }




  creditNumber: string;
  creditExpiration: string;
  creditCVV: string;

  updatePago() {

    console.log(this.cita.idcita)

    if (this.myform.invalid) {
      swal
        .fire({
          title: "Completa tus datos",
          text: "",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "Ok",
        })
    } else {
      swal
        .fire({
          title: "Deseas realizar el pago de tu cita?...",
          text: "",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, pagar",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.cita.estado = "PAGADO"
            this.updatePagoCita(this.cita);
            swal.fire({
              title: 'Por favor espere mientras se realiza el pago',
              html: '<br><br><div class="spinner-border" role="status" style="width: 4rem; height: 4rem;"><br><span class="sr-only">Loading...</span><br></div><br><br>',
              timerProgressBar: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
              showConfirmButton: false,
            })
            this.cerrarmodalPago();
          }
        });
    }


  }




  //--------------------------

  //-------------- ANULAR CITA --------------
  cancelarCita(cita: Cita) {

    console.log(cita.idcita)
    //this.obtenerCita(cita);


    console.log(cita.idcita)
    this.updateEstadoForm(cita);
    //}
    //this.modalEstado.show();

  }
  updateEstadoForm(cita: Cita) {
    console.log("que pasas");

    //this.click = false;
    swal
      .fire({
        title: "Deseas cancelar tu cita?...",
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
          cita.estado = "CANCELADO"
          this.updateEstado(cita);
        }
      });
  }


  estados: string[] = ["TODOS", "PENDIENTE", "PAGADO", "ANULADO"];




  onChangeFiltrarCitaPorEstado(e) {

    let dni = (document.getElementById("search") as HTMLInputElement).value



    if (dni != "" && e != "TODOS") {

      this.filtrarCitaPorDniAndEstado(dni, e);

    } else if ((dni == "") && e == "TODOS") {

      this.citaService.getCitasDeUsuario(this.authService.usuario.idusuario).subscribe((data) => {
        this.citas = data;
        this.data(data);

      })
    } else if ((dni != "") && e == "TODOS") {
      this.citaService.getCitasDeUsuarioPorDni(dni).subscribe((data) => {
        this.citas = data;
        this.data(data);
      })
    } else if (dni == "" && e == "TODOS") {

      console.log("gaa");
    }
  }




  filtrarCitaPorDniAndEstado(dni_user: string, estado_user: string) {
    this.citaService
      .getCitasDeUsuarioPorDniAndEstado(dni_user, estado_user)
      .subscribe((data) => { this.citas = data; this.data(data); this.timeCheck(); console.log(data) });
  }

  listarCitasDeUsuario() {

    if (this.authService.hasRole('ROLE_CLIENTE')) {
      this.citaService.getCitasDeUsuario(this.authService.usuario.idusuario).subscribe((data) => {
        this.citas = data;
        this.dniUser = this.authService.usuario.dni;
        this.data(data);
        this.timeCheck()
      })
    }
  }

  listarCitasDeUsuarioSistema() {


    this.citaService.getCitasDeUsuario(this.authService.usuario.idusuario).subscribe((data) => {
      this.citas = data;
      this.dniUser = this.authService.usuario.dni;
      this.data(data);
      this.timeCheck()
    })

  }

  obtenerCita(id_cita: number) {
    this.citaService
      .getCita(id_cita)
      .subscribe((cita) => { this.cita = cita; console.log(this.cita.idcita) });
  }



  updateEstado(cita: Cita) {
    this.citaService.updateEstado(cita).subscribe((data) => {
      this.listarCitasDeUsuario()
      swal.fire({
        title: "Cita cancelada",
        text: "",
        icon: "success",
        confirmButtonText: "Ok",
      });
    })
  };


  updatePagoCita(cita: Cita) {
    this.citaService.updateEstado(cita).subscribe((data) => {
      this.listarCitasDeUsuario()
      swal.fire({
        title: "Pago realizado...!",
        text: "",
        icon: "success",
        confirmButtonText: "Ok",
      });
    })
  };




  //---------------------- DATA TABLE ---------------------------------
  @ViewChild(MdbTablePaginationComponent, { static: true })
  mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;

  headElements = ['idcita', 'fecha_registro', 'dia_atencion', 'hora_inicio', 'servicio.nombre', 'estado'];
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
      this.citas = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.citas = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }

  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();

  }

  data(citas: Array<any>) {


    this.mdbTable.setDataSource(citas);
    citas = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }

}
