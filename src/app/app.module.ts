import { BrowserModule } from "@angular/platform-browser";
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { MDBBootstrapModule } from "angular-bootstrap-md";

import { WavesModule, TableModule } from "angular-bootstrap-md";

import { AngularEditorModule } from "@kolkov/angular-editor";

//import { ScrollingModule } from "@angular/cdk/scrolling";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { ROUTES } from "./app.routes";

import { CommonModule } from "@angular/common";

import { NavbarComponent } from "./components/navbar/navbar.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { InicioComponent } from "./components/inicio/inicio.component";
import { UsuariosComponent } from "./components/usuarios/usuarios.component";
import { ProductosComponent } from "./components/productos/productos.component";
import { CrudProductoComponent } from "./components/productos/crud-producto/crud-producto.component";
import { ServiciosComponent } from "./components/servicios/servicios.component";
import { CrudServicioComponent } from "./components/servicios/crud-servicio/crud-servicio.component";
import { MascotasComponent } from "./components/mascotas/mascotas.component";
import { HistoriaClinicaComponent } from "./components/mascotas/historia-clinica/historia-clinica.component";
import { ClientesComponent } from "./components/clientes/clientes.component";
import { RegistroClienteComponent } from "./components/clientes/registro-cliente/registro-cliente.component";
import { RegistroMascotaComponent } from "./components/mascotas/registro-mascota/registro-mascota.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ModalFormComponent } from "./components/usuarios/modal-form/modal-form.component";
import { LoginComponent } from "./components/login/login.component";

import { DatosPersonalesComponent } from "./components/datos-personales/datos-personales.component";

import { DetalleProductoComponent } from "./components/productos/detalle-producto/detalle-producto.component";

//-------- AUTENTICACION DE USUARIO ------------

import { AuthService } from "./services/auth.service";

import { AuthGuard } from "./services/guards/auth.guard";
import { RoleGuard } from "./services/guards/role.guard";
import { EstadoCarritoComponent } from "./components/productos/estado-carrito/estado-carrito.component";
import { PedidoComponent } from "./components/pedido/pedido.component";
import { DetallePedidoComponent } from "./components/pedido/detalle-pedido/detalle-pedido.component";
import { CarritoPedidoComponent } from "./components/pedido/carrito-pedido/carrito-pedido.component";
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DetalleServicioComponent } from './components/servicios/detalle-servicio/detalle-servicio.component';
import { EstadoTrackingComponent } from './components/pedido/estado-tracking/estado-tracking.component';
import { ConsultasComponent } from './components/mascotas/consultas/consultas.component';
import { CitaComponent } from './components/cita/cita.component';
import { DetalleCitaComponent } from './components/cita/detalle-cita/detalle-cita.component';
import { FiltroCitaComponent } from './components/cita/filtro-cita/filtro-cita.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    InicioComponent,
    UsuariosComponent,
    ProductosComponent,
    CrudProductoComponent,
    ServiciosComponent,
    CrudServicioComponent,
    MascotasComponent,
    HistoriaClinicaComponent,
    ClientesComponent,
    RegistroClienteComponent,
    RegistroMascotaComponent,
    ModalFormComponent,
    LoginComponent,
    DatosPersonalesComponent,
    DetalleProductoComponent,
    EstadoCarritoComponent,
    PedidoComponent,
    DetallePedidoComponent,
    CarritoPedidoComponent,
    SidebarComponent,
    DetalleServicioComponent,
    EstadoTrackingComponent,
    ConsultasComponent,
    CitaComponent,
    DetalleCitaComponent,
    FiltroCitaComponent,
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES, { onSameUrlNavigation: "reload" }),
    BrowserAnimationsModule,
    CommonModule,
    //ScrollingModule,
    AngularEditorModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    TableModule,
    WavesModule,
  ],
  providers: [NgModule, AuthService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule { }
