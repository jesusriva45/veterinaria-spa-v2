import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  listaServicios: String[] = ['Nutrición','Chequeo General', 'Masajes','Paticure']

  constructor() { }

  ngOnInit(): void {
  }

}
