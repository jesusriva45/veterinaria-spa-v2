import { Routes } from "@angular/router";
import { InicioComponent } from "./components/inicio/inicio.component";
import { UsuariosComponent } from "./components/usuarios/usuarios.component";

import { ProductosComponent } from "./components/productos/productos.component";
import { CrudProductoComponent } from "./components/productos/crud-producto/crud-producto.component";
import { ServiciosComponent } from "./components/servicios/servicios.component";
import { CrudServicioComponent } from "./components/servicios/crud-servicio/crud-servicio.component";
import { CarritoProductosComponent } from "./components/productos/carrito-productos/carrito-productos.component";
import { MascotasComponent } from "./components/mascotas/mascotas.component";
import { HistoriaClinicaComponent } from "./components/mascotas/historia-clinica/historia-clinica.component";
import { ClientesComponent } from "./components/clientes/clientes.component";
import { RegistroClienteComponent } from "./components/clientes/registro-cliente/registro-cliente.component";
import { RegistroMascotaComponent } from "./components/mascotas/registro-mascota/registro-mascota.component";
import { PedidosComponent } from "./components/pedidos/pedidos.component";
import { LoginComponent } from "./components/login/login.component";

export const ROUTES: Routes = [
  { path: "", pathMatch: "full", redirectTo: "inicio" },
  { path: "usuarios", component: UsuariosComponent },
  { path: "inicio", component: InicioComponent },
  { path: "productos", component: ProductosComponent },
  { path: "crud-producto", component: CrudProductoComponent },
  { path: "servicios", component: ServiciosComponent },
  { path: "crud-servicio", component: CrudServicioComponent },
  {
    path: "productos/carrito-producto/:id",
    component: CarritoProductosComponent,
  },
  { path: "mascotas", component: MascotasComponent },
  { path: "historia-clinica", component: HistoriaClinicaComponent },
  { path: "registro-cliente", component: RegistroClienteComponent },
  { path: "registro-mascota", component: RegistroMascotaComponent },
  { path: "pedidos", component: PedidosComponent },
  { path: "login", component: LoginComponent },

  //{ path: 'usuarios/form',  component: FormComponent },
];
