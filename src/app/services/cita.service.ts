import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import Swal from "sweetalert2";
import { DiasServicio } from '../models/dias-servicio';
import { URL_BACKEND } from '../config/config';
import { HorarioServicio } from '../models/horario-servicio';
import { Cita } from '../models/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private urlEndPoint: string = URL_BACKEND + "/api/cita";

  private httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient,
    private router: Router,
    public authService: AuthService,
  ) { }



  //----------------------------------
  private agregarAuthorizationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append("Authorization", "Bearer " + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e): boolean {
    if (e.status == 401) {
      if (this.authService.isAuthenticated()) {
        this.authService.logout();
      }
      this.router.navigate(["/login"]);
      return true;
    }

    if (e.status == 403) {
      Swal.fire(
        "Acceso denegado",
        `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`,
        "warning"
      );
      console.log(this.authService.usuario.roles);
      this.router.navigate(["/inicio"]);
      return true;
    }
    return false;
  }

  //--------------------------------------------

  getCitasDeUsuarioPorDniAndEstado(dni: string, estado: string): Observable<Cita[]> {
    return this.http
      .get<Cita[]>(`${this.urlEndPoint}/${dni}/${estado}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }


  getCitasDeUsuarioPorDni(dni: string): Observable<Cita[]> {
    return this.http
      .get<Cita[]>(`${this.urlEndPoint}/user_dni/${dni}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }

  getCitasDeUsuario(id_usuario: number): Observable<Cita[]> {
    return this.http
      .get<Cita[]>(`${this.urlEndPoint}/usuario/${id_usuario}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }




  getDiasPorServicio(id_servicio: number): Observable<DiasServicio[]> {
    return this.http
      .get<DiasServicio[]>(`${this.urlEndPoint}/dias/${id_servicio}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }

  getHorarioPorDias(dia: String): Observable<HorarioServicio[]> {
    return this.http
      .get<HorarioServicio[]>(`${this.urlEndPoint}/horario/${dia}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }


  insertarCita(cita: Cita): Observable<Cita> {

    return this.http.post<Cita>(`${this.urlEndPoint}`, cita, {
      headers: this.agregarAuthorizationHeader()
    }).pipe(map((resp: any) => resp.cita as Cita),
      catchError((e) => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
      })
    )
  }


  getCita(id_cita: number): Observable<Cita> {
    return this.http
      .get<Cita>(`${this.urlEndPoint}/${id_cita}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }

  updateEstado(cita: Cita): Observable<Cita> {
    return this.http
      .put<Cita>(`${this.urlEndPoint}/estado/${cita.idcita}`, cita, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }


}