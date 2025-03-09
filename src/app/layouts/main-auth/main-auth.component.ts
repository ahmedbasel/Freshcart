import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-main-auth',
  imports: [NavbarComponent, RouterOutlet, FooterComponent],
  templateUrl: './main-auth.component.html',
  styleUrl: './main-auth.component.scss'
})
export class MainAuthComponent {

}
