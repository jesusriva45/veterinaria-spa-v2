import { Component, OnInit } from "@angular/core";
import { Pedido } from "src/app/models/pedido";
import { Usuario } from "src/app/models/usuario";
import { AuthService } from "src/app/services/auth.service";
import { ClienteService } from "src/app/services/cliente.service";
import { PedidoService } from "src/app/services/pedido.service";
import { UsuarioService } from "src/app/services/usuario.service";

@Component({
  selector: "app-pedido",
  templateUrl: "./pedido.component.html",
  styleUrls: ["./pedido.component.scss"],
})
export class PedidoComponent implements OnInit {
  usuario?: Usuario;

  pedidos: Pedido[];

  constructor(
    public pedidoService: PedidoService,
    public clienteService: ClienteService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUsuarioId(this.authService.usuario.idusuario);
  }

  getUsuarioId(id: number) {
    this.clienteService.getUsuario(id).subscribe((usuario) => {
      this.usuario = usuario;
      this.pedidos = usuario.pedidos;
      console.log(usuario.pedidos);
    });
  }
}
