import { Injectable, Output } from "@angular/core";
import { Usuario } from "../models/usuario";
import { Observable, throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Ubigeo } from "../models/ubigeo";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { AuthService } from "./auth.service";
import { Rol } from "../models/rol";
import { AccesoRol } from "../models/acceso-rol";
@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  private urlEndPoint: string = "http://localhost:8090/api/usuarios";
  //private urlEndPointUbigeo: string = "http://localhost:8090/api/ubigeo";

  private httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  //@Output() error;

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

  /*private isNoAutorizado(e): boolean {
    if (e.status == 401 || e.status == 403) {
      this.error = e;
      this.router.navigate(["/login"]);
      return this.error;
    }
    return false;
  }*/

  getUsuarios(): Observable<Usuario[]> {
    //return of();
    //return this.http.get<Usuario[]>(this.urlEndPoint);

    return this.http
      .get(this.urlEndPoint, { headers: this.agregarAuthorizationHeader() })
      .pipe(map((response) => response as Usuario[]));
  }

  insert(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post(this.urlEndPoint, usuario, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        map((response: any) => response.usuario as Usuario),
        catchError((e) => {
          if (e.status == 400) {
            return throwError(e);
          }

          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, "error");
          return throwError(e);
        })
      );
  }

  getUsuario(usu: Usuario): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.urlEndPoint}/${usu.idusuario}`, {
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

  update(usuario: Usuario): Observable<Usuario> {
    return this.http
      .put<Usuario>(`${this.urlEndPoint}/${usuario.idusuario}`, usuario, {
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

  updateEstado(usuario: Usuario): Observable<Usuario> {
    return this.http
      .put<Usuario>(
        `${this.urlEndPoint}/estado/${usuario.idusuario}`,
        usuario,
        {
          headers: this.agregarAuthorizationHeader(),
        }
      )
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

  updatePassword(usuario: Usuario): Observable<Usuario> {
    return this.http
      .put<Usuario>(`${this.urlEndPoint}/pass/${usuario.idusuario}`, usuario, {
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

  resetPassword(usuario: Usuario): Observable<Usuario> {
    return this.http
      .put<Usuario>(
        `${this.urlEndPoint}/reset-pass/${usuario.idusuario}`,
        usuario,
        {
          headers: this.agregarAuthorizationHeader(),
        }
      )
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

  asignarRol(acceso: AccesoRol): Observable<AccesoRol> {
    return this.http
      .put<AccesoRol>(
        `${this.urlEndPoint}/acceso/${acceso.idusuario}`,
        acceso,
        {
          headers: this.agregarAuthorizationHeader(),
        }
      )
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

  delete(id: number): Observable<any> {
    return this.http
      .delete<Usuario>(`${this.urlEndPoint}/${id}`, {
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

  getRegiones(): Observable<Ubigeo[]> {
    return this.http
      .get<Ubigeo[]>(`${this.urlEndPoint}/ubigeo`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          this.isNoAutorizado(e);
          return throwError(e);
        })
      );
  }

  getRoles(): Observable<Rol[]> {
    return this.http
      .get<Rol[]>(`${this.urlEndPoint}/rol`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          this.isNoAutorizado(e);
          return throwError(e);
        })
      );
  }
  /* insert(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post<Usuario>(this.urlEndPoint, usuario, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        map((resp: any) => resp.usuario as Usuario),
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }*/
  /*getUsuario(usu: Usuario): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.urlEndPoint}/${usu.idusuario}`, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }*/
  getRolUsuarioPorId(id: number): Observable<AccesoRol> {
    return this.http
      .get<AccesoRol>(`${this.urlEndPoint}/acceso/${id}`, {
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
