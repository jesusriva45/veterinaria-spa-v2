import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDirective } from "projects/angular-bootstrap-md/src/public_api";
import { SerCategoria } from "src/app/models/ser-categoria";
import { Servicio } from "src/app/models/servicio";
import { ServicioService } from "src/app/services/servicio.service";
import swal from "sweetalert2";

import { AngularEditorConfig } from "@kolkov/angular-editor";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-crud-servicio",
  templateUrl: "./crud-servicio.component.html",
  styleUrls: ["./crud-servicio.component.scss"],
})
export class CrudServicioComponent implements OnInit {
  servicios: Servicio[] = [];

  servicio: Servicio = new Servicio();

  categoria: SerCategoria[] = [];

  titulo: string = "Agregar Servicio";
  //------------------------ CAMPOS DE FORMULARIO ---------------------------
  myform: FormGroup;
  IdServicio: FormControl;
  Nombre: FormControl;
  Precio: FormControl;
  Descripcion: FormControl;
  FechaAten: FormControl;
  IdCategoria: FormControl;

  //----------- VISIBILIDAD DE MENSAJE DE ERROR DE CAMPOS DE FORMULARIO ----------------
  submitted: boolean = false;

  //----------------------------------------------------
  button = document.getElementsByClassName("crud");
  input = document.getElementsByClassName("form-input");

  //------------------------------------------------------

  myImgUrl: string;
  //---------------------------------------------------------
  constructor(
    private servicioService: ServicioService,
    private router: Router,
    public _authService: AuthService // private modalService: NgbModal
  ) {
    this.myImgUrl = "../../../../assets/img/no-image.png";
  }

  ngOnInit(): void {
    this.listarServicios();

    this.createFormControls();
    this.createForm();
  }

  //------------------------ EDITOR DE TEXTO - DESCRIPCION ----------------------

