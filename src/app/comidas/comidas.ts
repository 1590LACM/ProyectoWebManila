import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComida } from '../menu-comida/menu-comida';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComida],
  templateUrl: './comidas.html',
  styleUrl: './comidas.css'
})
export class Comidas {

  tituloPagina: string = 'Comidas';
  tipoBusqueda: string = 'nombre';
  textoBusqueda: string = '';

  // Referencia al componente hijo <app-menu-comida>
  @ViewChild('menuHijo') menuHijo!: MenuComida;

  ejecutarBusqueda(): void {
    if (this.menuHijo) {
      this.menuHijo.buscarDesdePadre(this.tipoBusqueda, this.textoBusqueda);
    }
  }

  cambiarTituloCategoria(nombreCategoria: string): void {
    this.tituloPagina = nombreCategoria;
  }
}