import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Ubigeo } from "src/app/models/ubigeo";
import { Usuario } from "src/app/models/usuario";
import { AuthService } from "src/app/services/auth.service";
import { ClienteService } from "src/app/services/cliente.service";
import { UbigeoService } from "src/app/services/ubigeo.service";
import { UsuarioService } from "src/app/services/usuario.service";
//import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";



@Component({
  selector: "app-registro-cliente",
  templateUrl: "./registro-cliente.component.html",
  styleUrls: ["./registro-cliente.component.css"],
})
export class RegistroClienteComponent implements OnInit {
  //model: NgbDateStruct;

  usuario: Usuario;

  usuarios: Usuario[];
  ubigeo: Ubigeo[];

  submitted: boolean = false;
  titulo: string;

  myform: FormGroup;

  dniDiferentesAlActual = [];

  dniDiferentesAlActual2 = [];

  usernameDiferentesAlActual = [];

  usernameDiferentesAlActual2 = [];

  //------------- NUEVO UBIGEO ------------

  departamentos: String[];
  provincias: String[];
  distritos?: Ubigeo[];
  //---------------------------------------

  constructor(
    private usuarioService: UsuarioService,
    public clienteService: ClienteService,
    public ubigeoService: UbigeoService,
    public router: Router,
    public _authService: AuthService
  ) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    this.getDepartamentos();
    this.getValidarUserNameDni();
    this.createForm();
  }

  //---------------- FILTRADO DE DNI -----------------------------

  //------------------ FORM CONTROL USERNAME PERSONALIZADO -------------------------------

  /*isLegitimateStarkUsername(username: string): boolean {
    return this.usernameDiferentesAlActual2.some((userActual) => {
      if (userActual == username) {
        Swal.fire(
          "Username Duplicado...!",
          `El username ${this.UserName.value} ya existe`,
          "error"
        );
        //console.log(this.Dni.errors);
        // console.log(this.Dni.value);
        //this.submittedDni = true;
        return true;
      } else {
        return false;
      }
    });
  }*/

  /*formControlPersonalizadoUsername(control: AbstractControl): {
    [key: string]: any;
  } {
    // this.usuarios.map((data) => {
    if (this.isLegitimateStarkUsername(control.value)) {
      return { nick: true };

      //console.log(data.idusuario);
    } else {
      return null;
    }
    //  });
  }*/

  //-------------------------------------------------------------------------------------------------

  //------------------------------- FORM CONTROL PERSONALIZADO DNI----------------------

  isLegitimateStark(dni: string): boolean {
    return this.dniDiferentesAlActual2.some((dniActual) => {
      if (dniActual == dni) {
        Swal.fire(
          "DNI Duplicado...!",
          `El DNI ${this.Dni.value} ya existe`,
          "error"
        );
        //console.log(this.Dni.errors);
        // console.log(this.Dni.value);
        //this.submittedDni = true;
        return true;
      } else {
        return false;
      }
    });
  }

  formControlPersonalizado(control: AbstractControl): { [key: string]: any } {
    // this.usuarios.map((data) => {
    if (this.isLegitimateStark(control.value)) {
      return { stark: true };

      //console.log(data.idusuario);
    } else {
      return null;
    }
    //  });
  }
  //----------------------------------------------------------

  //------------------- VALIDACION DE FORMULARIO --------------------------------

  createForm() {
    this.myform = new FormGroup({
      IdUsuario: new FormControl("", [Validators.nullValidator]),
      Nombres: new FormControl("", [
        Validators.required,
        Validators.pattern(
          "^[A-Z]{1}([a-z]{1,})?([ ][A-Z]{1})?([a-z]{1,})?[ ]?([a-zA-Z]{1,})?[ ]?([a-zA-Z]{1,})?$"
        ),
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      Apellidos: new FormControl("", [
        Validators.required,
        Validators.pattern(
          "^[A-Z]{1}([a-z]{1,3})?([ ][A-Z]{1})?([a-z]{1,})?[ ]?([a-zA-Z]{1,})?[ ]?([a-zA-Z]{1,})?$"
        ),
        Validators.minLength(4),
        Validators.maxLength(40),
      ]),
      Dni: new FormControl("", [
        Validators.pattern("[0-9]{8}"),
        this.formControlPersonalizado.bind(this),
      ]),
      Telef: new FormControl("", [
        Validators.required,
        Validators.pattern("^((([0-9]{7})|([0-9]{9})))$"),
      ]),
      Direc: new FormControl("", [
        Validators.required,

        Validators.minLength(10),
        Validators.maxLength(50),
      ]),
      Depart: new FormControl(undefined, [
        Validators.nullValidator,
        Validators.required,
      ]),
      Prov: new FormControl(undefined, [
        Validators.nullValidator,
        Validators.required,
      ]),
      IdUbi: new FormControl(undefined, [
        Validators.nullValidator,
        Validators.required,
      ]),
      Correo: new FormControl("", [
        Validators.required,
        Validators.pattern(
          "^([0-9]{1,20})?([.]{1})?([a-zA-Z]{1,})([.]{1})?([0-9]{1,20})?([.]{1})?([a-zA-Z]{1,})([.]{1})?([0-9]{1,20})?([a-zA-Z]{1,})([.]{1})?([0-9]{1,20})?[@]{1}[a-zA-Z]{1,}[.]{1}[a-z]{2,5}([.][a-z]{2,3})?$"
        ),
      ]),
      FechaNac: new FormControl("", [Validators.required]),
      Password: new FormControl("", [Validators.required]),
      /*UserName: new FormControl("", [
        Validators.required,
        this.formControlPersonalizadoUsername.bind(this),
      ]),*/
    });
  }


  validaCampos(campo: string) {
    let casoError = this.myform.controls[campo].errors;

    return this.myform.controls[campo].errors && this.myform.controls[campo].touched
  }

  validator(): Validators {
    if (this.usuario.direccion == "jesus@gmail.com")
      console.log("si sale la validacion con funciones");
    return true;
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

  get Depart() {
    return this.myform.get("Depart");
  }
  get Prov() {
    return this.myform.get("Prov");
  }

  get Password() {
    return this.myform.get("Password");
  }

  /*get UserName() {
    return this.myform.get("UserName");
  }*/

  //----------------------- UBIGEO ----------------------------------
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

  //---------------------- VALIDACION DE FORMULARIO ------------------------------

  submittedDni: boolean = false;
  verificarDatos() {
    console.log("que pasas");

    if (this.myform.invalid) {
      Swal.fire({
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
      Swal.fire({
        title: "Verificar tus datos antes de continuar...",
        text: "",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, registrarse",
      }).then((result) => {
        if (this.usuario.idusuario == null) {
          if (result.isConfirmed) {


            this.insert();
            //let timerInterval


            /* Swal.fire({
               title: 'Por favor espere mientras registramos sus datos',
               html: '<br><br><div class="spinner-border" role="status" style="width: 4rem; height: 4rem;"><br><span class="sr-only">Loading...</span><br></div><br><br>',
               timerProgressBar: true,
               allowOutsideClick: false,
               allowEscapeKey: false,
               showConfirmButton: false,
             })*/
          }
        } else if (
          this.usuario.idusuario != null &&
          this.usuario.idusuario > 0
        ) {
          if (result.isConfirmed) {
            Swal.fire(
              "Update Exitoso...!",
              `${this.usuario.nombres} tus datos se actualizaron correctamente`,
              "success"
            );
            //this.update();
          }
        }
      });
    }
  }

  //------------------------------------------------------------------------

  //-------------------- CRUD DE CLIENTE --------------------------------------
  errores: string[];
  insert(): void {
    let nom = this.Nombres.value;
    this.clienteService.insert(this.usuario).subscribe(
      (usuario) => {

        this.myform.reset();
        Swal.fire(
          "Registro Exitoso...!",
          `${nom} bienvenido a nuestra veterinaria`,
          "success"
        );
        this.Depart.setValue(undefined);
        this.myform.reset()
      },
      /*  (err) => {
          this.errores = err.error.mensaje as string[];
  
          console.log(this.errores)
  
          Swal.fire(
            "Error...!",
            `${err.mensaje} `,
            "error"
          );
          console.error("Código del error desde el backend: " + err.status);
          console.error(err.error.errors);
        },
        () => {
          console.warn("");
        }*/
    );
  }

  //-------------- --- UBIGEO -------------------

  de: string;

  pr: string;

  getDepartamentos() {
    this.ubigeoService
      .getDepartamentos()
      .subscribe((depart) => (this.departamentos = depart));
  }

  onChangeDepart(depart) {
    if (depart == null || depart == undefined) {
      this.getProvincias(undefined);
      this.de = depart;

      //this.myform.controls["Prov"].setErrors({ incorrect: true });
      //this.myform.controls["IdUbi"].setErrors({ incorrect: true });
      this.myform.controls["Prov"].setValue(undefined);
      this.myform.controls["IdUbi"].setValue(undefined);
    } else {
      this.de = depart;
      this.myform.controls["Prov"].setValue(undefined);
      this.myform.controls["IdUbi"].setValue(undefined);

      this.getProvincias(depart);
    }
  }

  getProvincias(depart: string) {
    this.ubigeoService
      .getProvincias(depart)
      .subscribe((prov) => (this.provincias = prov));
  }

  onChangeProv(prov) {
    //console.log(prov);

    if (prov == null || prov == undefined) {
      this.getDistritos(null, null);
      this.myform.controls["IdUbi"].setValue(undefined);
    } else {
      this.myform.controls["IdUbi"].setValue(undefined);
      this.getDistritos(this.de, prov);
      // this.myform.controls["IdUbi"].setErrors({ incorrect: true });
    }
  }

  getDistritos(d: string, p: string) {
    this.ubigeoService
      .getDistritos(d, p)
      .subscribe((dist) => (this.distritos = dist));
  }

  getValidarUserNameDni() {
    this.usuarioService.getUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
      this.usuarios.forEach((i) => {
        this.dniDiferentesAlActual.push(i.dni);
      });

      //     console.log(this.dniDiferentesAlActual);

      this.dniDiferentesAlActual2 = this.dniDiferentesAlActual.filter(
        (dni) => dni != this.usuario.dni
      );
      // console.log(this.dniDiferentesAlActual2);
      // console.log(this.usuarios);

      this.usuarios.forEach((i) => {
        this.usernameDiferentesAlActual.push(i.username);
      });

      // console.log(this.usernameDiferentesAlActual);

      this.usernameDiferentesAlActual2 = this.usernameDiferentesAlActual.filter(
        (username) => username != this.usuario.username
      );
      // console.log(this.usernameDiferentesAlActual2);
    });
  }
}
