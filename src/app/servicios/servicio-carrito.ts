import { Injectable, signal } from '@angular/core';

export interface ItemCarrito {
	id: string;
	tipo: 'comida' | 'bebida';
	nombre: string;
	imagen: string;
	precio: number;
	cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class ServicioCarrito {
	private readonly productosActuales = signal<ItemCarrito[]>([]);
	readonly productos = this.productosActuales.asReadonly();

	agregarProducto(producto: ItemCarrito): void {
		const productos = this.productosActuales();
		const existente = productos.find(
			(item) => item.id === producto.id && item.tipo === producto.tipo
		);

		if (existente) {
			this.productosActuales.set(
				productos.map((item) =>
					item === existente
						? { ...item, cantidad: item.cantidad + producto.cantidad }
						: item
				)
			);
			return;
		}

		this.productosActuales.set([...productos, { ...producto }]);
	}

	cambiarCantidad(id: string, cantidad: number): void {
		if (cantidad < 1) {
			return;
		}

		this.productosActuales.set(
			this.productosActuales().map((item) =>
				item.id === id ? { ...item, cantidad } : item
			)
		);
	}

	quitarProducto(id: string): void {
		this.productosActuales.set(
			this.productosActuales().filter((item) => item.id !== id)
		);
	}

	vaciarCarrito(): void {
		this.productosActuales.set([]);
	}

	total(): number {
		return this.productosActuales().reduce(
			(total, item) => total + item.precio * item.cantidad,
			0
		);
	}
}
