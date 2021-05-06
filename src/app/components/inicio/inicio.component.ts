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

  departamentos: String[];
  provincias: String[];
  distritos: Ubigeo[];

  departament: string;

  constructor(public ubigeoService: UbigeoService) {}

  ngOnInit(): void {
    this.getDepartamentos();
  }

  getDepartamentos() {
    this.ubigeoService
      .getDepartamentos()
      .subscribe((depart) => (this.departamentos = depart));
  }

  onChangeDepart(depart) {
    console.log(depart);

    this.departament = depart;
    this.getProvincias(depart);
  }

  getProvincias(depart: string) {
    this.ubigeoService
      .getProvincias(depart)
      .subscribe((prov) => (this.provincias = prov));
  }

  onChangeProv(prov) {
    console.log(prov);

    this.getDistritos(this.departament, prov);
  }

  getDistritos(d: string, p: string) {
    this.ubigeoService
      .getDistritos(d, p)
      .subscribe((dist) => (this.distritos = dist));
  }
}
