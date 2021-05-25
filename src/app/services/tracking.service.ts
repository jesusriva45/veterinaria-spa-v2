import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import Swal from "sweetalert2";
import { Tracking } from "../models/tracking";
import { AuthService } from "./auth.service";

import { URL_BACKEND } from "../config/config";
import { Estado } from "../models/estado";

@Injectable({
  providedIn: "root",
})
export class TrackingService {
  private urlEndPoint: string = URL_BACKEND + "/api/tracking";

  private httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService
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

  getTrackingPorPedido(idpedido: number): Observable<Tracking> {
    return this.http
      .get<Tracking>(`${this.urlEndPoint}/${idpedido}`, {
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

  updateTracking(tracking: Tracking): Observable<Tracking> {
    return this.http
      .put<Tracking>(`${this.urlEndPoint}/${tracking.idtracking}`, tracking, {
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

  getEstados(): Observable<Estado[]> {
    return this.http
      .get(`${this.urlEndPoint}/estado`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(map((response) => response as Estado[]));
  }

  getTacking(): Observable<Tracking[]> {
    return this.http
      .get(`${this.urlEndPoint}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(map((response) => response as Tracking[]));
  }
}
