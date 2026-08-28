import { Component, HostListener, ViewChild } from '@angular/core';
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
  tituloPagina: string = 'Bebidas';
  tipoBusqueda: string = 'nombre';
  textoBusqueda: string = '';
  tipoBebida: string = '';
  categoriaBebida: string = '';
  mostrarBotonSubir = false;

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

  cambiarTituloCategoria(nombreCategoria: string): void {
    this.tituloPagina = nombreCategoria;
  }

  @HostListener('window:scroll')
  actualizarVisibilidadBoton(): void {
    this.mostrarBotonSubir = window.scrollY > 0;
  }

  subirAlInicio(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

