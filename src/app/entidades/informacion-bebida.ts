export interface InformacionBebida {
	id: string;
	nombre: string;
	categoria: string;
	tipo: string;
	vaso: string;
	ingredientes: string[];
	imagen: string;
	precio: number;
}

export function crearInformacionBebida(
	bebida: any,
	precio: number
): InformacionBebida {
	const ingredientes: string[] = [];

	for (let indice = 1; indice <= 15; indice++) {
		const ingrediente = bebida[`strIngredient${indice}`];
		const medida = bebida[`strMeasure${indice}`];

		if (ingrediente) {
			ingredientes.push(medida ? `${medida.trim()} ${ingrediente}` : ingrediente);
		}
	}

	return {
		id: bebida.idDrink,
		nombre: bebida.strDrink,
		categoria: bebida.strCategory || 'Sin categoría',
		tipo: bebida.strAlcoholic || 'Sin especificar',
		vaso: bebida.strGlass || 'Sin especificar',
		ingredientes,
		imagen: bebida.strDrinkThumb,
		precio
	};
}