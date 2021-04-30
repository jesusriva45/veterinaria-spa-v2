import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnInit {
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {}

  private yourHeadersConfig = new HttpHeaders({
    "Content-Type": "application/json",
  });
}
