import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioApi } from '../servicios/servicio-api';
import { crearInformacionComida, InformacionComida } from '../entidades/informacion-comidas';
import { ServicioCarrito } from '../servicios/servicio-carrito';

@Component({
  selector: 'app-menu-comida',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-comida.html',
  styleUrl: './menu-comida.css'
})
export class MenuComida implements OnInit {

  private api = inject(ServicioApi);
  private carrito = inject(ServicioCarrito);

  tipoBusqueda: string = 'nombre';
  textoBusqueda: string = '';
  comidas = signal<any[]>([]);
  precios = signal<{ [id: string]: number }>({});
  cargando = signal<boolean>(false);
  error = signal<string>('');
  categoriaSeleccionada = signal<string>('todas');
  cargandoInformacion = signal<boolean>(false);
  informacionSeleccionada = signal<InformacionComida | null>(null);

  ngOnInit(): void {
    this.cargarTodas();
  }

  cargarTodas(): void {
    this.categoriaSeleccionada.set('todas');
    this.cargando.set(true);
    this.error.set('');
    this.comidas.set([]); // Limpia la lista anterior

    this.api.obtenerMenuCompletoComidas().subscribe({
      next: (listaComidas: any[]) => {
        this.comidas.set(listaComidas);
        this.asignarPrecios();
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No se pudo cargar el menú completo.');
      }
    });
  }

  cargarPorCategoria(categoria: string): void {
    this.categoriaSeleccionada.set(categoria);
    this.cargando.set(true);
    this.error.set('');
    this.comidas.set([]); // Limpia la lista anterior

    this.api.comidaPorCategoria(categoria).subscribe({
      next: (res: any) => {
        const lista = res.meals ?? [];
        this.comidas.set(lista);
        this.asignarPrecios();
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set(`No se pudieron cargar los platos de ${categoria}.`);
      }
    });
  }

  private asignarPrecios(): void {
    const preciosActuales = { ...this.precios() };

    for (const comida of this.comidas()) {
      const id = comida.idMeal;

      if (id && !preciosActuales[id]) {
        preciosActuales[id] = this.api.asignarPrecioAleatorio();
      }

      if (!comida.strMealThumb && id) {
        comida.strMealThumb = `https://www.themealdb.com/images/media/meals/${id}.jpg`;
      }
    }

    this.precios.set(preciosActuales);
  }

  agregarAlPedido(comida: any): void {
    const item = {
      id: comida.idMeal,
      tipo: 'comida' as const,
      nombre: comida.strMeal,
      imagen: comida.strMealThumb,
      precio: this.precios()[comida.idMeal],
      cantidad: 1
    };
    this.carrito.agregarProducto(item);
  }

  mostrarInformacion(comida: any): void {
    this.cargandoInformacion.set(true);
    this.informacionSeleccionada.set(
      crearInformacionComida(comida, this.precios()[comida.idMeal])
    );

    this.api.obtenerDetalleComida(comida.idMeal).subscribe({
      next: (respuesta: any) => {
        const comidaCompleta = respuesta.meals?.[0] ?? comida;
        this.informacionSeleccionada.set(
          crearInformacionComida(comidaCompleta, this.precios()[comida.idMeal])
        );
        this.cargandoInformacion.set(false);
      },
      error: () => {
        this.informacionSeleccionada.set(
          crearInformacionComida(comida, this.precios()[comida.idMeal])
        );
        this.cargandoInformacion.set(false);
      }
    });
  }

  cerrarInformacion(): void {
    this.informacionSeleccionada.set(null);
  }

  buscarDesdePadre(tipo: string, texto: string): void {
    if (!texto.trim()) {
      this.cargarTodas();
      return;
    }

    this.categoriaSeleccionada.set('');
    this.cargando.set(true);
    this.error.set('');
    this.comidas.set([]);

    const peticion =
      tipo === 'nombre'
        ? this.api.buscarPorNombre(texto)
        : this.api.buscarPorIngrediente(texto);

    peticion.subscribe({
      next: (respuesta: any) => {
        const lista = respuesta.meals ?? [];
        this.comidas.set(lista);
        this.asignarPrecios();
        this.cargando.set(false);

        if (lista.length === 0) {
          this.error.set('No se encontraron platillos con esa búsqueda.');
        }
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('Ocurrió un error al realizar la búsqueda.');
      }
    });
  }
}