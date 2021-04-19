import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Ubigeo } from '../models/ubigeo';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private urlEndPoint: string = 'http://localhost:8090/api/usuarios';
  private urlEndPointUbigeo: string = 'http://localhost:8090/api/ubigeo';

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:8090',
    'Access-Control-Allow-Credentials': 'true',
    'GET': 'POST',
  });

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    //return of();
    //return this.http.get<Usuario[]>(this.urlEndPoint);

    return this.http
      .get(this.urlEndPoint)
      .pipe(map((response) => response as Usuario[]));
  }

  insert(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.urlEndPoint, usuario, {
      headers: this.httpHeaders,
    });
  }

  getUsuario(id): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlEndPoint}/${id}`);
  }

  delete(id: number): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.urlEndPoint}/${id}`, {
      headers: this.httpHeaders,
    });
  }

  update(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${this.urlEndPoint}/${usuario.idusuario}`,
      usuario,
      { headers: this.httpHeaders }
    );
  }

  getRegiones(): Observable<Ubigeo[]> {
    return this.http.get<Ubigeo[]>(`${this.urlEndPoint}/ubigeo`);
  }
}
