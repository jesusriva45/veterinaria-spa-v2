import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ModalDirective } from "projects/angular-bootstrap-md/src/public_api";
import { MDBModalRef, MDBModalService } from "angular-bootstrap-md";
import { Cliente } from "src/app/models/cliente";
import { Mascota } from "src/app/models/mascota";
import { Tipomascota } from "src/app/models/tipomascota";
import { MascotaService } from "src/app/services/mascota.service";
import swal from "sweetalert2";
import { AuthService } from "src/app/services/auth.service";
import { Usuario } from "src/app/models/usuario";
import { Raza } from "src/app/models/raza";
import { Historial } from "src/app/models/historial";
import { HistorialService } from "src/app/services/historial.service";

@Component({
  selector: "app-registro-mascota",
  templateUrl: "./registro-mascota.component.html",
  styleUrls: ["./registro-mascota.component.scss"],
})
export class RegistroMascotaComponent implements OnInit {
  mascotas: Mascota[] = [];

  mascotasDeCliente: Mascota[] = [];

  mascota: Mascota = new Mascota();

  tipomascota: Tipomascota[] = [];

  razas: Raza[] = [];

  historial: Historial[] = [];

  historialPorMascota: Historial;

  titulo: string = "Agregar Mascota";
  /*** */

  button = document.getElementsByClassName("crud");
  input = document.getElementsByClassName("form-input");

  /***** */
  myform: FormGroup;
  IdMascota: FormControl;
  Nombres: FormControl;
  RazaAnimal: FormControl;
  Estado: FormControl;
  FechaNacimiento: FormControl;
  Sexo: FormControl;
  TipoMascota: FormControl;
  Cliente: FormControl;
  clienteLog: Usuario;
  myImgUrl: string;
  sexo = [
    { value: "MACHO", descripcion: "MACHO" },
    { value: "HEMBRA", descripcion: "HEMBRA" },
    { value: "Otros", descripcion: "Otros..." },
  ];

  status = [
    { value: 1, descripcion: "ACTIVO" },
    { value: 0, descripcion: "INACTIVO" },
  ];

  constructor(
    private mascotasService: MascotaService,
    private historialService: HistorialService,
    public router: Router,
    public _authService: AuthService //private modalService: NgbModal
  ) {
    this.myImgUrl = "../../../../assets/img/no-image.png";
  }

  authService = this._authService;

  ngOnInit(): void {
    this.getMascotas();

    //------------- CLIENTE LOGUEADO AL SISTEMA
    this.getMascotasDeCliente(this._authService.usuario.idusuario);

    //------------- USUARIO LOGUEADO AL SISTEMA
    this.getClienteIdUsuario(this._authService.usuario);

    // console.log(this.getClienteIdUsuario(this.authService.usuario));

    this.createFormControls();
    this.createForm();

    //getMascotasDeCliente(id_cliente) {
    this.historialService
      .getHistorial()
      .subscribe((data) => {
        this.historial = data;
        console.log(data)
      });   // }






  }

  submitted: boolean = false;

  createFormControls() {
    this.IdMascota = new FormControl("", [Validators.nullValidator]);
    this.Nombres = new FormControl("", [
      Validators.required,
      Validators.pattern(
        "^[A-Z]{1}([a-z]{1,})?([ ][A-Z]{1})?([a-z]{1,})?[ ]?([a-zA-Z]{1,})?[ ]?([a-zA-Z]{1,})?$"
      ),
      Validators.minLength(4),
      Validators.maxLength(30),
    ]);
    this.RazaAnimal = new FormControl("", [Validators.required]);
    this.FechaNacimiento = new FormControl("", [Validators.required]);
    this.Sexo = new FormControl("", [Validators.required]);
    this.TipoMascota = new FormControl("", [Validators.required]);
    this.Estado = new FormControl("", [Validators.required]);
    //this.Cliente = new FormControl("", [Validators.required]);
  }

