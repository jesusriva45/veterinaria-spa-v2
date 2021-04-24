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

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.scss"],
})
export class UsuariosComponent implements OnInit {
  @Output() usuarios: Usuario[] = [];

  @Output() usuario: Usuario = new Usuario();

  @Output() ubigeo: Ubigeo[];

  button = document.getElementsByClassName("crud");
  input = document.getElementsByClassName("form-input");

  constructor(
    private usuarioService: UsuarioService,
    private modalService: MDBModalService,
    private _authService: AuthService //private modalService: NgbModal
  ) {}

  authService = this._authService;
  box = document.getElementsByClassName("check");
  Checked = null;
  ngOnInit(): void {
    //The class name can vary

    for (let index = 0; index < this.box.length; index++) {
      this.box[index].addEventListener("click", () => {
        if (this.Checked != null) {
          this.Checked.checked = false;
          this.Checked = this.box[index];
        }
        this.Checked = this.box[index];
      });
    }

    this.usuarioService
      .getUsuarios()
      .subscribe((usuarios) => (this.usuarios = usuarios));
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
      class: "modal-lg modal-dialog-scrollable",
      containerClass: "left",
      animated: true,
      data: { usuario: usu, usuarios: this.usuarios },
    });
  }

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
}
