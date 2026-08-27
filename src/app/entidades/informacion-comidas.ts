export interface InformacionComida {
	id: string;
	nombre: string;
	categoria: string;
	area: string;
	ingredientes: string[];
	imagen: string;
	precio: number;
}

export function crearInformacionComida(
	comida: any,
	precio: number
): InformacionComida {
	const ingredientes: string[] = [];

	for (let indice = 1; indice <= 20; indice++) {
		const ingrediente = comida[`strIngredient${indice}`];
		const medida = comida[`strMeasure${indice}`];

		if (ingrediente?.trim()) {
			ingredientes.push(medida?.trim() ? `${medida.trim()} ${ingrediente.trim()}` : ingrediente.trim());
		}
	}

	return {
		id: comida.idMeal,
		nombre: comida.strMeal,
		categoria: comida.strCategory || 'Sin categoría',
		area: comida.strArea || 'Sin especificar',
		ingredientes,
		imagen: comida.strMealThumb,
		precio
	};
}
