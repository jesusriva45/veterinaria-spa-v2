import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Cliente } from "../models/cliente";
import { Mascota } from "../models/mascota";
import { Tipomascota } from "../models/tipomascota";
import { AuthService } from "./auth.service";
import swal from "sweetalert2";
import { Usuario } from "../models/usuario";
@Injectable({
  providedIn: "root",
})
export class MascotaService {
  private urlEndPoint: string = "http://localhost:8090/api/mascotas";

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

  getMascotas(): Observable<Mascota[]> {
    //return of();
    //return this.http.get<Usuario[]>(this.urlEndPoint);
    return this.http
      .get(this.urlEndPoint, { headers: this.agregarAuthorizationHeader() })
      .pipe(map((data) => data as Mascota[]));
  }

  //------------------------ LISTAR MASCOTAS DEL CLIENTE LOGUEADO ------------

  getMascotasDelCliente(id_cliente): Observable<Mascota[]> {
    return this.http
      .get<Mascota[]>(
        `${this.urlEndPoint}/mascotas-del-cliente/${id_cliente}`,
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

  //--------------------------------------------------------------------------

  insert(obj: Mascota): Observable<Mascota> {
    return this.http
      .post<Mascota>(this.urlEndPoint, obj, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        map((resp: any) => resp.mascota as Mascota),
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }

  getMascota(id): Observable<Mascota> {
    return this.http
      .get<Mascota>(`${this.urlEndPoint}/${id}`, {
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

  update(obj: Mascota): Observable<Mascota> {
    return this.http
      .put<Mascota>(`${this.urlEndPoint}/${obj.idmascota}`, obj, {
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

  delete(id: number): Observable<Mascota> {
    return this.http
      .delete<Mascota>(`${this.urlEndPoint}/${id}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          //swal.fire(e.error.mensaje, e.error.error, "error");
          return throwError(e);
        })
      );
  }

  getTipoMascota(): Observable<Tipomascota[]> {
    return this.http
      .get<Tipomascota[]>(`${this.urlEndPoint}/tipomascota`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          this.isNoAutorizado(e);
          return throwError(e);
        })
      );
  }

  //-------------- OBTENER CLIENTE REGISTRADO AL SISTEMA POR MEDIO DE ID DE USUARIO ----------
  getCliente(usu: Usuario): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.urlEndPoint}/cliente/${usu.idusuario}`, {
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
