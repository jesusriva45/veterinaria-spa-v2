import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SerCategoria } from "src/app/models/ser-categoria";
import { Servicio } from "src/app/models/servicio";
import { ServicioService } from "src/app/services/servicio.service";
import swal from "sweetalert2";

import { AngularEditorConfig } from "@kolkov/angular-editor";

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
  //FechaAten: FormControl;
  IdCategoria: FormControl;

  //----------- VISIBILIDAD DE MENSAJE DE ERROR DE CAMPOS DE FORMULARIO ----------------
  submitted: boolean = false;

  //----------------------------------------------------
  button = document.getElementsByClassName("crud");
  input = document.getElementsByClassName("form-input");

  //------------------------------------------------------

  constructor(
    private servicioService: ServicioService,
    private router: Router // private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.servicioService
      .getServicios()
      .subscribe((data) => (this.servicios = data));
  }

  //------------------------ EDITOR DE TEXTO - DESCRIPCION ----------------------

  htmlContent = "";
  htmlContent2 = "";

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "auto",
    minHeight: "0",
    maxHeight: "auto",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Enter text here...",
    defaultParagraphSeparator: "",
    defaultFontName: "",
    defaultFontSize: "",
    fonts: [
      { class: "arial", name: "Arial" },
      { class: "times-new-roman", name: "Times New Roman" },
      { class: "calibri", name: "Calibri" },
      { class: "comic-sans-ms", name: "Comic Sans MS" },
    ],
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
    uploadUrl: "v1/image",
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: "top",
    toolbarHiddenButtons: [["bold", "italic"], ["fontSize"]],
  };

  //------------------------ VALIDACION DE FORMULARIO ---------------------------

  createFormControls() {
    this.IdServicio = new FormControl("", Validators.nullValidator);
    this.Nombre = new FormControl("", Validators.required);
    this.Precio = new FormControl("", Validators.required);
    this.Descripcion = new FormControl("", Validators.required);
    //this.FechaAten = new FormControl('', Validators.required);
    this.IdCategoria = new FormControl("", Validators.required);
  }

  createForm() {
    this.myform = new FormGroup({
      name: new FormGroup({
        IdServicio: this.IdServicio,
        Nombre: this.Nombre,
        Precio: this.Precio,
        Descripcion: this.Descripcion,
        //FechaAten: this.FechaAten,
        IdCategoria: this.IdCategoria,
      }),
    });
  }

  //------------------ RENDERIZADO DE MODAL PARA CRUD DE SERVICIOS---------------------------------

  openModalCrud(
    targetModal: Component,
    accion: string,
    idServicio?: number
  ): void {
    this.createFormControls();
    this.createForm();

    /*this.modalService.open(targetModal, {
      centered: true,
      animation: true,
      backdropClass: "modal-backdrop",
      size: "xl",
      keyboard: false,
    });*/

    if (accion == "detalle") {
      //this.titulo = "Detalles de Usuario"

      console.log(this.servicio.idservicio);
      this.getServicio(idServicio);

      this.getCategoria();

      for (let j = 0; j < this.input.length; j++) {
        this.input[j].setAttribute("disabled", "");
      }
    } else if (accion == "editar") {
      //this.titulo = 'Actualizar Información';

      this.getServicio(idServicio);

      this.getCategoria();
    } else if (accion == "agregar") {
      this.getCategoria();
      this.servicio.idservicio = 0;
      this.titulo = "Registro de Servicio";
      //this.modalAgregar();
      //this.myform.clearValidators();
    }
  }

  cerrarmodal() {
    this.submitted = false;
    //this.modalService.dismissAll();
    this.myform.reset();
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
      let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
      // this.router.navigate([window.location.reload()]);
    });
  }

  update(): void {
    this.servicioService.update(this.servicio).subscribe((response) => {
      let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
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
}
