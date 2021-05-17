import { Component, OnInit, Output, ViewChild } from "@angular/core";
import { Usuario } from "../../models/usuario";
import { ModalFormComponent } from "../usuarios/modal-form/modal-form.component";

import { UsuarioService } from "../../services/usuario.service";

//import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MDBModalRef, MDBModalService } from "angular-bootstrap-md";

import swal from "sweetalert2";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Ubigeo } from "../../models/ubigeo";
import { ModalDirective } from "projects/angular-bootstrap-md/src/public_api";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { Rol } from "src/app/models/rol";
import { AccesoRol } from "src/app/models/acceso-rol";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-usuarios",
  animations: [
    trigger("enterAnimation", [
      transition(":enter", [
        style({ transform: "translateY(100%)", opacity: 0 }),
        animate("300ms", style({ transform: "translateY(y)", opacity: 1 })),
      ]),
      transition(":leave", [
        style({ transform: "translateY(0)", opacity: 1 }),
        animate("300ms", style({ transform: "translateY(100%)", opacity: 0 })),
      ]),
    ]),
  ],
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.scss"],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  usuario: Usuario = new Usuario();

  ubigeo: Ubigeo[];

  rol: Rol;

  roles: Rol[];

  acceso_rol: AccesoRol = new AccesoRol();

  button = document.getElementsByClassName("crud");
  input = document.getElementsByClassName("form-input");

  constructor(
    private usuarioService: UsuarioService,
    private modalService: MDBModalService,
    public router: Router,
    private _authService: AuthService //private modalService: NgbModal
  ) {}

  authService = this._authService;
  box = document.getElementsByClassName("check");
  Checked = null;

  //estado = new Array(true, false);

  status = [
    { estado: true, descripcion: "Activo" },
    { estado: false, descripcion: "Inactivo" },
  ];

  ngOnInit(): void {
    this.listarUsuarios();
    //The class name can vary

    for (let index = 0; index < this.status.length; index++) {
      let element = this.status[index];
      console.log(this.status[index].estado);
      console.log(this.status[index].descripcion);
    }

    for (let index = 0; index < this.box.length; index++) {
      this.box[index].addEventListener("click", () => {
        if (this.Checked != null) {
          this.Checked.checked = false;
          this.Checked = this.box[index];
        }
        this.Checked = this.box[index];
      });
    }

    this.getRoles();
  }

  ngOnDestroy() {}

  //-------------------- DATEPICKER------------

  //--------------------- RENDERIZADO DE MODAL PARA CRUD DE USUARIOS --------------------------
  modalRef: MDBModalRef;

  openModalCrud(usu?: Usuario): void {
    this.modalRef = this.modalService.show(ModalFormComponent, {
      backdrop: true,
      keyboard: false,
      focus: true,
      show: true,
      ignoreBackdropClick: true,
      class: "modal-fluid modal-dialog-scrollable",
      containerClass: "left",
      animated: true,
      data: { usuario: usu, usuarios: this.usuarios },
    });
  }

  //----------------------- FORM PARA ACTUALIZAR ESTADO ------------------------------

  myform: FormGroup;
  IdProducto: FormControl;

  updateEstadoForm() {
    console.log("que pasas");

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
      .then((result) => {
        if (this.usuario.idusuario == null) {
          if (result.isConfirmed) {
            swal.fire(
              "Actualizacion Fallida...!",
              `El usuario no existe ${this.usuario.nombres}`,
              "error"
            );
            console.log("sigue mal el insert");

            // this.modalRef.hide();
            console.log(this.usuario.idusuario);
          }
        } else if (this.usuario.idusuario > 0) {
          if (result.isConfirmed) {
            swal.fire(
              "Update Exitoso...!",
              `${this.usuario.nombres} tus datos se actualizaron correctamente`,
              "success"
            );
            this.updateEstado();
            this.modalUpdateEstado.hide();
          }
        }
      });
  }

  //---------------------------------------------------------------------------------

  //----------------------- MODAL ACTUALIZAR ESTADO -------------------------

  @ViewChild("modalUpdateEstado", { static: true })
  modalUpdateEstado: ModalDirective;

  cerrarmodal() {
    //this.submitted = false;
    //this.modalService.dismissAll();
    this.modalUpdateEstado.hide();
    //this.myform.reset();
    //this.usuarioService.getRegiones().subscribe((ubigeo) => (this.ubigeo = []));
  }

  modalEstado(usuario: Usuario) {
    this.modalUpdateEstado.show();
    this.getRoles();
    this.getUsuarioId(usuario);
  }

  //--------------------- ACTUALIZAR ESTADO DE USUARIO --------------------------

  updateEstado(): void {
    this.usuarioService.updateEstado(this.usuario).subscribe((response) => {
      let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
      // this.router.navigate([window.location.reload()]);
    });
  }
  //-----------------------------------------------------------------------------

  //----------------------- MODAL ASIGNAR ROL -------------------------

  @ViewChild("modalUpdateRol", { static: true })
  modalUpdateRol: ModalDirective;

  cerrarmodalRol() {
    //this.submitted = false;
    //this.modalService.dismissAll();
    this.modalUpdateRol.hide();
    //this.myform.reset();
    //this.usuarioService.getRegiones().subscribe((ubigeo) => (this.ubigeo = []));
  }

  modalRol(usuario: Usuario) {
    console.log(usuario.idusuario);
    this.modalUpdateRol.show();
    this.getRolUsuarioId(usuario);
    this.acceso_rol.idusuario = usuario.idusuario;
    console.log();
    this.getRoles();
  }

  compareRol(c1: Rol, c2: Rol): boolean {
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
      return c1.idrol === c2.idrol;
    }
  }

  //------------------ FORM ASIGNAR ROL ---------------------------------

  formRol: FormGroup;

  updateRolForm() {
    console.log("que pasas");

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
      .then((result) => {
        if (this.acceso_rol.idusuario == null) {
          if (result.isConfirmed) {
            swal.fire(
              "Actualizacion Fallida...!",
              `El usuario no existe ${this.usuario.nombres}`,
              "error"
            );
            console.log("sigue mal el insert");

            // this.modalRef.hide();
            console.log(this.usuario.idusuario);
          }
        } else if (this.acceso_rol.idusuario > 0) {
          if (result.isConfirmed) {
            swal.fire(
              "Update Exitoso...!",
              `${this.usuario.nombres} tus datos se actualizaron correctamente`,
              "success"
            );
            this.updateRol();
            this.modalUpdateRol.hide();
          }
        }
      });
  }

  updateRol(): void {
    this.usuarioService.asignarRol(this.acceso_rol).subscribe((response) => {
      let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
      // this.router.navigate([window.location.reload()]);
    });
  }

  //-----------------------------------------------------------------------------

  //------------------ ELIMINAR USUARIO ---------------------------

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

  //--------------- BUSCAR USUARIO POR ID ----------------

  getUsuarioId(usu: Usuario) {
    this.usuarioService
      .getUsuario(usu)
      .subscribe((usuario) => (this.usuario = usuario));
  }

  //----------- BUSCAR USUARIO POR ID PARA OBTENER SU ROL

  getRolUsuarioId(usu: Usuario) {
    this.usuarioService
      .getRolUsuarioPorId(usu.idusuario)
      .subscribe((acceso_rol) => (this.acceso_rol = acceso_rol));
  }

  getRoles() {
    this.usuarioService.getRoles().subscribe((roles) => (this.roles = roles));
  }

  //habil: boolean = true;

  listarUsuarios() {
    this.usuarioService
      .getUsuarios()
      .subscribe((usuarios) => (this.usuarios = usuarios));
  }
}
