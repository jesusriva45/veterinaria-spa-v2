import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cita } from 'src/app/models/cita';
import { AuthService } from 'src/app/services/auth.service';
import { CitaService } from 'src/app/services/cita.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-filtro-cita',
  templateUrl: './filtro-cita.component.html',
  styleUrls: ['./filtro-cita.component.scss']
})
export class FiltroCitaComponent implements OnInit {

  citas: Cita[] = [];

  cita: Cita = new Cita;

  constructor(private citaService: CitaService,
    private router: Router,
    public cdRef: ChangeDetectorRef,
    private _authService: AuthService,
    private sserviceUsuario: UsuarioService) { }

  ngOnInit(): void {
  }

}
