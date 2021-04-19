import { Component, OnInit, ViewChild } from "@angular/core";
import { Usuario } from "../../models/usuario";

import { Router } from "@angular/router";

import { UsuarioService } from "../../services/usuario.service";

//import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MDBModalRef, MDBModalService } from "angular-bootstrap-md";

import swal from "sweetalert2";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Ubigeo } from "../../models/ubigeo";
import {
  ModalContainerComponent,
  ModalDirective,
} from "projects/angular-bootstrap-md/src/public_api";

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.scss"],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  usuario: Usuario = new Usuario();

  titulo: string = "Agregar Usuario";

  //---- parametro para detalle - actualizar
  idUsario: number;

  ubigeo: Ubigeo[];

  button = document.getElementsByClassName("crud");
  input = document.getElementsByClassName("form-input");

  //------------------- CAMPOS DE FORMULARIO --------------------------------

  //---------------------------------------------------------------------

  //mostrar alerta de validacion
  submitted: boolean = false;

  // button = document.getElementsByClassName("crud")
  @ViewChild("content", { static: true }) content: ModalDirective;
  public name: string;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private modalService: MDBModalService //private modalService: NgbModal
  ) {
    this.titulo;
  }

  myform: FormGroup;
  ngOnInit(): void {
    this.usuarioService
      .getUsuarios()
      .subscribe((usuarios) => (this.usuarios = usuarios));
    this.createForm();
  }

  ngOnDestroy() {}

  //------------------- VALIDACION DE FORMULARIO --------------------------------

  createForm() {
    this.myform = new FormGroup({
      // IdUsuario: new FormControl("", [Validators.nullValidator]),
      Nombres: new FormControl("", [Validators.required]),
      Apellidos: new FormControl("", [Validators.required]),
      Dni: new FormControl("", [
        Validators.required,
        Validators.pattern("[0-9]{8}"),
      ]),
      Telef: new FormControl("", [Validators.required]),
      Direc: new FormControl("", [Validators.required]),
      IdUbi: new FormControl(null, [Validators.required]),
      Correo: new FormControl("", [
        Validators.required,
        Validators.pattern(
          "^[a-zA-Z]{1,}([.]{1})?[a-zA-Z]{1,}[@]{1}[a-zA-Z]{1,}[.]{1}[a-z]{2,5}([.][a-z]{2,3})?$"
        ),
      ]),
      FechaNac: new FormControl("", [Validators.required]),
    });
  }

  get IdUsuario() {
    return this.myform.get("IdUsuario");
  }

  get Nombres() {
    return this.myform.get("Nombres");
  }

  get Apellidos() {
    return this.myform.get("Apellidos");
  }

  get Dni() {
    return this.myform.get("Dni");
  }
  get Telef() {
    return this.myform.get("Telef");
  }

  get Direc() {
    return this.myform.get("Direc");
  }
  get Correo() {
    return this.myform.get("Correo");
  }
  get FechaNac() {
    return this.myform.get("FechaNac");
  }
  get IdUbi() {
    return this.myform.get("IdUbi");
  }

  //-------------------- DATEPICKER------------

  //--------------------- RENDERIZADO DE MODAL PARA CRUD DE USUARIOS --------------------------

  openModalCrud(accion: string, idUsario?: number): void {
    //this.createFormControls();

    this.createForm();

    this.content.show(/*{
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: false,
      class: "",
      containerClass: "",
    }*/);

    if (accion == "detalle") {
      //this.titulo = "Detalles de Usuario"
      this.getUbigeo();
      console.log(this.usuario.idusuario);
      this.getUsuarioId(idUsario);

      for (let j = 0; j < this.input.length; j++) {
        this.input[j].setAttribute("disabled", "");
      }
    } else if (accion == "editar") {
      this.titulo = "Actualizar Información";
      this.usuario.idusuario = idUsario;
      this.getUsuarioId(idUsario);
      this.getUbigeo();
      console.log(this.usuario.idusuario);
    } else if (accion == "agregar") {
      this.usuario.idusuario = 0;
      this.titulo = "Registro de Usuario";
      this.getUbigeo();
      //this.modalAgregar();
      //this.myform.clearValidators();
    }
  }

  //---------- sin uso ----- NgbModal keyboard ------------
  alertDismiss(): boolean {
    this.myform.reset();
    this.submitted = false;
    return true;
  }

  cerrarmodal() {
    this.submitted = false;
    this.content.hide();
    this.myform.reset();
    //this.usuarioService.getRegiones().subscribe((ubigeo) => (this.ubigeo = []));
  }

  compareFn(c1: Ubigeo, c2: Ubigeo): boolean {
    return c1 && c2 ? c1.idubigeo === c2.idubigeo : c1 === c2;
  }

  compareUbigeo(c1: Ubigeo, c2: Ubigeo): boolean {
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
      return c1.idubigeo === c2.idubigeo;
    }
  }
  /*compareFn(o1: Ubigeo, o2: Ubigeo): boolean {
  if (o1 === undefined && o2 === undefined) {
    return true;
  }

  return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id_ubigeo === o2.id_ubigeo;
}*/

  verificarDatos() {
    console.log("que pasas");
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
            if (this.usuario.idusuario === 0) {
              if (result.isConfirmed) {
                swal.fire(
                  "Registro Exitoso...!",
                  `${this.usuario.nombres} bienvenido a nuestra veterinaria`,
                  "success"
                );
                this.insert();
                this.content.hide();
              }
            } else if (
              this.usuario.idusuario != 0 &&
              this.usuario.idusuario > 0
            ) {
              if (result.isConfirmed) {
                swal.fire(
                  "Update Exitoso...!",
                  `${this.usuario.nombres} tus datos se actualizaron correctamente`,
                  "success"
                );
                this.update();
                this.content.hide();
              }
            }
          });
      }
    }
  }

  //------------------ CRUD DE USUARIOS ---------------------------

  insert(): void {
    this.usuarioService.insert(this.usuario).subscribe((response) => {
      let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
      // this.router.navigate([window.location.reload()]);
    });
  }

  getUsuarioId(idUsario) {
    this.usuarioService
      .getUsuario(idUsario)
      .subscribe((usuario) => (this.usuario = usuario));
  }

  update(): void {
    this.usuarioService.update(this.usuario).subscribe((response) => {
      let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
      // this.router.navigate([window.location.reload()]);
    });
  }

  delete(usuario: Usuario): void {
    swal
      .fire({
        title: `Seguro desea eliminar al usuario ${usuario.nombres} ${usuario.apellidos}...`,
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
          this.usuarioService
            .delete(usuario.idusuario)
            .subscribe((response) => {
              this.usuarios = this.usuarios.filter((usu) => usu != usuario);
              swal.fire(
                `${this.usuario.nombres} ha sido eliminado...!`,
                "success"
              );
            });
        }
      });
  }

  getUbigeo() {
    this.usuarioService
      .getRegiones()
      .subscribe((ubigeo) => (this.ubigeo = ubigeo));
  }
}
