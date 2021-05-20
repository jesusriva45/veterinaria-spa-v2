import { Component, OnInit, ViewChild } from "@angular/core";

import { Router } from "@angular/router";
import { ProductoService } from "../../../services/producto.service";

import { Producto } from "../../../models/producto";

//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDirective } from "projects/angular-bootstrap-md/src/public_api";

import swal from "sweetalert2";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ProCategoria } from "src/app/models/pro-categoria";
import { Proveedor } from "src/app/models/proveedor";
import { Marca } from "src/app/models/marca";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-crud-producto",
  templateUrl: "./crud-producto.component.html",
  styleUrls: ["./crud-producto.component.scss"],
})
export class CrudProductoComponent implements OnInit {
  productos: Producto[] = [];

  categoria: ProCategoria[];

  proveedor: Proveedor[];

  marca: Marca[];

  producto: Producto = new Producto();

  titulo: string = "Agregar Usuario";

  //---- parametro para detalle - actualizar
  Id_Producto: number;

  button = document.getElementsByClassName("crud");
  input = document.getElementsByClassName("form-input");

  //------------------------ CAMPOS DE FORMULARIO ---------------------------
  myform: FormGroup;
  IdProducto: FormControl;
  Nombre: FormControl;
  Descripcion: FormControl;
  foto1: FormControl;
  foto2: FormControl;
  foto3: FormControl;
  Indicaciones: FormControl;
  Marca: FormControl;
  Precio: FormControl;
  Serie: FormControl;
  Stock: FormControl;
  IdCategoria: FormControl;
  IdProveedor: FormControl;

  //----------- VISIBILIDAD DE MENSAJE DE ERROR DE CAMPOS DE FORMULARIO ----------------
  submitted: boolean = false;

  // button = document.getElementsByClassName("crud")

  //------------------- UPLOAD FOTO - CIFRADO A BASE64---------------------------------------
  localUrl: any[];

