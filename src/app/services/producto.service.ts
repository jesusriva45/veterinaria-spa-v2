import { Injectable } from "@angular/core";

import { Producto } from "../models/producto";
import swal from "sweetalert2";
import { Observable, throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Proveedor } from "../models/proveedor";
import { ProCategoria } from "../models/pro-categoria";
import { Marca } from "../models/marca";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ProductoService {
  private urlEndPoint: string = "http://localhost:8090/api/productos";

  private urlEndPoint2: string = "http://localhost:8090/api/productosPrecio";

  private httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  //------------AUTENTICACION DE ROL DE USUARIO -----------------

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

  //-----------------------------------------

  getProductos(): Observable<Producto[]> {
    //return of();
    //return this.http.get<Usuario[]>(this.urlEndPoint);
    return this.http
      .get(this.urlEndPoint)
      .pipe(map((response) => response as Producto[]));
  }

  insert(producto: Producto): Observable<Producto> {
    return this.http
      .post<Producto>(this.urlEndPoint, producto, {
        headers: this.agregarAuthorizationHeader(),
      })
      .pipe(
        map((resp: any) => resp.producto as Producto),
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
        })
      );
  }

  update(producto: Producto): Observable<Producto> {
    return this.http
      .put<Producto>(`${this.urlEndPoint}/${producto.idproducto}`, producto, {
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

  delete(id: number): Observable<Producto> {
    return this.http
      .delete<Producto>(`${this.urlEndPoint}/${id}`, {
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

  getProductoProPrecio(precioMin, precioMax): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      `${this.urlEndPoint2}/${precioMin}/${precioMax}`
    );
  }
  getProducto(id): Observable<Producto> {
    return this.http.get<Producto>(`${this.urlEndPoint}/${id}`, {
      headers: this.agregarAuthorizationHeader(),
    });
  }

  getMarca(): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.urlEndPoint}/marca`, {
      headers: this.agregarAuthorizationHeader(),
    });
  }

  getProveedor(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.urlEndPoint}/proveedor`, {
      headers: this.agregarAuthorizationHeader(),
    });
  }

  getCategoria(): Observable<ProCategoria[]> {
    return this.http.get<ProCategoria[]>(`${this.urlEndPoint}/categoria`, {
      headers: this.agregarAuthorizationHeader(),
    });
  }
}
