import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import swal from "sweetalert2";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Rol } from "../models/rol";
import { Ubigeo } from "../models/ubigeo";
@Injectable({
  providedIn: "root",
})
export class UbigeoService {
  private urlEndPointDepart: string = "http://localhost:8090/api/departamentos";
  private urlEndPointProv: string = "http://localhost:8090/api/provincias";
  private urlEndPointDist: string = "http://localhost:8090/api/distritos";

  private httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

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
      swal.fire(
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

  getDepartamentos(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.urlEndPointDepart}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          this.isNoAutorizado(e);
          return throwError(e);
        })
      );
  }

  getProvincias(depart: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.urlEndPointProv}/${depart}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          this.isNoAutorizado(e);
          return throwError(e);
        })
      );
  }

  getDistritos(depart: string, prov: string): Observable<Ubigeo[]> {
    return this.http
      .get<Ubigeo[]>(`${this.urlEndPointDist}/${depart}/${prov}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          this.isNoAutorizado(e);
          return throwError(e);
        })
      );
  }
}