  createForm() {
    this.myform = new FormGroup({
      name: new FormGroup({
        IdMascota: this.IdMascota,
        Nombres: this.Nombres,
        RazaAnimal: this.RazaAnimal,
        Estado: this.Estado,
        FechaNacimiento: this.FechaNacimiento,
        Sexo: this.Sexo,
        TipoMascota: this.TipoMascota,
        //Cliente: this.Cliente,
      }),
    });
  }
  cerrarmodal() {
    this.submitted = false;
    this.basicModal.hide();
    this.myform.reset();

    //this.usuarioService.getRegiones().subscribe((ubigeo) => (this.ubigeo = []));
  }
  @ViewChild("basicModal", { static: true }) basicModal: ModalDirective;
  //@ViewChild("content", { static: true }) public contentModal;

  openModalCrud(accion: string, mascota?: Mascota): void {
    this.createFormControls();
    this.createForm();



    this.basicModal.show();

    if (accion == "editar") {
      this.titulo = "Actualizar Información";
      mascota.idmascota;
      this.getMascota(mascota.idmascota);
      this.IdMascota.setValue(mascota.idmascota);
      this.Nombres.setValue(mascota.nombre);
      this.Sexo.setValue(mascota.sexo);
      this.Estado.setValue(mascota.estado);
      this.getTipoMascota();
      this.getRaza(mascota.tipomascota.idtipomascota);
      console.log(mascota.tipomascota.idtipomascota);
    } else if (accion == "agregar") {
      this.mascota.foto = this.myImgUrl;
      this.mascota.usuario = this.clienteLog;
      this.getTipoMascota();
      this.mascota.idmascota = 0;
      this.titulo = "Registro de Mascota";
      this.myform.reset();
      //this.modalAgregar();
      //this.myform.clearValidators();
    }
  }

  //----------------------------- SUBMIT DE FORMULARIO

  verificarDatos(): void {
    for (let j = 0; j < this.input.length; j++) {
      if (this.myform.invalid) {
        swal.fire({
          icon: "error",
          title: "Cuidado...! Aun te faltan datos por completar. ",
          // text: 'Oops...'
        });
        this.submitted = true;
        console.log(this.submitted);
        //this.myform.invalid;
      }
      if (this.myform.valid) {
        //this.click = false;
        swal
          .fire({
            title: "Verificar tus datos antes de continuar...",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, registrarse",
          })
          .then((result) => {
            if (this.mascota.idmascota === 0) {
              if (result.isConfirmed) {
                swal.fire(
                  "Registro Exitoso...!",
                  `${this.mascota.nombre} bienvenido a nuestra veterinaria`,
                  "success"
                );
                this.mascota.usuario = this.clienteLog;
                this.insert();
                this.basicModal.hide();
                // this.modalService.dismissAll();
              }
            } else if (
              this.mascota.idmascota != 0 &&
              this.mascota.idmascota > 0
            ) {
              if (result.isConfirmed) {
                console.log("click update");
                swal.fire(
                  "Update Exitoso...!",
                  `${this.mascota.idmascota} tus datos se actualizaron correctamente`,
                  "success"
                );
                this.update();
                this.basicModal.hide();
                //this.modalService.dismissAll();
              }
            }
          });
      }
    }
  }

  //--------------------------------------------------------------------

  //----------------------- MODAL DETALLE MASCOTA -------------------------

  @ViewChild("modalDetalle", { static: true })
  modalDetalle: ModalDirective;

  cerrarmodalDetalle() {
    //this.submitted = false;
    //this.modalService.dismissAll();
    this.modalDetalle.hide();
    this.myform.reset();
    //this.usuarioService.getRegiones().subscribe((ubigeo) => (this.ubigeo = []));
  }

  modalDetail(mascota: Mascota) {
    this.modalDetalle.show();
    this.getMascota(mascota.idmascota);
    console.log();
    this.getTipoMascota();
  }

  //------------------------ COMBO TIPO MASCOTA -----------------------

