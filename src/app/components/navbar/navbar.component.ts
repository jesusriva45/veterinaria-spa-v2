import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  constructor(private _authService: AuthService) {}

  authService = this._authService;

  logout(): void {
    this._authService.logout();
  }

  ngOnInit(): void {}
}
