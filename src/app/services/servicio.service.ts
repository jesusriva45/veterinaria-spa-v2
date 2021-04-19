import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SerCategoria } from '../models/ser-categoria';
import { Servicio } from '../models/servicio';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  private urlEndPoint: string = 'http://localhost:8090/servicio/servicios';

  private urlEndPoint2: string = 'http://localhost:8090/api/productosPrecio';

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:8090',
    'Access-Control-Allow-Credentials': 'true',
    GET: 'POST',
  });

  constructor(private http: HttpClient) {}

  getServicios(): Observable<Servicio[]> {
    //return of();
    //return this.http.get<Usuario[]>(this.urlEndPoint);
    return this.http
      .get(this.urlEndPoint)
      .pipe(map((response) => response as Servicio[]));
  }

  getServicio(id): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.urlEndPoint}/${id}`);
  }

  insert(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.urlEndPoint, servicio, {
      headers: this.httpHeaders,
    });
  }

  update(servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(
      `${this.urlEndPoint}/${servicio.idservicio}`,
      servicio,
      { headers: this.httpHeaders }
    );
  }

  delete(id: number): Observable<Servicio> {
    return this.http.delete<Servicio>(`${this.urlEndPoint}/${id}`, {
      headers: this.httpHeaders,
    });
  }

  getCategoria(): Observable<SerCategoria[]> {
    return this.http.get<SerCategoria[]>(`${this.urlEndPoint}/categoria`);
  }
}
