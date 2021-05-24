import { Injectable } from "@angular/core";
import { CarritoProducto } from "../models/carrito-producto";
import { iif, Subject } from "rxjs";
import { DetallePedidoProducto } from '../models/detalle-pedido-producto';
import { DetallePedidoServicio } from '../models/detalle-pedido-servicio';

@Injectable({
  providedIn: "root",
})
export class CarritoService {
  cartItems: DetallePedidoProducto[] = [];
  cartItemsServicio: DetallePedidoServicio[] = [];


  //declaracion de Observables para obtener el precio y cantidad total del CarritoProducto de Compras
  precioTotal: Subject<number> = new Subject<number>();
  cantidadTotal: Subject<number> = new Subject<number>();

  constructor() { }

  agregarItem(theCartItem: DetallePedidoProducto) {
    // valores para verificar si existe un item(producto) en el carro
    let itemExistente: boolean = false;
    let existingCartItem: DetallePedidoProducto = undefined;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id
      existingCartItem = this.cartItems.find(
        (itemTemporal) =>
          itemTemporal.producto.idproducto === theCartItem.producto.idproducto
      )
      itemExistente = existingCartItem != undefined;
    }

    if (itemExistente) {
      // incrementar cantidad
      existingCartItem.cantidad++;
    } else {
      // si existingCartItem = undefined agregar el elemento al array cartItems
      this.cartItems.push(theCartItem);
    }

    //calcular el precio total del carrito y la cantidad total
    this.calcularPrecioPorCantidadTotal();
  }

  removeItem(item: CarritoProducto) {
    const idItem = this.cartItems.findIndex(
      (tempItem) => tempItem.producto.idproducto == item.producto.idproducto
    );

    if (idItem > -1) {
      this.cartItems.splice(idItem, 1);
      this.calcularPrecioPorCantidadTotal();
    }
  }


  agregarItemServicio(theCartItem: DetallePedidoServicio) {
    // valores para verificar si existe un item(producto) en el carro
    let itemExistente: boolean = false;
    let existingCartItem: DetallePedidoServicio = undefined;
    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id
      existingCartItem = this.cartItemsServicio.find(
        (itemTemporal) =>
          itemTemporal.servicio.idservicio === theCartItem.servicio.idservicio
      )
      itemExistente = existingCartItem != undefined;
    }
    if (itemExistente) {
      // incrementar cantidad
      existingCartItem.cantidad++;
    } else {
      // si existingCartItem = undefined agregar el elemento al array cartItems
      this.cartItemsServicio.push(theCartItem);
    }
    //calcular el precio total del carrito y la cantidad total
    this.calcularPrecioPorCantidadTotal();
  }


  removeItemServicio(item: CarritoProducto) {
    const idItem = this.cartItems.findIndex(
      (tempItem) => tempItem.producto.idproducto == item.producto.idproducto
    );
    if (idItem > -1) {
      this.cartItems.splice(idItem, 1);
      this.calcularPrecioPorCantidadTotal();
    }
  }

  diminuirCantidad(item: CarritoProducto) {
    item.cantidad--;

    if (item.cantidad === 0) {
      this.removeItem(item);
    } else {
      this.calcularPrecioPorCantidadTotal();
    }
  }

  calcularPrecioPorCantidadTotal() {
    let precioTotal: number = 0;
    let cantidadTotal: number = 0;

    if (this.cartItemsServicio.length > 0) {
      for (let itemActual of this.cartItemsServicio) {
        precioTotal += itemActual.cantidad * itemActual.precio;
        cantidadTotal += itemActual.cantidad;
      }

    }
    if (this.cartItems.length > 0) {
      for (let itemActual of this.cartItems) {
        precioTotal += itemActual.cantidad * itemActual.precio;
        cantidadTotal += itemActual.cantidad;
      }
    }


    // publish the new values ... all subscribers will receive the new data
    this.precioTotal.next(precioTotal);
    this.cantidadTotal.next(cantidadTotal);

    // log cart data just for debugging purposes
    this.logCartData(precioTotal, cantidadTotal);
  }


  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("Contents of the cart");
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.cantidad * tempCartItem.precio;
      console.log(
        `name: ${tempCartItem.producto.nombre}, quantity=${tempCartItem.cantidad}, unitPrice=${tempCartItem.precio}, subTotalPrice=${subTotalPrice}`
      );
    }

    console.log(
      `totalPrice: ${totalPriceValue.toFixed(
        2
      )}, totalQuantity: ${totalQuantityValue}`
    );
    console.log("----");
  }
}
