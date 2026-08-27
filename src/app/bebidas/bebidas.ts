import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuBebida } from "../menu-bebida/menu-bebida";

@Component({
  selector: 'app-bebidas',
  imports: [CommonModule, FormsModule, MenuBebida],
  templateUrl: './bebidas.html',
  styleUrl: './bebidas.css',
})
export class Bebidas {
  tipoBusqueda: string = 'nombre';
  textoBusqueda: string = '';
  tipoBebida: string = '';
  categoriaBebida: string = '';

  // Referencia al componente hijo <app-menu-bebida>
  @ViewChild('menuHijo') menuHijo!: MenuBebida;

  ejecutarBusqueda(): void {
    if (!this.menuHijo) {
      return;
    }

    if (this.textoBusqueda.trim()) {
      this.menuHijo.buscarDesdePadre(this.tipoBusqueda, this.textoBusqueda);
    } else if (this.tipoBebida) {
      this.menuHijo.cargarPorTipoB(this.tipoBebida);
    } else if (this.categoriaBebida) {
      this.menuHijo.cargarPorCategoriaB(this.categoriaBebida);
    } else {
      this.menuHijo.cargarTodas();
    }
  }
}

