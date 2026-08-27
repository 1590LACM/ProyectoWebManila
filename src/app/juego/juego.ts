import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ServicioApi } from '../servicios/servicio-api';
import { ServicioApiBebidas } from '../servicios/servicio-api-bebidas';

@Component({
  selector: 'app-juego',
  standalone: true,
  templateUrl: './juego.html',
  styleUrl: './juego.css',
})
export class Juego implements OnInit {
  casillas: number[] = Array.from({ length: 16 }, (_, i) => i + 1);
  posicion: number = 0;
  posicion2: number = 0;
  letrero: string = "";
  contadorAciertos: number = 0;
  imagenPlato: string = "";
  imagenBebida: string = "";

  constructor(
    private detector: ChangeDetectorRef,
    private servicioApi: ServicioApi,
    private servicioApiBebidas: ServicioApiBebidas
  ) {}

  ngOnInit(): void {
    this.posicion = Math.floor(Math.random() * 16) + 1;
    this.posicion2 = Math.floor(Math.random() * 16) + 1;
    while (this.posicion2 === this.posicion) {
      this.posicion2 = Math.floor(Math.random() * 16) + 1;
    }

    this.servicioApi.obtenerComidasAleatorias(1).subscribe((comidas) => {
      this.imagenPlato = comidas[0]?.strMealThumb ?? "";
      this.actualizarImagenRevelada(this.posicion, this.imagenPlato);
    });
    this.servicioApiBebidas.obtenerBebidaAleatoria().subscribe((respuesta) => {
      this.imagenBebida = respuesta.drinks?.[0]?.strDrinkThumb ?? "";
      this.actualizarImagenRevelada(this.posicion2, this.imagenBebida);
    });
  }

  private actualizarImagenRevelada(posicion: number, imagen: string) {
    const img = document.getElementById("img" + posicion) as HTMLImageElement;
    if (img?.style.display === "block" && imagen) {
      img.src = imagen;
    }
  }

  reiniciar() {
    this.casillas.forEach(i => {
      const img = document.getElementById("img" + i) as HTMLImageElement;
      if (img) {
        img.style.display = "none";
        img.src = "";
      }
    });
    this.contadorAciertos = 0;
    this.letrero = "";
    this.imagenPlato = "";
    this.imagenBebida = "";
    this.ngOnInit();
    this.detector.detectChanges();
  }

  descubrirO(p: number) {
    const img = document.getElementById("img" + p) as HTMLImageElement;
    if (!img || img.style.display === "block" || this.contadorAciertos === 2) return;

    if (p === this.posicion || p === this.posicion2) {
      img.src = p === this.posicion ? this.imagenPlato : this.imagenBebida;
      img.style.display = "block";
      this.contadorAciertos++;
    } else {
      img.src = "/img/blanco.jpg";
      img.style.display = "block";
    }

    if (this.contadorAciertos === 2) {
      this.letrero = "GANASTE 🎉🎉🎉";
    }
  }
}