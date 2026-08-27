import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicioApiBebidas {

  private urlBebida = 'https://www.thecocktaildb.com/api/json/v1/1';

  constructor(private http: HttpClient) {}

  obtenerBebidaEstrella(): Observable<any> {
    return this.http.get(`${this.urlBebida}/search.php?s=Russian%20Spring%20Punch`);
  }

  obtenerBebidaAleatoria(): Observable<any> {
    return this.http.get(`${this.urlBebida}/random.php`);
  }

  buscarPorNombre(nombre: string): Observable<any> {
    return this.http.get(`${this.urlBebida}/search.php?s=${encodeURIComponent(nombre)}`);
  }

  buscarPorIngrediente(ingrediente: string): Observable<any> {
    return this.http.get(`${this.urlBebida}/filter.php?i=${encodeURIComponent(ingrediente)}`);
  }

  obtenerDetalleBebida(id: string): Observable<any> {
    return this.http.get(`${this.urlBebida}/lookup.php?i=${encodeURIComponent(id)}`);
  }

  bebidaPorTipo(tipo: string): Observable<any> {
    return this.http.get(`${this.urlBebida}/filter.php?a=${encodeURIComponent(tipo)}`);
  }

   bebidaPorCategoria(categoria: string): Observable<any> {
    // CORRECCIÓN: Se cambió `this.apiUrl` por `this.urlBebida`
    // ADEMÁS: Se añadió `encodeURIComponent` para evitar fallos con categorías con espacios o caracteres especiales
    return this.http.get(`${this.urlBebida}/filter.php?c=${encodeURIComponent(categoria)}`);
  }
  obtenerMenuCompletoBebidas(): Observable<any[]> {
    
    const categorias = ['Beer','Cocktail','Cocoa','Coffee / Tea','Homemade Liqueur','Ordinary Drink','Other / Unknown','Punch / Party Drink','Shake','Shot','Soft Drink'];

    const peticiones = categorias.map(cat =>
      this.http.get<any>(`${this.urlBebida}/filter.php?c=${encodeURIComponent(cat)}`)
    );

    return forkJoin(peticiones).pipe(
      map((respuestas: any[]) => {
        return respuestas.reduce((acumulado: any[], actual: any) => {
          return acumulado.concat(actual.drinks || []);
        }, []);
      })              
    );
  }

  asignarPrecioAleatorio(): number {
    const min = 8000;
    const max = 35000;
    const precioBase = Math.floor(Math.random() * (max - min + 1)) + min;
    return Math.round(precioBase / 500) * 500;
  }
}