import { Injectable } from "@angular/core";
import { Carrito } from "../models/carrito";
import { iif, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CarritoService {
  cartItems: Carrito[] = [];

  //declaracion de Observables para obtener el precio y cantidad total del Carrito de Compras
  precioTotal: Subject<number> = new Subject<number>();
  cantidadTotal: Subject<number> = new Subject<number>();

  constructor() {}

  agregarItem(theCartItem: Carrito) {
    // valores para verificar si existe un item(producto) en el carro
    let itemExistente: boolean = false;
    let existingCartItem: Carrito = undefined;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id
      existingCartItem = this.cartItems.find(
        (itemTemporal) => itemTemporal.id === theCartItem.id
      );

      /* for (let itemTemporal of this.cartItems) {
        if (itemTemporal.id === theCartItem.id) {
          existingCartItem = itemTemporal;
          break;
        }
      }*/
      // verificar si se existe el item(producto)
      //itemExistente = (existingCartItem != undefined);
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

  removeItem(item: Carrito) {
    const idItem = this.cartItems.findIndex(
      (tempItem) => tempItem.id == item.id
    );

    if (idItem > -1) {
      this.cartItems.splice(idItem, 1);
      this.calcularPrecioPorCantidadTotal();
    }
  }

  diminuirCantidad(item: Carrito) {
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

    for (let itemActual of this.cartItems) {
      precioTotal += itemActual.cantidad * itemActual.precioUnit;
      cantidadTotal += itemActual.cantidad;
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
      const subTotalPrice = tempCartItem.cantidad * tempCartItem.precioUnit;
      console.log(
        `name: ${tempCartItem.nombre}, quantity=${tempCartItem.cantidad}, unitPrice=${tempCartItem.precioUnit}, subTotalPrice=${subTotalPrice}`
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