  compareTipomascota(p1: Tipomascota, p2: Tipomascota): boolean {
    //console.log(t1.id_ubigeo + t2.id_ubigeo);

    if (
      (p1 === null && p2 === null) ||
      (p1 === undefined && p2 === undefined)
    ) {
      return true;
    } else if (
      p1 === null ||
      p2 === null ||
      p1 === undefined ||
      p2 === undefined
    ) {
      return false;
    } else {
      return p1.idtipomascota === p2.idtipomascota;
    }
  }
  //------------------------ COMBO TIPO MASCOTA -----------------------

  compareRaza(p1: Raza, p2: Raza): boolean {
    //console.log(t1.id_ubigeo + t2.id_ubigeo);

    if (
      (p1 === null && p2 === null) ||
      (p1 === undefined && p2 === undefined)
    ) {
      return true;
    } else if (
      p1 === null ||
      p2 === null ||
      p1 === undefined ||
      p2 === undefined
    ) {
      return false;
    } else {
      return p1.idraza === p2.idraza;
    }
  }

  //--------------- FOTO DE MASCOTA -----------------------------
  localUrl: any[];
  showPreviewImage1(event: any) {
    if (event.target.files && event.target.files[0]) {
      let typeFile = event.target.files[0].name;

      let cadenainvertida = typeFile.split("").reverse().join("");
      let extension = cadenainvertida.split(".")[0];
      let extensionFile = extension.split("").reverse().join("");

      /*console.log(cadenainvertida);
      console.log(extension);
      console.log(extensionFile);*/

      if (
        extensionFile != "jpg" &&
        extensionFile != "jpeg" &&
        extensionFile != "png"
      ) {
        swal.fire({
          title: `No se permiten archivos diferentes a jpg/jpeg/png`,
          icon: "warning",
        });
      } else {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.localUrl = event.target.result;
          // console.log(this.localUrl);
          this.mascota.foto = this.localUrl.toString();
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }

  //------------------------------------------------------------------------

  onChangeTipoMascota(e) {
    if (
      this.mascota?.tipomascota == null ||
      this.mascota?.tipomascota == undefined
    ) {
      //this.getRaza(undefined);
    } else {
      this.getRaza(e.idtipomascota);
    }
  }

  //----------------------------------- CURD MASCOTA  -----------------------

  insert(): void {
    this.mascotasService.insert(this.mascota).subscribe((response) => {

      /* this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });*/
      this.getMascotasDeCliente(response.usuario.idusuario);


      this.getMascotas();
      // this.router.navigate([window.location.reload()]);
    });
  }

  update(): void {
    this.mascotasService.update(this.mascota).subscribe((response) => {
      /* let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });*/
      this.getMascotasDeCliente(response.usuario.idusuario);
      this.getMascotas();
      // this.router.navigate([window.location.reload()]);
    });
  }

  delete(mascota: Mascota): void {
    swal
      .fire({
        title: `Seguro desea eliminar a ${mascota.nombre}...`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.mascotasService
            .delete(mascota.idmascota)
            .subscribe((response) => {
              this.mascotas = this.mascotas.filter((mas) => {
                mas != mascota;
              });

              swal.fire(`Su mascota ha sido eliminada...!`, "success");
            });
        }
      });
  }

  //------- CLIENTE LOGUEADO AL SISTEMA

  getClienteIdUsuario(usu: Usuario) {
    this.mascotasService.getCliente(usu).subscribe((cliente) => {
      this.clienteLog = cliente;
      // console.log(cliente);
    });
  }
  //------------------------
  getMascota(idMascota: number) {
    this.mascotasService
      .getMascota(idMascota)
      .subscribe((data) => (this.mascota = data));
  }

  getTipoMascota() {
    this.mascotasService
      .getTipoMascota()
      .subscribe((data) => (this.tipomascota = data));
  }

  getRaza(idTipo: number) {
    this.mascotasService.getRaza(idTipo).subscribe((data) => {
      this.razas = data;
      //console.log(data);
    });
  }

  getMascotas() {
    this.mascotasService
      .getMascotas()
      .subscribe((data) => (this.mascotas = data));
  }

  getMascotasDeCliente(id_cliente: number) {
    this.mascotasService
      .getMascotasDelCliente(id_cliente)
      .subscribe((data) => (this.mascotasDeCliente = data));
  }
}
