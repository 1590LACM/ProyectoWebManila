import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  constructor(private router: Router) {}

  irAlInicioDePagina(event: Event, ruta: string): void {
    event.preventDefault();

    if (this.router.url === ruta || (ruta === '/' && this.router.url === '')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.router.navigateByUrl(ruta).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