  showPreviewImage1(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;

        this.producto.foto1 = this.localUrl.toString();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  showPreviewImage2(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;

        this.producto.foto2 = this.localUrl.toString();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  showPreviewImage3(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;

        this.producto.foto3 = this.localUrl.toString();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  //---------------------------------------------------------
  myImgUrl: string;

  //---------------------------------------------------------
  constructor(
    private productoService: ProductoService,
    private router: Router,
    public _authService: AuthService //private modalService: NgbModal
  ) {
    this.myImgUrl = "../../../../assets/img/no-image.png";
  }

  ngOnInit(): void {
    this.listarProductos();
    this.getMarca();
    this.createFormControls();
    this.createForm();
  }

  //--------------------------- MODAL DETALLE -----------

  @ViewChild("modalDetail", { static: true }) modalDetail: ModalDirective;
  ProDescrip: string;

  ProMarca: string;
  ProCategoria: string;
  modalDetalle(producto: Producto) {
    console.log(producto.nombre);
    this.modalDetail.show();
    this.getProducto(producto.idproducto);
    this.ProDescrip = `${producto.descripcion}`;

    this.ProMarca = `${producto.marca.nombre}`;
    this.ProCategoria = `${producto.categoria.descripcion}`;
  }

  cerrarmodalDetalle() {
    this.submitted = false;
    //this.modalService.dismissAll();

    this.modalDetail.hide();
    this.myform.reset();
    //this.usuarioService.getRegiones().subscribe((ubigeo) => (this.ubigeo = []));
  }

  //--------------------------

  //------------------------ EDITOR DE TEXTO - DESCRIPCION ----------------------

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: "200px",
    width: "100%",

    fonts: [
      { class: "arial", name: "Arial" },
      { class: "times-new-roman", name: "Times New Roman" },
      { class: "calibri", name: "Calibri" },
      { class: "comic-sans-ms", name: "Comic Sans MS" },
      { class: "Algerian", name: "Algerian" },
      { class: "MT Extra", name: "MT Extra" },
      { class: "Cooper Black", name: "Cooper Black" },
    ],

    toolbarHiddenButtons: [
      [
        //'undo',
        //'redo',
        //'bold',
        //'italic',
        //'underline',
        //'strikeThrough',
        "subscript",
        "superscript",
        //"justifyLeft",
        //"justifyCenter",
        //"justifyRight",
        //"justifyFull",
        //'indent',
        //'outdent',
        //'insertUnorderedList',
        //'insertOrderedList',
        //'heading',
        //'fontName',
      ],
      [
        //'fontSize',
        //'textColor',
        "backgroundColor",
        //"customClasses",
        //'link',
        //'unlink',
        "insertImage",
        "insertVideo",
        "insertHorizontalRule",
        //'removeFormat',
        "toggleEditorMode",
      ],
    ],
  };

  //------------------------ VALIDACION DE FORMULARIO ---------------------------

  //------------------------ VALIDACION DE FORMULARIO ---------------------------

  createFormControls() {
    this.IdProducto = new FormControl("", Validators.nullValidator);
    this.Nombre = new FormControl("", Validators.required);
    this.Descripcion = new FormControl("", Validators.required);
    this.Indicaciones = new FormControl("", Validators.required);
    this.Marca = new FormControl("", Validators.required);
    this.Precio = new FormControl("", [
      Validators.required,
      Validators.pattern("[0-9]+([.][0-9]{1,2})?"),
    ]);
    this.Serie = new FormControl("", Validators.required);
    this.Stock = new FormControl("", [
      Validators.required,
      Validators.pattern("[0-9]{1,}"),
    ]);
    this.IdCategoria = new FormControl("", Validators.required);
    this.IdProveedor = new FormControl("", Validators.required);
    //this.foto1 = new FormControl("", Validators.nullValidator);
    //this.foto2 = new FormControl("", Validators.nullValidator);
    //this.foto3 = new FormControl("", Validators.nullValidator);
  }

  createForm() {
    this.myform = new FormGroup({
      name: new FormGroup({
        IdProducto: this.IdProducto,
        Nombre: this.Nombre,
        Descripcion: this.Descripcion,
        Indicaciones: this.Indicaciones,
        Marca: this.Marca,
        Precio: this.Precio,
        Serie: this.Serie,
        Stock: this.Stock,
        IdCategoria: this.IdCategoria,
        IdProveedor: this.IdProveedor,
        // foto1: this.foto1,
        //foto2: this.foto2,
        //foto3: this.foto3,
      }),
    });
  }

  //------------------ RENDERIZADO DE MODAL PARA CRUD DE PRODUCTOS---------------------------------

  @ViewChild("contentModal", { static: true }) contentModal: ModalDirective;

  cerrarmodal() {
    this.submitted = false;
    //this.modalService.dismissAll();
    this.contentModal.hide();
    this.myform.reset();
    //this.usuarioService.getRegiones().subscribe((ubigeo) => (this.ubigeo = []));
  }

  openModalCrud(accion: string, producto?: Producto): void {
    this.createFormControls();
    this.createForm();
    this.contentModal.show();

    if (accion == "editar") {
      this.titulo = "ACTUALIZAR PRODUCTO";

      this.IdProducto.setValue(this.producto.idproducto);
      this.Nombre.setValue(this.producto.nombre);
      this.Precio.setValue(this.producto.precio);
      this.Stock.setValue(this.producto.stock);
      this.Descripcion.setValue(this.producto.descripcion);
      this.Indicaciones.setValue(this.producto.indicaciones);
      this.Serie.setValue(this.producto.serie);

      this.getProducto(producto.idproducto);
      this.getMarca();
      this.getCategoria();
      this.getProveedor();

      console.log(producto.idproducto);
    } else if (accion == "agregar") {
      this.titulo = "REGISTRAR PRODUCTO";
      this.producto.idproducto = 0;
      this.producto.foto1 = null;
      this.producto.foto2 = null;
      this.producto.foto3 = null;
      this.getMarca();
      this.getCategoria();
      this.getProveedor();
      //document.getElementById("imgFoto").setAttribute("src", "");
      console.log(this.producto.idproducto);
      //this.modalAgregar();
      //this.myform.clearValidators();
    }
  }

  //---------*********************************************************------------
  //---------*********************************************************------------
  //---------*********************************************************------------
  //---------*********************************************************------------

  //----------------------- COMPARACION DE ID DE CATEGORIA - PROVEEDOR - MARCA -----------

  compareMarca(c1: Marca, c2: Marca): boolean {
    //console.log(t1.id_ubigeo + t2.id_ubigeo);

    if (
      (c1 === null && c2 === null) ||
      (c1 === undefined && c2 === undefined)
    ) {
      return true;
    } else if (
      c1 === null ||
      c2 === null ||
      c1 === undefined ||
      c2 === undefined
    )
      return false;
    else {
      return c1.idmarca === c2.idmarca;
    }
  }

  compareCategoria(c1: ProCategoria, c2: ProCategoria): boolean {
    //console.log(t1.id_ubigeo + t2.id_ubigeo);

    if (
      (c1 === null && c2 === null) ||
      (c1 === undefined && c2 === undefined)
    ) {
      return true;
    } else if (
      c1 === null ||
      c2 === null ||
      c1 === undefined ||
      c2 === undefined
    )
      return false;
    else {
      return c1.idcategoria === c2.idcategoria;
    }
  }

  compareProveedor(p1: Proveedor, p2: Proveedor): boolean {
    //console.log(t1.id_ubigeo + t2.id_ubigeo);

    if (
      (p1 === null && p2 === null) ||
      (p1 === undefined && p2 === undefined)
    ) {
      return true;
    } else if (
      p1 === null ||
      p2 === null ||
      p1 === undefined ||
      p2 === undefined
    ) {
      return false;
    } else {
      return p1.id_proveedor === p2.id_proveedor;
    }
  }

  //--------------------- VERIFICACION DE DATOS AL DAR SUBMIT AL FORMULARIO ---------------

  verificarDatos(): void {
    for (let j = 0; j < this.input.length; j++) {
      if (this.myform.invalid) {
        swal.fire({
          icon: "error",
          title: "Cuidado...! Aun te faltan datos por completar. ",
          // text: 'Oops...'
        });
        this.submitted = true;
        console.log(this.submitted);
        //this.myform.invalid;
      }
      if (this.myform.valid) {
        //this.click = false;
        swal
          .fire({
            title: "Verificar los datos antes de continuar...",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, registrarse",
          })
          .then((result) => {
            if (this.producto.idproducto === 0) {
              if (result.isConfirmed) {
                swal.fire(
                  "Registro Exitoso...!",
                  `${this.producto.nombre} producto agregado correctamente`,
                  "success"
                );

                this.insert();
                this.contentModal.hide();
              }
            } else if (
              this.producto.idproducto != 0 &&
              this.producto.idproducto > 0
            ) {
              if (result.isConfirmed) {
                swal.fire(
                  "Update Exitoso...!",
                  `${this.producto.nombre} los datos se actualizaron correctamente`,
                  "success"
                );
                this.update();
                this.contentModal.hide();
              }
            }
          });
      }
    }
  }

  //----------------------- CRUD DE PRODUCTOS ---------------------------
  insert(): void {
    this.productoService.insert(this.producto).subscribe((response) => {
      let currentUrl = this.router.url;
      /*this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });*/
      this.listarProductos();
      //this.ngOnInit();
      // this.router.navigate([window.location.reload()]);
    });
  }

  update(): void {
    this.productoService.update(this.producto).subscribe((response) => {
      let currentUrl = this.router.url;
      /* this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });*/
      this.listarProductos();
      /// this.productoService.getProductos();
      //this.ngOnInit();
      // this.router.navigate([window.location.reload()]);
    });
  }

  delete(producto: Producto): void {
    swal
      .fire({
        title: `Seguro desea eliminar el producto ${producto.nombre}... ?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.productoService
            .delete(producto.idproducto)
            .subscribe((response) => {
              this.productos = this.productos.filter(
                (prod) => prod != producto
              );
              swal.fire(
                `El Producto ${this.producto.nombre} ha sido eliminado...!`,
                "success"
              );
            });
        }
      });
  }

  getProducto(idProducto) {
    this.productoService.getProducto(idProducto).subscribe((producto) => {
      this.producto = producto;
    });
  }

  getMarca() {
    this.productoService.getMarca().subscribe((marca) => (this.marca = marca));
  }

  getCategoria() {
    this.productoService
      .getCategoria()
      .subscribe((categoria) => (this.categoria = categoria));
  }

  getProveedor() {
    this.productoService
      .getProveedor()
      .subscribe((proveedor) => (this.proveedor = proveedor));
  }
  //----------------------------------------------------------

  listarProductos() {
    this.productoService
      .getProductos()
      .subscribe((productos) => (this.productos = productos));
  }
}
