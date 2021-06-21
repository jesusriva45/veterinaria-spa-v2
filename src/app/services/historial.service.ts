import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import Swal from "sweetalert2";

import { URL_BACKEND } from '../config/config';
import { Consulta } from "../models/consulta";
import { Historial } from "../models/historial";
import { Mascota } from "../models/mascota";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  private urlEndPointHistorial: string = URL_BACKEND + "/api/historial";
  private urlEndPointHistorialConsultas: string = URL_BACKEND + "/api/consulta";

  private httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient,
    private router: Router,
    public authService: AuthService) { }



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


  insertConsulta(consulta: Consulta): Observable<Consulta> {

    return this.http
      .post<Consulta>(this.urlEndPointHistorialConsultas, consulta, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        map((resp: any) => resp.consulta as Consulta),
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );

  }


  update(consulta: Consulta): Observable<Consulta> {
    return this.http
      .put<Consulta>(`${this.urlEndPointHistorialConsultas}/${consulta.idconsulta}`, consulta, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, "error");
          return throwError(e);
        })
      );
  }





  getHistorial(): Observable<Historial[]> {
    //return of();
    //return this.http.get<Usuario[]>(this.urlEndPoint);
    return this.http
      .get(this.urlEndPointHistorial, { headers: this.agregarAuthorizationHeader() })
      .pipe(map((data) => data as Historial[]));
  }

  getHistorialPorMascota(mascota: Mascota): Observable<Historial> {

    return this.http
      .get<Historial>(
        `${this.urlEndPointHistorial}/mascota/${mascota.idmascota}`,
        {
          headers: this.agregarAuthorizationHeader(),
        }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }

  getConsultasPorMascota(historial: Historial): Observable<Consulta[]> {

    return this.http
      .get<Consulta[]>(
        `${this.urlEndPointHistorialConsultas}/historial/${historial.idhistorial}`,
        {
          headers: this.agregarAuthorizationHeader(),
        }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }

  getConsulta(consulta: Consulta): Observable<Consulta> {

    return this.http
      .get<Consulta>(
        `${this.urlEndPointHistorialConsultas}/${consulta.idconsulta}`,
        {
          headers: this.agregarAuthorizationHeader(),
        }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }

}
