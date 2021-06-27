import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import Swal from "sweetalert2";
import { Pedido } from "../models/pedido";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Usuario } from "../models/usuario";
import { DetallePedidoProducto } from "../models/detalle-pedido-producto";

import { URL_BACKEND } from "../config/config";

@Injectable({
  providedIn: "root",
})
export class PedidoService {
  private urlEndPoint: string = URL_BACKEND + "/api/pedidos";

  private httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
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

  insert(pedido: Pedido): Observable<Pedido> {
    return this.http
      .post(this.urlEndPoint, pedido, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        map((response: any) => response as any),
        catchError((e) => {
          if (e.status == 400) {
            return throwError(e);
          }

          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, "error");
          return throwError(e);
        })
      );
  }

  getPedido(idpedido: Pedido): Observable<Pedido> {
    return this.http
      .get<Pedido>(`${this.urlEndPoint}/${idpedido}`, {
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

  getPedidosDeUsuario(idUsuario: number): Observable<Pedido[]> {
    return this.http
      .get<Pedido[]>(`${this.urlEndPoint}/usuario/${idUsuario}`, {
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

  //-------------VENDEDOR -----------------------


  updateEstado(pedido: Pedido): Observable<Pedido> {
    return this.http
      .put<Pedido>(`${this.urlEndPoint}/estado/${pedido.idpedido}`, pedido, {
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


  getPedidosDeUsuarioPorDni(dni: string): Observable<Pedido[]> {
    return this.http
      .get<Pedido[]>(`${this.urlEndPoint}/dni/${dni}`, {
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

  getPedidosDeUsuarioPorDniAndEstado(dni: string, estado: string): Observable<Pedido[]> {
    return this.http
      .get<Pedido[]>(`${this.urlEndPoint}/${dni}/${estado}`, {
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
