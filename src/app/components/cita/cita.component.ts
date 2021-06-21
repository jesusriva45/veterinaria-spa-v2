import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cita } from 'src/app/models/cita';
import { DiasServicio } from 'src/app/models/dias-servicio';
import { HorarioServicio } from 'src/app/models/horario-servicio';
import { SerCategoria } from 'src/app/models/ser-categoria';
import { Servicio } from 'src/app/models/servicio';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { CitaService } from 'src/app/services/cita.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from "sweetalert2";



@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent implements OnInit {

  usuario?: Usuario;

  servicio: Servicio;

  dias: DiasServicio;

  horario: HorarioServicio;




  cita = new Cita();

  diasServ: DiasServicio[] = [];

  horarios: HorarioServicio[] = [];

  servicios: Servicio[] = [];

  categorias: SerCategoria[] = [];

  //------- parametros para evento change select ------
  id_cate: number;
  id_servicio: number;
  id_dias: number;
  id_horario: number;



  //---------------------

  constructor(private citaService: CitaService,
    private servicioService: ServicioService,
    private router: Router,
    private _authService: AuthService,
    private sserviceUsuario: UsuarioService) { }
  //getServiciosPorCategoria

  currentYear: Date;


  ngOnInit(): void {

    console.log(this._authService.usuario);
    this.usuario = this._authService.usuario;

    this.getCategorias();
    this.getUsuario();
    this.createForm();

    //this.servicio = undefined;
    //this.dias = undefined;
    //this.horario = undefined;
    this.currentYear = new Date();



    /*.addEventListener('DOMContentLoaded', function (e) {

      


    })*/


  }
  /*transformDate(date) {
    this.datePipe.transform(myDate, 'yyyy-MM-dd'); //whatever format you need. 
  }*/




  //------------------- VALIDACION DE FORMULARIO --------------------------------

  myform: FormGroup;

  createForm() {
    this.myform = new FormGroup({

      Categoria: new FormControl(undefined, [
        Validators.nullValidator,
        Validators.required,

      ]),
      Servicio: new FormControl(undefined, [
        Validators.nullValidator,
        Validators.required,

      ]),

      /* DiasAten: new FormControl(undefined, [
         Validators.nullValidator,
         Validators.required,
 
       ]),
 */
      Horario: new FormControl(undefined, [
        Validators.nullValidator,
        Validators.required,
      ]),
    });
  }
  get Categoria() {
    return this.myform.get("Categoria");
  }


  get Servicio() {
    return this.myform.get("Servicio");
  }

  /*get DiasAten() {
    return this.myform.get("DiasAten");
  }*/

  get Horario() {
    return this.myform.get("Horario");
  }



  submitted: boolean = false;

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
      Swal.fire({
        title: "Verifica los datos de tu cita...",
        text: "",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, registrarse",
      }).then((result) => {
        if (this.cita != null) {
          if (result.isConfirmed) {
            this.insertarCita();

            Swal.fire({
              title: 'Por favor espere mientras registramos su cita',
              html: '<br><br><div class="spinner-border" role="status" style="width: 4rem; height: 4rem;"><br><span class="sr-only">Loading...</span><br></div><br><br>',
              timerProgressBar: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
              showConfirmButton: false,
            })
          }
        }
      })
    }
  }




  insertarCita() {
    this.citaService.insertarCita(this.cita).subscribe((response) => {
      this.myform.reset();
      Swal.fire(
        "Registro Exitoso...!",
        ``,
        "success"
      );
    });
  }




  onChangeCategoria(e: any) {

    this.myform.controls["Servicio"].setValue(undefined);
    //this.myform.controls["DiasAten"].setValue(undefined);
    this.myform.controls["Horario"].setValue(undefined);

    if (e == null || e == undefined) {


    } else {
      this.getServiciosPorCategoria(e);
    }


  }

  disabled: boolean = true;



  onChangeServicio(e) {
    this.dias_de_atencion = [];
    this.horarios = [];


    (document.getElementById('fecha') as HTMLInputElement).value = "";


    this.myform.controls["Horario"].setValue(undefined);
    if (e == null || e == undefined) {
      // this.getDiasPorServicio(undefined);      
      //this.myform.controls["DiasAten"].setValue(undefined);     
      this.disabled = true;
    } else {
      //document.getElementById('fecha').setAttribute('disabled', 'false');

      this.cita.servicio = e;
      this.disabled = false;
      this.getDiasPorServicio(e?.idservicio)

      //console.log(this.dias.dias)
    }

  }


  obtenerDia(e, dia) {

    this.dia_string = dia;

    let dia_valido = (this.dias_de_atencion.includes(dia));

    if (dia_valido == false) {
      e.target.value = "";
      this.horarios = [];
      Swal.fire(
        "Dia No disponible!",
        `El servicio no está disponible los dias  ${this.dia_string}`,
        "warning"
      );
    } else {

      let fecha_atencion = new Date(`${e.target.value}`).toISOString();
      /*let dia = (fechaActual.getDate() + 2);
      let mes = (fechaActual.getMonth() + 1);
      let year = fechaActual.getFullYear();

      let month = (mes < 10 ? "0" : "") + mes;
      let day = (dia < 10 ? "0" : "") + dia;

      let fecha_atencion = year + "-" + month + "-" + day;

      console.log(fecha_atencion)*/


      console.log(e.target.value)

      this.cita.dia_atencion = e.target.value;


      this.getHorarioPorDias(this.dia_string);
    }
  }

  dia_string: string;

  clickDay(e) {
    //document.getElementById('fecha').
    console.log(e.target.value);
    let day1 = new Date(`${e.target.value}`).toISOString();
    console.log(day1)
    let day = new Date(`${e.target.value}`).getDay();
    console.log(day)
    if (day == 0) {
      this.obtenerDia(e, "LUNES");

    } if (day == 1) {
      this.obtenerDia(e, "MARTES");
    }
    if (day == 2) {
      this.obtenerDia(e, "MIERCOLES");
    }
    if (day == 3) {
      this.obtenerDia(e, "JUEVES");
    }
    if (day == 4) {
      this.obtenerDia(e, "VIERNES");
    }
    if (day == 5) {
      this.obtenerDia(e, "SABADO");
    } if (day == 6) {
      this.obtenerDia(e, "DOMINGO");
    }

    /*if (e.target.value == "2021-06-19") {
      document.getElementById('fecha').setAttribute('disabled', 'true');
      //e.target.value.disable =
    }*/


  }
  //onChangeDias(e) { }

  /*onChangeDias(e) {

    if (e == null || e == undefined) {
      //this.getHorarioPorDias(e);
      this.myform.controls["Horario"].setValue(undefined);
    } else {

      this.getHorarioPorDias(e?.dias);
    }
  }*/


  onChangeHorario(e) {

    if (e == null || e == undefined) {

    } else {
      this.cita.hora_inicio = e?.hora_inicio;
      this.cita.hora_fin = e?.hora_fin;
    }

  }

  getCategorias() {
    this.servicioService
      .getCategoria()
      .subscribe((data) => {
        this.categorias = data;
        // console.log(data)
      });
  }

  getServiciosPorCategoria(id_cate) {
    this.servicioService
      .getServiciosPorCategoria(id_cate)
      .subscribe((data) => {
        this.servicios = data;
        //  console.log(data)
      });
  }

  getHorarioPorDias(dia: string) {
    this.citaService
      .getHorarioPorDias(dia)
      .subscribe((data) => {
        this.horarios = data;
        // console.log(data)
      });
  }

  dias_de_atencion: any[] = [];

  getDiasPorServicio(id_servicio: number) {
    this.citaService
      .getDiasPorServicio(id_servicio)
      .subscribe((data) => {
        this.diasServ = data;
        data.forEach((e) => {

          this.dias_de_atencion.push(e.dias);

          //console.log(this.dias_de_atencion);


        })
      });
  }

  getUsuario() {
    this.sserviceUsuario.getUsuario(this._authService.usuario).subscribe((data) => {
      //console.log(data)    

      this.cita.usuario = data

    })
  }

  funcionX() {

  }

  //--------- CALENDA -------

}
