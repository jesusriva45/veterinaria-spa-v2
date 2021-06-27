import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError, Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import Swal from "sweetalert2";
import { Usuario } from "../models/usuario";
import { AuthService } from "./auth.service";

import { URL_BACKEND } from "../config/config";

@Injectable({
  providedIn: "root",
})
export class ClienteService {
  private urlEndPoint: string = URL_BACKEND + "/api/cliente";
  private urlEndPointUser: string = URL_BACKEND + "/api/usuarios";

  private httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
    'Accept': 'application/json',

  });

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService
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

  insert(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post(`${this.urlEndPoint}`, usuario, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        map((response: any) => response.usuario as Usuario),
        catchError((e) => {

          if (e.status == 400) {

            Swal.fire(e.error.mensaje, e.error.error, "error");
            return throwError(e);
          } if (e.status == 500) {
            console.log(e.error.mensaje);
            Swal.fire(e.error.mensaje, e.error.error, "error");
            return throwError(e);
          }

          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, "error");
          return throwError(e);
        })
      );
  }

  getUsuario(idusuario: number): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.urlEndPointUser}/${idusuario}`, {
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

  continueCompra(idusuario: number) {
    return this.http
      .get<Usuario>(`${this.urlEndPointUser}/${idusuario}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizadoCarrito(e)) {
            return throwError(e);
          }
        })
      );
  }

  private isNoAutorizadoCarrito(e): boolean {
    if (e.status == 401) {
      if (this.authService.isAuthenticated()) {
        this.authService.logout();
      }
      Swal.fire(
        "Ups... Parece que aun no eres miembro de Patazas",
        `Para continuar con la compra debes registrarte`,
        "warning"
      );
      //this.router.navigate(["/login"]);
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
}
