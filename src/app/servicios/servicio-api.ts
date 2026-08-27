import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioApi {

  private http = inject(HttpClient);
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1';

  obtenerPlatoEstrella(): Observable<any> {
    return this.http.get(`${this.apiUrl}/search.php?s=Arroz%20con%20gambas%20y%20calamar`);
  }

  obtenerComidasAleatorias(cantidad: number): Observable<any[]> {
    const peticiones = Array.from({ length: cantidad }, () =>
      this.http.get<any>(`${this.apiUrl}/random.php`)
    );

    return forkJoin(peticiones).pipe(
      map((respuestas) => respuestas
        .map((respuesta) => respuesta.meals?.[0])
        .filter((comida) => comida)
      )
    );
  }

  buscarPorNombre(nombre: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search.php?s=${nombre}`);
  }

  // Buscar platillos por ingrediente principal
  buscarPorIngrediente(ingrediente: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/filter.php?i=${ingrediente}`);
  }

  // Obtiene los platos de una sola categoría
  comidaPorCategoria(categoria: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/filter.php?c=${categoria}`);
  }

  obtenerDetalleComida(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/lookup.php?i=${encodeURIComponent(id)}`);
  }

  // Obtiene el menú consolidado de las 5 categorías exactas de la imagen
  obtenerMenuCompletoComidas(): Observable<any[]> {
    const categorias = ['Seafood', 'Chicken', 'Dessert', 'Vegetarian', 'Pasta', 'Pork'];

    const peticiones = categorias.map((cat) =>
      this.http.get<any>(`${this.apiUrl}/filter.php?c=${cat}`)
    );

    return forkJoin(peticiones).pipe(
      map((respuestas: any[]) => {
        let menuCompleto: any[] = [];

        respuestas.forEach((res) => {
          if (res && res.meals) {
            menuCompleto = menuCompleto.concat(res.meals);
          }
        });

        return menuCompleto;
      })
    );
  }

  // Generador de precios aleatorios
  asignarPrecioAleatorio(): number {
    return Math.floor(Math.random() * (40000 - 15000 + 1)) + 15000;
  }
}