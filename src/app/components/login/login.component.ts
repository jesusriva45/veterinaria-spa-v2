import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Usuario } from "src/app/models/usuario";
import { AuthService } from "src/app/services/auth.service";
import swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  titulo: string = "Por favor inicia sesión";
  usuario: Usuario;
  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      swal.fire(
        "Login",
        `Hola ${this.authService.usuario.username} ya estás autenticado!`,
        "info"
      );
      this.router.navigate(["/inicio"]);
    }
  }

  login(): void {
    console.log(this.usuario);
    console.log(this.usuario.username);
    if (this.usuario.username == null || this.usuario.password == null) {
      swal.fire("Error Login", "Username o password vacías!", "error");
      return;
    }

    this.authService.login(this.usuario).subscribe(
      (response) => {
        console.log(response);

        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        let usuario = this.authService.usuario;
        this.router.navigate(["/inicio"]);
        swal.fire(
          "Login",
          `Hola ${usuario.nombres}, has iniciado sesión con éxito!`,
          "success"
        );
      },
      (err) => {
        if (err.status == 400) {
          swal.fire("Error Login", "Usuario o clave incorrectas!", "error");
        }
      }
    );
  }
}
