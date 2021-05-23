import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import Swal from "sweetalert2";
import { Pedido } from "../models/pedido";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PedidoService {
  private urlEndPoint: string = "http://localhost:8090/api/pedidos";

  private httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

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
}