import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationStart } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  successAlert = false;
  router: string;

  constructor(private _router: Router) {
    //_router.events.subscribe((url: any) => console.log(url));
    //console.log(_router.url);
    //this.router = this._router.url + "login";
  }
  ngOnInit(): void {
    this._router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        setTimeout(() => {
          this.router = this._router.url;
          console.log(this._router.url);
        }, 10);
      }
    });
  }

  copyToClipboard(value: string): void {
    const tempInput = document.createElement("input");
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    console.log(this.router);
    this.successAlert = true;

    setTimeout(() => {
      this.successAlert = false;
    }, 900);
  }
}
