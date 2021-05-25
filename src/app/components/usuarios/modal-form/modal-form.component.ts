import {
  Component,
  Directive,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Usuario } from "src/app/models/usuario";
import { MDBModalRef } from "angular-bootstrap-md";
import { UsuarioService } from "src/app/services/usuario.service";

import swal from "sweetalert2";
import { Ubigeo } from "src/app/models/ubigeo";
import { AuthService } from "src/app/services/auth.service";
import { Rol } from "src/app/models/rol";
import {
  animate,
  AUTO_STYLE,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { UbigeoService } from "src/app/services/ubigeo.service";
import { pairwise } from "rxjs/operators";
import { Acordion } from "../../../animations/animaciones";

@Component({
  selector: "app-modal-form",
  animations: [Acordion("enterAnimation")],
  templateUrl: "./modal-form.component.html",
  styleUrls: ["./modal-form.component.scss"],
})
export class ModalFormComponent implements OnInit {
  usuario?: Usuario;

  usuarios?: Usuario[];

  @Directive({
    selector: "[stark][ngModel],[stark][formControl],[stark][formControlName]",
  })

  //@Input() newUsuario?: Usuario = new Usuario();
  ubigeo?: Ubigeo[];

  roles: Rol[];

  //------------- NUEVO UBIGEO ------------

  departamentos: String[];
  provincias: String[];
  distritos?: Ubigeo[];

  //--------------------------------------

  submitted: boolean = false;
  titulo: string;
  //@ViewChild("content", { static: true }) content: ModalDirective;
  as = document.getElementById("DNI");
  constructor(
    public usuarioService: UsuarioService,
    public router: Router,
    public modalRef: MDBModalRef,
    public ubigeoService: UbigeoService
  ) {}

  //-------- FORMULARIOS -----------------
  myform: FormGroup;
  myformPassword: FormGroup;
  //-----------------------------------------

  dniDiferentesAlActual = [];

  dniDiferentesAlActual2 = [];

  usernameDiferentesAlActual = [];

  usernameDiferentesAlActual2 = [];

  ngOnInit(): void {
    // console.log(this.usuarios);
    //----- -almacenar el ubigeo del usuario actual----
    this.de = this.usuario?.ubigeo?.departamento;
    this.pr = this.usuario?.ubigeo?.provincia;
    //------------------------------------------------------------
    this.getDepartamentos();
    this.createFormPassword();
    this.createForm();
    this.accion();
    this.getDni();
    this.getUserName();
  }

  //---------------- FILTRADO DE DNI -----------------------------

  getDni() {
    this.usuarios.forEach((i) => {
      this.dniDiferentesAlActual.push(i.dni);
    });

    //console.log(this.dniDiferentesAlActual);

    this.dniDiferentesAlActual2 = this.dniDiferentesAlActual.filter(
      (dni) => dni != this.usuario.dni
    );
    //console.log(this.dniDiferentesAlActual2);
  }
  //--------------------------------------------------------------
  //---------------- FILTRADO DE USERNAME -----------------------------
  getUserName() {
    this.usuarios.forEach((i) => {
      this.usernameDiferentesAlActual.push(i.username);
    });

    //console.log(this.usernameDiferentesAlActual);

    this.usernameDiferentesAlActual2 = this.usernameDiferentesAlActual.filter(
      (username) => username != this.usuario.username
    );
    // console.log(this.usernameDiferentesAlActual2);
  }

  //------------------------------------------

  opcion: string;

  accion() {
    if (this.usuario != null) {
      this.titulo = "Actualizar Información";
      this.opcion = "Actualizar Información";
      this.getUsuarioId(this.usuario);
      // this.getUbigeoActual();
      this.getUbigeo();
    } else if (this.usuario == null) {
      this.titulo = "Agregar Usuario";
      this.opcion = "Agregar Usuario";
      this.usuario = new Usuario();
      this.getUbigeo();
      this.getRoles();
    }
  }
  //------------------ FORM CONTROL USERNAME PERSONALIZADO -------------------------------

  /*isLegitimateStarkUsername(username: string): boolean {
    return this.usernameDiferentesAlActual2.some((userActual) => {
      if (userActual == username) {
        swal.fire(
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
  }

  formControlPersonalizadoUsername(
    control: AbstractControl
  ): { [key: string]: any } {
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
        swal.fire(
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
      Nombres: new FormControl("", [Validators.required]),
      Apellidos: new FormControl("", [Validators.required]),
      Dni: new FormControl("", [
        Validators.pattern("[0-9]{8}"),
        this.formControlPersonalizado.bind(this),
      ]),
      Telef: new FormControl("", [Validators.required]),
      Direc: new FormControl("", [Validators.required]),
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
          "^[a-zA-Z]{1,}([.]{1})?[a-zA-Z]{1,}[@]{1}[a-zA-Z]{1,}[.]{1}[a-z]{2,5}([.][a-z]{2,3})?$"
        ),
      ]),
      FechaNac: new FormControl("", [Validators.required]),
      // Password: new FormControl("", [Validators.required]),
    });
  }

  validator(): Validators {
    if (this.usuario.direccion == "jesus@gmail.com")
      // console.log("si sale la validacion con funciones");
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

  //-------------------- VALIDACION FORM UPDATE PASSWORD------------

  createFormPassword() {
    this.myformPassword = new FormGroup({
      Password: new FormControl("", [Validators.required]),
    });
  }

  get Password() {
    return this.myformPassword.get("Password");
  }
  //--------------------- RENDERIZADO DE MODAL PARA CRUD DE USUARIOS --------------------------

  //---------- sin uso ----- NgbModal keyboard ------------

  /*compareFn(o1: Ubigeo, o2: Ubigeo): boolean {
  if (o1 === undefined && o2 === undefined) {
    return true;
  }

  return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id_ubigeo === o2.id_ubigeo;
}*/

  cerrarmodal() {
    this.submitted = false;
    this.modalRef.hide();
    this.myform.reset();
    //console.log("no cierra pero si ejecuta el metodo cerramodal");
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

  //------------------ DEPARTAMENT -----------------
  compareUbigeoDepart(c1: any, c2: any): boolean {
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
      return c1 === c2;
    }
  }

  //---------------- PROVINCIA -----------------------

  compareUbigeoProv(c1: any, c2: any): boolean {
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
      return c1 === c2;
    }
  }

  /*compareFn(o1: Ubigeo, o2: Ubigeo): boolean {
if (o1 === undefined && o2 === undefined) {
  return true;
}

return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id_ubigeo === o2.id_ubigeo;
}*/

  //submittedDni: boolean = false;
  verificarDatos() {
    console.log("que pasas");

    if (this.myform.invalid) {
      swal.fire({
        icon: "error",
        title: "Cuidado...! Aun te faltan datos por completar. ",
        // text: 'Oops...'
      });
      this.submitted = true;
      // console.log(this.submitted);
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
          if (this.usuario.idusuario == null) {
            if (result.isConfirmed) {
              swal.fire(
                "Registro Exitoso...!",
                `${this.usuario.nombres} bienvenido a nuestra veterinaria`,
                "success"
              );
              // console.log("sigue mal el insert");
              this.insert();
              this.modalRef.hide();
            }
          } else if (
            this.usuario.idusuario != null &&
            this.usuario.idusuario > 0
          ) {
            if (result.isConfirmed) {
              swal.fire(
                "Update Exitoso...!",
                `${this.usuario.nombres} tus datos se actualizaron correctamente`,
                "success"
              );
              this.update();
              this.modalRef.hide();
            }
          }
        });
    }
  }

  //---------------------------- ACTUALIZAR CONTRASEÑA ------------------------------

  submittedPass: boolean = false;

  formUpdatePass() {
    console.log("que pasas");

    if (this.myformPassword.invalid) {
      swal.fire({
        icon: "error",
        title: "Cuidado...! Aun te faltan datos por completar. ",
        // text: 'Oops...'
      });
      this.submittedPass = true;
      //console.log(this.submittedPass);
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
          confirmButtonText: "Si, actualizar contraseña",
        })
        .then((result) => {
          /*if (this.usuario.idusuario == null) {
            if (result.isConfirmed) {
              swal.fire(
                "Registro Exitoso...!",
                `${this.usuario.nombres} bienvenido a nuestra veterinaria`,
                "success"
              );
              console.log("sigue mal el insert");
              this.insert();
              this.modalRef.hide();
            }
          } else*/ if (
            this.usuario.idusuario != null &&
            this.usuario.idusuario > 0
          ) {
            if (result.isConfirmed) {
              swal.fire(
                "Update Exitoso...!",
                `${this.usuario.nombres} tu contraseña se actualizó correctamente`,
                "success"
              );
              this.resetPassword();
              this.modalRef.hide();
            }
          }
        });
    }
  }

  //-----------------------

  //------------------ CRUD DE USUARIOS ---------------------------
  errores: string[];
  /*insert(): void {
    this.usuarioService.insert(this.usuario).subscribe((response) => {
      let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
      // this.router.navigate([window.location.reload()]);
    });
  }*/

  insert(): void {
    this.usuarioService.insert(this.usuario).subscribe(
      (usuario) => {
        let currentUrl = this.router.url;
        this.router
          .navigateByUrl("/", { skipLocationChange: true })
          .then(() => {
            this.router.navigate([currentUrl]);
          });
      },
      (err) => {
        this.errores = err.error.errors as string[];
        //console.error("Código del error desde el backend: " + err.status);
        //console.error(err.error.errors);
      }
    );
  }

  getUsuarioId(usu: Usuario) {
    this.usuarioService
      .getUsuario(usu)
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

  resetPassword(): void {
    this.usuarioService.resetPassword(this.usuario).subscribe((response) => {
      let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
      // this.router.navigate([window.location.reload()]);
    });
  }

  getUbigeo() {
    this.usuarioService
      .getRegiones()
      .subscribe((ubigeo) => (this.ubigeo = ubigeo));
  }

  getRoles() {
    this.usuarioService.getRoles().subscribe((roles) => (this.roles = roles));
  }

  //------- VISIBILIDAD DEL ACORDION -----------
  registro: boolean = true;

  password: boolean = true;

  //--------------------------------------------

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

  /*getUbigeoActual() {
    this.getDepartamentos();
    //operador de elvis ?
    //this.pr = this.usuario?.ubigeo?.provincia;
    //this.de = this.usuario?.ubigeo?.departamento;
    this.getDistritos(
      this.usuario?.ubigeo?.departamento,
      this.usuario?.ubigeo?.provincia
    );
  }*/

  //-------------------------------------------
}