  htmlContent = "";
  htmlContent2 = "";

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    //toolbarHiddenButtons: [["bold"]],
    sanitize: false,
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
  };

  //------------------------ VALIDACION DE FORMULARIO ---------------------------

  createFormControls() {
    this.IdServicio = new FormControl("", Validators.nullValidator);
    this.Nombre = new FormControl("", Validators.required);
    this.Precio = new FormControl("", [
      Validators.required,
      Validators.pattern("[0-9]+([.][0-9]{1,2})?"),
    ]);
    this.Descripcion = new FormControl("", Validators.required);
    this.FechaAten = new FormControl("", Validators.required);
    this.IdCategoria = new FormControl("", Validators.required);
  }

  createForm() {
    this.myform = new FormGroup({
      name: new FormGroup({
        IdServicio: this.IdServicio,
        Nombre: this.Nombre,
        Precio: this.Precio,
        Descripcion: this.Descripcion,
        FechaAten: this.FechaAten,
        IdCategoria: this.IdCategoria,
      }),
    });
  }
  //----------------- CAPTURAR FILE FOTOS -----------------------------

  localUrl: ArrayBuffer[];

  showPreviewImage1(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
        //console.log(this.localUrl);
        this.servicio.foto1 = this.localUrl.toString();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  showPreviewImage2(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
        //console.log(this.localUrl);
        this.servicio.foto2 = this.localUrl.toString();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  //-----------------------------------------------------------------

  //---------------------------- DETALLE DE SERVICIO -------------------------------------
  @ViewChild("modalDetail", { static: true }) modalDetail: ModalDirective;
  SerDescrip: string;
  SerNom: string;
  SerCategoria: string;
  modalDetalle(servicio: Servicio) {
    this.modalDetail.show();
    this.getServicio(servicio.idservicio);
    this.SerDescrip = `${servicio.descripcion}`;
    this.SerNom = `${servicio.nombre}`;
    this.SerCategoria = `${servicio.serCategoria.descripcion}`;
  }

  cerrarmodalDetalle() {
    this.submitted = false;
    //this.modalService.dismissAll();

    this.modalDetail.hide();
    this.myform.reset();
    //this.usuarioService.getRegiones().subscribe((ubigeo) => (this.ubigeo = []));
  }
  //------------------ RENDERIZADO DE MODAL PARA CRUD DE SERVICIOS---------------------------------

  @ViewChild("contentModal", { static: true }) contentModal: ModalDirective;

  cerrarmodal() {
    this.submitted = false;
    this.contentModal.hide();
    this.myform.reset();
  }

  openModalCrud(accion: string, servicio?: Servicio): void {
    this.createFormControls();
    this.createForm();

    this.contentModal.show();

    /*this.modalService.open(targetModal, {
      centered: true,
      animation: true,
      backdropClass: "modal-backdrop",
      size: "xl",
      keyboard: false,
    });*/

    if (accion == "editar") {
      this.titulo = "ACTUALIZAR SERVICIO";

      this.getServicio(servicio.idservicio);
      this.IdServicio.setValue(this.servicio.idservicio);
      this.Nombre.setValue(this.servicio.nombre);
      this.Precio.setValue(this.servicio.precio);
      this.Descripcion.setValue(this.servicio.descripcion);

      this.getCategoria();
    } else if (accion == "agregar") {
      //this.myform.reset();
      this.titulo = "REGISTRAR SERVICIO";
      this.servicio.idservicio = 0;
      this.servicio.foto1 = null;
      this.servicio.foto2 = null;
      this.getCategoria();
      //this.modalAgregar();
      //this.myform.clearValidators();
    }
  }

  compareCategoria(c1: SerCategoria, c2: SerCategoria): boolean {
    //console.log(t1.id_ubigeo + t2.id_ubigeo);

    if (
      (c1 === null && c2 === null) ||
      (c1 === undefined && c2 === undefined)
    ) {
      return true;
    } else if (
      c1 === null ||
      c2 === null ||
      c1 === undefined ||
      c2 === undefined
    )
      return false;
    else {
      return c1.idcategoria === c2.idcategoria;
    }
  }

  //--------------------- VERIFICACION DE DATOS AL DAR SUBMIT AL FORMULARIO ---------------

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
            title: "Verificar los datos antes de continuar...",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, registrarse",
          })
          .then((respuestaDeConfirmacion) => {
            if (this.servicio.idservicio === 0) {
              if (respuestaDeConfirmacion.isConfirmed) {
                swal.fire(
                  "Registro Exitoso...!",
                  `${this.servicio.nombre} servicio agregado correctamente`,
                  "success"
                );
                this.insert();
                this.contentModal.hide();
                //this.modalService.dismissAll();
              }
            } else if (
              this.servicio.idservicio != 0 &&
              this.servicio.idservicio > 0
            ) {
              if (respuestaDeConfirmacion.isConfirmed) {
                swal.fire(
                  "Update Exitoso...!",
                  `${this.servicio.nombre} los datos se actualizaron correctamente`,
                  "success"
                );
                this.update();
                this.contentModal.hide();
                //this.modalService.dismissAll();
              }
            }
          });
      }
    }
  }

  //----------------------- CRUD DE SERVICIOS ---------------------------
  insert(): void {
    this.servicioService.insert(this.servicio).subscribe((response) => {
      /* let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });*/
      this.listarServicios();
      // this.router.navigate([window.location.reload()]);
    });
  }

  update(): void {
    this.servicioService.update(this.servicio).subscribe((response) => {
      /* let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });*/
      this.listarServicios();
      // this.router.navigate([window.location.reload()]);
    });
  }

  delete(servicio: Servicio): void {
    swal
      .fire({
        title: `Seguro desea eliminar el producto ${servicio.nombre}... ?`,
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
          this.servicioService
            .delete(servicio.idservicio)
            .subscribe((response) => {
              this.servicios = this.servicios.filter(
                (prod) => prod != servicio
              );
              swal.fire(
                `El Producto ${this.servicio.nombre} ha sido eliminado...!`,
                "success"
              );
            });
        }
      });
  }

  getServicio(idServicio) {
    this.servicioService
      .getServicio(idServicio)
      .subscribe((data) => (this.servicio = data));
  }

  getCategoria() {
    this.servicioService
      .getCategoria()
      .subscribe((data) => (this.categoria = data));
  }

  listarServicios() {
    this.servicioService
      .getServicios()
      .subscribe((data) => (this.servicios = data));
  }
}
