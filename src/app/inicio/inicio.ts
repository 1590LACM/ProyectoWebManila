import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carrusel } from "../carrusel/carrusel";
import { Popular } from "../popular/popular";
@Component({
  selector: 'app-inicio',
  imports: [CommonModule, Carrusel, Popular],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  mostrarBotonSubir = false;

  @HostListener('window:scroll')
  actualizarVisibilidadBoton(): void {
    this.mostrarBotonSubir = window.scrollY > 0;
  }

  subirAlInicio(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
