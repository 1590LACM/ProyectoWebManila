import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ServicioApi } from '../servicios/servicio-api';

@Component({
  selector: 'app-carrusel',
  imports: [CommonModule],
  templateUrl: './carrusel.html',
  styleUrl: './carrusel.css',
})
export class Carrusel implements OnInit {
  comidas = signal<any[]>([]);

  constructor(private api: ServicioApi) {}

  ngOnInit(): void {
    this.api.obtenerComidasAleatorias(3).subscribe({
      next: (comidas) => this.comidas.set(comidas)
    });
  }
}
