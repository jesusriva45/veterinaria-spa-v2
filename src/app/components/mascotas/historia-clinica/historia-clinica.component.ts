import { ViewChild } from '@angular/core';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Consulta } from 'src/app/models/consulta';
import { Historial } from 'src/app/models/historial';
import { Mascota } from 'src/app/models/mascota';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { HistorialService } from 'src/app/services/historial.service';
import { MascotaService } from 'src/app/services/mascota.service';
import Swal from "sweetalert2";

import {
  MDBModalRef,
  MDBModalService,
  MdbTableDirective,
  MdbTablePaginationComponent,
  ModalDirective,
} from "angular-bootstrap-md";
import { HostListener } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CitaService } from 'src/app/services/cita.service';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.scss']
})
export class HistoriaClinicaComponent implements OnInit, AfterViewInit {

  btnVerTablaHis = document.getElementsByClassName("btn-historial");

  tableHis = document.getElementById("table-historial");

  tableMascotas = document.querySelector("#table-mascotas");

  myImgUrl: string;
  inputNomMascota = document.getElementById("nomMascota");
  constructor(private elementRef: ElementRef,
    private historialService: HistorialService,
    private mascotaService: MascotaService,
    public authService: AuthService,
    public cdRef: ChangeDetectorRef) {
    this.myImgUrl = "../../../../assets/img/no-image.png";
  }

  //id : number = 3;
  mascota: Mascota;

  historialPorMascota: Historial = new Historial();

  consultaMascota: Consulta = new Consulta();

  mascotas: Mascota[] = [];

  consultas: Consulta[] = [];

  //---------------------- FORM --------------
  clienteLog: Usuario;


  //-----------------------------------------

  ngOnInit(): void {
    this.getClienteIdUsuario(this.authService.usuario)

    //this.mostrarHistorial(this.id);
    this.tableHis = this.elementRef.nativeElement.querySelector('#table-historial');
    this.createFormControls();
    this.createForm();
    console.log(this.authService.usuario.dni)
    if (this.authService.hasRole('ROLE_CLIENTE')) {
      this.mascotaService
        .getMascotasPorDni(this.authService.usuario.dni)
        .subscribe((data) => {
          this.mascotas = data;
          this.data(data)
          data.map((e) => {
            this.userNombres = e.usuario.nombres + " " + e.usuario.apellidos;
            console.log(data);
          })
        })
    }

  }



  userDni: string;
  userNombres: string;

  filtrarMascotasDeUsuarioPorDni() {
    this.mascotaService
      .getMascotasPorDni(this.userDni)
      .subscribe((data) => {
        this.mascotas = data;
        this.data(data)
        data.map((e) => {
          this.userNombres = e.usuario.nombres + " " + e.usuario.apellidos;

        })
      })

  }




  mostrarHistorial(mascota: Mascota) {

    // const masc = new Mascota();

    //masc.idmascota = 1

    this.historialService
      .getHistorialPorMascota(mascota)
      .subscribe((data) => {
        this.historialPorMascota = data;
        document.getElementById("nomMascota").setAttribute('value', this.historialPorMascota.mascota.nombre);
        this.getConsultasPorHistorial(data);
        console.log("Id Usuario " + data.mascota.usuario.idusuario)
      });



    this.tableHis.style.display = "block";
    for (let i = 0; i < this.btnVerTablaHis.length; i++) {

      this.btnVerTablaHis[i].addEventListener("click", function (e) {

        var rowId = 3 //((e.target as HTMLElement)).id;
        //this gives id of tr whose button was clicked
        console.log(rowId)
        var data = document.getElementById(`${rowId}`).querySelectorAll(".row-data");




        //this.inputNomMascota.setAttribute("value", name);
        console.log(data[1].innerHTML)

      });
    }
  }







  //------------------------ EDITOR DE TEXTO - DESCRIPCION ----------------------

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: "60vh",
    width: "100%",

