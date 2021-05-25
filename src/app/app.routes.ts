import { Routes } from "@angular/router";
import { InicioComponent } from "./components/inicio/inicio.component";
import { UsuariosComponent } from "./components/usuarios/usuarios.component";
import { ModalFormComponent } from "./components/usuarios/modal-form/modal-form.component";

import { ProductosComponent } from "./components/productos/productos.component";
import { CrudProductoComponent } from "./components/productos/crud-producto/crud-producto.component";
import { ServiciosComponent } from "./components/servicios/servicios.component";
import { CrudServicioComponent } from "./components/servicios/crud-servicio/crud-servicio.component";
import { MascotasComponent } from "./components/mascotas/mascotas.component";
import { HistoriaClinicaComponent } from "./components/mascotas/historia-clinica/historia-clinica.component";
import { ClientesComponent } from "./components/clientes/clientes.component";
import { RegistroClienteComponent } from "./components/clientes/registro-cliente/registro-cliente.component";
import { RegistroMascotaComponent } from "./components/mascotas/registro-mascota/registro-mascota.component";
import { LoginComponent } from "./components/login/login.component";
import { DatosPersonalesComponent } from "./components/datos-personales/datos-personales.component";
import { DetalleProductoComponent } from "./components/productos/detalle-producto/detalle-producto.component";
import { PedidoComponent } from "./components/pedido/pedido.component";
import { DetallePedidoComponent } from "./components/pedido/detalle-pedido/detalle-pedido.component";
import { AuthGuard } from "./services/guards/auth.guard";
import { CarritoPedidoComponent } from "./components/pedido/carrito-pedido/carrito-pedido.component";
import { DetalleServicioComponent } from "./components/servicios/detalle-servicio/detalle-servicio.component";

export const ROUTES: Routes = [
  { path: "", pathMatch: "full", redirectTo: "inicio" },
  { path: "usuarios", component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: "cliente", component: ClientesComponent, canActivate: [AuthGuard] },
  {
    path: "datos-personales",
    component: DatosPersonalesComponent,
    canActivate: [AuthGuard],
  },
  { path: "inicio", component: InicioComponent },
  { path: "tienda/productos", component: ProductosComponent },
  {
    path: "crud-producto",
    component: CrudProductoComponent,
    canActivate: [AuthGuard],
  },
  //--------- PEDIDO --------------------------
  {
    path: "pedidos",
    component: PedidoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "pedido/detalle-pedido/:id",
    component: DetallePedidoComponent,
  },
  {
    path: "carrito-pedido",
    component: CarritoPedidoComponent,
  },
  //----------------- SERVICIOS --------------------------
  {
    path: "tienda/servicios",
    component: ServiciosComponent,
  },
  {
    path: "servicios/detalle-servicio/:id",
    component: DetalleServicioComponent,
  },
  //----------------------
  {
    path: "crud-servicio",
    component: CrudServicioComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "productos/detalle-producto/:id",
    component: DetalleProductoComponent,
  },
  { path: "mascotas", component: MascotasComponent, canActivate: [AuthGuard] },
  {
    path: "historia-clinica",
    component: HistoriaClinicaComponent,
    canActivate: [AuthGuard],
  },
  { path: "registro-cliente", component: RegistroClienteComponent },
  {
    path: "registro-mascota",
    component: RegistroMascotaComponent,
    canActivate: [AuthGuard],
  },
  //{ path: "pedidos", component: PedidosComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  {
    path: "modal-form-usuario",
    component: ModalFormComponent,
    canActivate: [AuthGuard],
  },

  //{ path: 'usuarios/form',  component: FormComponent },
];
