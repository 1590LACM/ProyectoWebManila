import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Carrusel } from "../carrusel/carrusel";
import { Popular } from "../popular/popular";
@Component({
  selector: 'app-inicio',
  imports: [RouterLink, Carrusel, Popular],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {}
