import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioApiBebidas } from '../servicios/servicio-api-bebidas';
import { crearInformacionBebida, InformacionBebida } from '../entidades/informacion-bebida';
import { ServicioCarrito } from '../servicios/servicio-carrito';

@Component({
  selector: 'app-menu-bebida',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-bebida.html',
  styleUrl: './menu-bebida.css'
})
export class MenuBebida implements OnInit {

  bebidas = signal<any[]>([]);
  precios = signal<{ [id: string]: number }>({});
  cargando = signal<boolean>(false);
  cargandoInformacion = signal<boolean>(false);
  error = signal<string>('');
  informacionSeleccionada = signal<InformacionBebida | null>(null);
   categoriaSeleccionada = signal<string>('todas');
  @Output() categoriaCambiada = new EventEmitter<string>();

  constructor(private api: ServicioApiBebidas, private carrito: ServicioCarrito) {}

   ngOnInit(): void {
    this.cargarTodas();
  }

  cargarTodas(): void {
    this.categoriaSeleccionada.set('todas');
    this.cargando.set(true);
    this.error.set('');
    this.bebidas.set([]); // Limpia la lista anterior

    this.api.obtenerMenuCompletoBebidas().subscribe({
      next: (listaBebidas: any[]) => {
        this.bebidas.set(listaBebidas);
        this.asignarPrecios();
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No se pudo cargar el menú completo.');
      }
    });
  }

  cargarPorCategoriaB(categoria: string): void {
    this.categoriaSeleccionada.set(categoria);
    this.categoriaCambiada.emit(this.nombreCategoria(categoria));
    this.cargando.set(true);
    this.error.set('');
    this.bebidas.set([]); // Limpia la lista anterior

    this.api.bebidaPorCategoria(categoria).subscribe({
      next: (res: any) => {
       const lista = res.drinks ?? [];
        this.bebidas.set(lista);
        this.asignarPrecios();
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set(`No se pudieron cargar los platos de ${categoria}.`);
      }
    });
  }

  private nombreCategoria(categoria: string): string {
    const nombres: { [categoria: string]: string } = {
      'Ordinary Drink': 'Bebida común',
      Cocktail: 'Cóctel',
      Shake: 'Batido',
      Cocoa: 'Cacao',
      Shot: 'Shot',
      'Other / Unknown': 'Otros',
      Beer: 'Cerveza',
      'Coffee / Tea': 'Café y té',
      'Homemade Liqueur': 'Licor casero',
      'Punch / Party Drink': 'Ponche',
      'Soft Drink': 'Bebida sin alcohol'
    };

    return nombres[categoria] ?? categoria;
  }

  cargarPorTipoB(tipo: string): void {
    this.categoriaSeleccionada.set(tipo);
    this.cargando.set(true);
    this.error.set('');
    this.bebidas.set([]);

    this.api.bebidaPorTipo(tipo).subscribe({
      next: (res: any) => {
        const lista = res.drinks ?? [];
        this.bebidas.set(lista);
        this.asignarPrecios();
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set(`No se pudieron cargar las bebidas de tipo ${tipo}.`);
      }
    });
  }

  private asignarPrecios(): void {
    const preciosActuales = { ...this.precios() };

    for (const bebida of this.bebidas()) {
      const id = bebida.idDrink;

      if (!preciosActuales[id]) {
        preciosActuales[id] = this.api.asignarPrecioAleatorio();
      }

      if (!bebida.strDrinkThumb && id) {
        bebida.strDrinkThumb = `https://www.thecocktaildb.com/images/media/drink/${id}.jpg`;
      }
    }

    this.precios.set(preciosActuales);
  }

  agregarAlPedido(bebida: any): void {
    const item = {
      id: bebida.idDrink,
      tipo: 'bebida' as const,
      nombre: bebida.strDrink,
      imagen: bebida.strDrinkThumb,
      precio: this.precios()[bebida.idDrink],
      cantidad: 1
    };
    this.carrito.agregarProducto(item);
  }

  mostrarInformacion(bebida: any): void {
    this.cargandoInformacion.set(true);
    this.informacionSeleccionada.set(
      crearInformacionBebida(bebida, this.precios()[bebida.idDrink])
    );

    this.api.obtenerDetalleBebida(bebida.idDrink).subscribe({
      next: (respuesta: any) => {
        const bebidaCompleta = respuesta.drinks?.[0] ?? bebida;
        this.informacionSeleccionada.set(
          crearInformacionBebida(
            bebidaCompleta,
            this.precios()[bebida.idDrink]
          )
        );
        this.cargandoInformacion.set(false);
      },
      error: () => {
        this.informacionSeleccionada.set(
          crearInformacionBebida(bebida, this.precios()[bebida.idDrink])
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
    this.bebidas.set([]);

    const peticion =
      tipo === 'nombre'
        ? this.api.buscarPorNombre(texto)
        : this.api.buscarPorIngrediente(texto);

    peticion.subscribe({
      next: (respuesta: any) => {
        const lista = respuesta.drinks ?? [];
        this.bebidas.set(lista);
        this.asignarPrecios();
        this.cargando.set(false);

        if (lista.length === 0) {
          this.error.set('No se encontraron bebidas con esa búsqueda.');
        }
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('Ocurrió un error al realizar la búsqueda.');
      }
    });
  }
}
