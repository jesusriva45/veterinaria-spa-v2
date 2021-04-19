import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit, AfterViewInit   {
  
  btnVerTablaHis = document.getElementsByClassName("btn-historial");

  tableHis = document.getElementById("table-historial");
  
  tableMascotas = document.querySelector("#table-mascotas");
  
  
  inputNomMascota = document.getElementById("nomMascota");
  constructor(private elementRef:ElementRef ) { }

  //id : number = 3;


  ngOnInit(): void {
   //this.mostrarHistorial(this.id);   
  }

  ngAfterViewInit() {

    this.tableHis = this.elementRef.nativeElement.querySelector('#table-historial');
  }




/*for (let i = 0; i < btnVerTablaHis.length; i++) {


    btnVerTablaHis[i].addEventListener("click", function(e) {
Probando

    })

}*/



/*$('#productList').find('tr').find('.btn-edit').each(function(index) {
    $(this).on("click", function() {
        alert(index);
    });
});*/







mostrarHistorial(e:Event){
  this.tableHis.style.display = "block";
  for (let i = 0; i < this.btnVerTablaHis.length; i++) {

    this.btnVerTablaHis[i].addEventListener("click", function(e) {
      
        var rowId = 3 //((e.target as HTMLElement)).id;
        //this gives id of tr whose button was clicked
        console.log(rowId)
        var data = document.getElementById(`${rowId}`).querySelectorAll(".row-data");
    
        var name = data[0].innerHTML;
        console.log(name)
        
        //this.inputNomMascota.setAttribute("value", name);
        console.log(data[1].innerHTML)

    });
  }
}



/*window.onload = function() {

    // creamos los eventos para cada elemento con la clase "boton"
    let elementos = document.getElementsByClassName("boton");
   
}

window.onload = function() {

    // creamos los eventos para cada elemento con la clase "boton"
    for (let i = 0; i < btnVerTablaHis.length; i++) {

        // cada vez que se haga clic sobre cualquier de los elementos,
        // ejecutamos la función obtenerValores()

        btnVerTablaHis[i].addEventListener("click", obtenerValores);
    }
}*/

/*function obtenerValores(e) {
    var valores = "";

    // vamos al elemento padre (<tr>) y buscamos todos los elementos <td>
    // que contenga el elemento padre
    var elementosTD = e.srcElement.parentElement.getElementsByTagName("td");

    // recorremos cada uno de los elementos del array de elementos <td>
    for (let i = 0; i < elementosTD.length; i++) {

        // obtenemos cada uno de los valores y los ponemos en la variable "valores"
        valores += elementosTD[i].innerHTML + "\n";
        inputNomMascota.setAttribute("value", valores);
    }

    alert(valores);
}*/

}
