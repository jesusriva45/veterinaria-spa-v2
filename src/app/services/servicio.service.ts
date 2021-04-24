import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { SerCategoria } from "../models/ser-categoria";
import { Servicio } from "../models/servicio";
import { AuthService } from "./auth.service";
import swal from "sweetalert2";
@Injectable({
  providedIn: "root",
})
export class ServicioService {
  private urlEndPoint: string = "http://localhost:8090/servicio/servicios";

  private urlEndPoint2: string = "http://localhost:8090/api/productosPrecio";

  private httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  //------------ PERMISOS DE USUARIO -----------------
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

  //----------------------------------------------------

  getServicios(): Observable<Servicio[]> {
    //return of();
    //return this.http.get<Usuario[]>(this.urlEndPoint);
    return this.http
      .get(this.urlEndPoint, { headers: this.agregarAuthorizationHeader() })
      .pipe(map((response) => response as Servicio[]));
  }

  insert(servicio: Servicio): Observable<Servicio> {
    return this.http
      .post<Servicio>(this.urlEndPoint, servicio, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        map((resp: any) => resp.servicio as Servicio),
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }

  getServicio(id): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.urlEndPoint}/${id}`, {
      headers: this.agregarAuthorizationHeader(),
    });
  }

  update(servicio: Servicio): Observable<Servicio> {
    return this.http
      .put<Servicio>(`${this.urlEndPoint}/${servicio.idservicio}`, servicio, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, "error");
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Servicio> {
    return this.http.delete<Servicio>(`${this.urlEndPoint}/${id}`, {
      headers: this.httpHeaders,
    });
  }

  getCategoria(): Observable<SerCategoria[]> {
    return this.http.get<SerCategoria[]>(`${this.urlEndPoint}/categoria`, {
      headers: this.agregarAuthorizationHeader(),
    });
  }
}
