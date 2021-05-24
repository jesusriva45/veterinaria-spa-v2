import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TrackingService {
  private urlEndPoint: string = "http://localhost:8090/api/pedidos";

  constructor() {}
}
