import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';

import { Carrito} from './carrito/carrito';
import { Juego } from './juego/juego';
import { Comidas } from './comidas/comidas';
import { Bebidas } from './bebidas/bebidas';

export const routes: Routes = [
    {path:'', component: Inicio},
    {path:'comidas', component: Comidas},
    {path:'bebidas', component: Bebidas},
    {path: 'carrito', component: Carrito},
    {path:'juego', component: Juego},
    {path:'**', redirectTo:''}
];