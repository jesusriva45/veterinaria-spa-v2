import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Usuario } from "../models/usuario";
import { Cliente } from "../models/cliente";

import { URL_BACKEND } from "../config/config";

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnInit {
  public _usuario: Usuario;
  public _token: string;
  public _cliente: Cliente;

  constructor(private http: HttpClient) { }
  /*C:\CIBERTEC\CICLO VI\PROYECTO INTEGRADOR\Proyecto Integrador - Project V.3.0 - 4to avance\api-rest-Mariano\spring-veterinaria-api-rest
  
  java -jar .\target\veterinaria-api-rest-0.0.1-SNAPSHOT.jar
  .\mvnw.cmd clean package*/
  ngOnInit(): void { }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (
      this._usuario == null &&
      sessionStorage.getItem("usuario") != null
    ) {
      this._usuario = JSON.parse(sessionStorage.getItem("usuario")) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem("token") != null) {
      this._token = sessionStorage.getItem("token");
      return this._token;
    }
    return null;
  }

  login(usuario: Usuario): Observable<any> {
    const urlEndpoint = URL_BACKEND + "/oauth/token";

    const credenciales = btoa("angularapp" + ":" + "12345");

    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + credenciales,
    });

    let params = new URLSearchParams();
    params.set("grant_type", "password");
    params.set("username", usuario.username);
    params.set("password", usuario.password);
    console.log(params.toString());
    return this.http.post<any>(urlEndpoint, params.toString(), {
      headers: httpHeaders,
    });
  }

  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    //let payload2 = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.idusuario = payload.idusuario;
    this._usuario.nombres = payload.nombres;
    this._usuario.apellidos = payload.apellidos;
    this._usuario.dni = payload.dni;
    this._usuario.correo = payload.correo;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    //---------------------------------------
    // this._cliente = new Cliente();
    // this._cliente.idcliente = payload2.idCliente;
    //this._usuario = payload.usu;
    sessionStorage.setItem("usuario", JSON.stringify(this._usuario));
    // sessionStorage.setItem("cliente", JSON.stringify(this._cliente));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem("token", accessToken);
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean {
    if (this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
  }
}