    fonts: [
      { class: "arial", name: "Arial" },
      { class: "times-new-roman", name: "Times New Roman" },
      { class: "calibri", name: "Calibri" },
      { class: "comic-sans-ms", name: "Comic Sans MS" },
      { class: "Algerian", name: "Algerian" },
      { class: "MT Extra", name: "MT Extra" },
      { class: "Cooper Black", name: "Cooper Black" },
    ],

    toolbarHiddenButtons: [
      [
        //'undo',
        //'redo',
        //'bold',
        //'italic',
        //'underline',
        //'strikeThrough',
        "subscript",
        "superscript",
        //"justifyLeft",
        //"justifyCenter",
        //"justifyRight",
        //"justifyFull",
        //'indent',
        //'outdent',
        //'insertUnorderedList',
        //'insertOrderedList',
        //'heading',
        //'fontName',
      ],
      [
        //'fontSize',
        //'textColor',
        "backgroundColor",
        //"customClasses",
        //'link',
        //'unlink',
        "insertImage",
        "insertVideo",
        "insertHorizontalRule",
        //'removeFormat',
        "toggleEditorMode",
      ],
    ],
  };

  //------------------------------ FORMULARIO CONSULTA --------------------------


  myform: FormGroup;
  IdConsulta: FormControl;
  //Nombre: FormControl;
  Descripcion: FormControl;
  Estado: FormControl;

  createFormControls() {
    this.IdConsulta = new FormControl("", Validators.nullValidator);
    //this.Nombre = new FormControl("", Validators.required);
    this.Descripcion = new FormControl("", [Validators.required, Validators.nullValidator]);
    this.Estado = new FormControl(null, [Validators.required]);
    //this.foto1 = new FormControl("", Validators.nullValidator);
    //this.foto2 = new FormControl("", Validators.nullValidator);
    //this.foto3 = new FormControl("", Validators.nullValidator);
  }

  createForm() {
    this.myform = new FormGroup({
      name: new FormGroup({
        IdConsulta: this.IdConsulta,
        //Nombre: this.Nombre,
        Descripcion: this.Descripcion,
        Estado: this.Estado,
        // foto1: this.foto1,
        //foto2: this.foto2,
        //foto3: this.foto3,
      }),
    });
  }


  //---------------------- MODAL CONSULTA ----------------------------


  submitted: boolean = false;

  cerrarmodal() {
    this.submitted = false;
    this.basicModal.hide();
    //this.myform.reset();

    //this.usuarioService.getRegiones().subscribe((ubigeo) => (this.ubigeo = []));
  }
  @ViewChild("basicModal", { static: true }) basicModal: ModalDirective;


  status = [
    "EN TRATAMIENTO",
    "DE ALTA",
    "FINALIZADO",
  ];

  openModalConsulta(accion: string, consulta?: Consulta) {

    this.basicModal.show();

    if (accion == "actualizar") {
      this.getConsulta(consulta)

    } else {

      let servicio = sessionStorage.getItem('servicio');
      this.IdConsulta.setValue(0);
      this.consultaMascota.idconsulta == 0;
      this.consultaMascota.servicio = JSON.parse(servicio);
      this.consultaMascota.usuario = this.clienteLog;
      this.consultaMascota.historialMascota = this.historialPorMascota;
    }

    /* this.historialService
     .getConsultasPorMascota(consulta)
     .subscribe((data) => {
       this.historialPorMascota = data;
       document.getElementById("nomMascota").setAttribute('value', this.historialPorMascota.mascota.nombre);
       console.log(data)
     });
 */
  }


  verificarDatos() {

    if (this.myform.invalid) {
      Swal.fire({
        icon: "error",
        title: "Cuidado...! Aun te faltan datos por completar. ",
        // text: 'Oops...'
      });
      this.submitted = true;
      console.log(this.submitted);
      //this.myform.invalid;
    } if (this.myform.valid) {
      //this.click = false;
      Swal
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
          if (this.consultaMascota.idconsulta === 0) {
            if (result.isConfirmed) {
              Swal.fire(
                "Registro Exitoso...!",
                `Consulta creada correctamente`,
                "success"
              );

              this.insertConsulta();
              this.basicModal.hide();
            }
          } else if (
            this.consultaMascota.idconsulta != 0 &&
            this.consultaMascota.idconsulta > 0
          ) {
            if (result.isConfirmed) {
              Swal.fire(
                "Update Exitoso...!",
                `Los datos se actualizaron correctamente`,
                "success"
              );
              //this.update();
              this.basicModal.hide();
            }
          }
        });
    }

  }

  //----------------------------------------------------

  //------- CLIENTE LOGUEADO AL SISTEMA

  getClienteIdUsuario(usu: Usuario) {
    this.mascotaService.getCliente(usu).subscribe((cliente) => {
      this.clienteLog = cliente;
      console.log(cliente);
    });
  }


  getConsultasPorHistorial(historial: Historial) {
    this.historialService
      .getConsultasPorMascota(historial)
      .subscribe((data) => {
        this.consultas = data;

        // document.getElementById("nomMascota").setAttribute('value', this.historialPorMascota.mascota.nombre);

      });
  }

  getConsulta(consulta: Consulta) {
    this.historialService
      .getConsulta(consulta)
      .subscribe((data) => {



        //this.consultas = data;
        // document.getElementById("nomMascota").setAttribute('value', this.historialPorMascota.mascota.nombre);
      });
  }

  insertConsulta() {
    this.historialService.insertConsulta(this.consultaMascota).subscribe((resp) => {

    })
  }


  //---------------------- DATA TABLE ---------------------------------
  @ViewChild(MdbTablePaginationComponent, { static: true })
  mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  // elements: any = [];
  previous: any = [];
  //headElements = ["ID", "First", "Last", "Handle"];
  searchText: string = "";

  @HostListener("input") oninput() {
    this.searchItems();
  }
  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.mascotas = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.mascotas = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(4);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  data(mascotas: Array<any>) {
    /*for (let user of usuarios) {
      this.elements.push({
        idusuario: user.idusuario,
        nombres: user.nombres,
        apellidos: user.apellidos,
        dni: user.dni,
        telefono: user.telefono,
        correo: user.correo,
        fechaNac: user.fechaNac,
        direccion: user.direccion,
        departamento: user.ubigeo.departamento,
        provincia: user.ubigeo.provincia,
        distrito: user.ubigeo.distrito,
      });
    }*/

    this.mdbTable.setDataSource(mascotas);
    mascotas = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }

  /*window.onload = function() {
  
      // creamos los eventos para cada elemento con la clase "boton"
      let elementos = document.getElementsByClassName("boton");
     
  }
  
  window.onload = function() {
  
      // creamos los eventos para cada elemento con la clase "boton"
      for (let i = 0; i < btnVerTablaHis.length; i++) {
  
          // cada vez que se haga clic sobre cualquier de los elementos,
          // ejecutamos la función obtenerValores()
  
          btnVerTablaHis[i].addEventListener("click", obtenerValores);
      }
  }*/

  /*function obtenerValores(e) {
      var valores = "";
  
      // vamos al elemento padre (<tr>) y buscamos todos los elementos <td>
      // que contenga el elemento padre
      var elementosTD = e.srcElement.parentElement.getElementsByTagName("td");
  
      // recorremos cada uno de los elementos del array de elementos <td>
      for (let i = 0; i < elementosTD.length; i++) {
  
          // obtenemos cada uno de los valores y los ponemos en la variable "valores"
          valores += elementosTD[i].innerHTML + "\n";
          inputNomMascota.setAttribute("value", valores);
      }
  
      alert(valores);
  }*/

}
