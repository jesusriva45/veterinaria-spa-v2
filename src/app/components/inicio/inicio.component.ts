import { Component, OnInit } from "@angular/core";
import { Ubigeo } from "src/app/models/ubigeo";
import { UbigeoService } from "src/app/services/ubigeo.service";

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.css"],
})
export class InicioComponent implements OnInit {
  listaServicios: String[] = [
    "Nutrición",
    "Chequeo General",
    "Masajes",
    "Paticure",
  ];

  constructor(public ubigeoService: UbigeoService) {}

  ngOnInit(): void {}
}
