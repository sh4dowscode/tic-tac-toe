import { AfterViewInit, Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'frontend';

  ngAfterViewInit() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    document.body.style.height = `${innerHeight}px`;
    document.body.style.width = `${width}px`;
    let main = <HTMLElement>document.getElementById("main");
    main.style.height = `${height}px`;
    if (width <= 540) {
      main.style.width = `${width}px`;
    } else {
      main.style.width = `540px`;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    let width = window.innerWidth;
    let height = window.innerHeight;
    document.body.style.height = `${innerHeight}px`;
    document.body.style.width = `${width}px`;
    let main = <HTMLElement>document.getElementById("main");
    main.style.height = `${height}px`;
    if (width <= 540) {
      main.style.width = `${width}px`;
    } else {
      main.style.width = `540px`;
    }
  }

}
