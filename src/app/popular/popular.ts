import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ServicioApi } from '../servicios/servicio-api';
import { ServicioApiBebidas } from '../servicios/servicio-api-bebidas';

@Component({
  selector: 'app-popular',
  imports: [CommonModule],
  templateUrl: './popular.html',
  styleUrl: './popular.css',
})
export class Popular implements OnInit {
  platoEstrella = signal<any | null>(null);
  bebidaEstrella = signal<any | null>(null);
  ingredientesPlato = signal<string[]>([]);
  ingredientesBebida = signal<string[]>([]);
  precioPlato = signal(0);
  precioBebida = signal(0);

  constructor(
    private apiComidas: ServicioApi,
    private apiBebidas: ServicioApiBebidas
  ) {}

  ngOnInit(): void {
    this.apiComidas.obtenerPlatoEstrella().subscribe({
      next: (respuesta: any) => {
        const plato = respuesta.meals?.[0] ?? null;
        this.platoEstrella.set(plato);
        this.ingredientesPlato.set(this.extraerIngredientes(plato, 'strIngredient'));
        this.precioPlato.set(this.apiComidas.asignarPrecioAleatorio());
      }
    });

    this.apiBebidas.obtenerBebidaEstrella().subscribe({
      next: (respuesta: any) => {
        const bebida = respuesta.drinks?.[0] ?? null;
        this.bebidaEstrella.set(bebida);
        this.ingredientesBebida.set(this.extraerIngredientes(bebida, 'strIngredient'));
        this.precioBebida.set(this.apiBebidas.asignarPrecioAleatorio());
      }
    });
  }

  private extraerIngredientes(item: any, prefijo: string): string[] {
    if (!item) {
      return [];
    }

    return Array.from({ length: 20 }, (_, indice) => indice + 1)
      .map((numero) => {
        const ingrediente = item[`${prefijo}${numero}`]?.trim();
        const medida = item[`strMeasure${numero}`]?.trim();
        return ingrediente ? `${medida ? `${medida} ` : ''}${ingrediente}` : '';
      })
      .filter((ingrediente): ingrediente is string => Boolean(ingrediente));
  }
}
