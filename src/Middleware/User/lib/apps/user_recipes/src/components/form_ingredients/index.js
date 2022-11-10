import React from "react";

const ingredients = [
	{ label: 'Zucchini', id: 4823 },
]

function ingredient_field_name(id, subfield){
	return 'recipe_ingredients['+id+']['+subfield+']';
}

export default function Example() {
	return (
	<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
		<div className="md:grid md:grid-cols-3 md:gap-6">
			<div className="md:col-span-1">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Zutaten</h3>
				<p className="mt-1 text-sm text-gray-500">Gib alle Zutaten ein, die für das Rezept benötigt werden.</p>
				<div className="col-span-6 sm:col-span-4 my-4">
					<label htmlFor="search_ingredient" className="block text-sm font-medium text-gray-700">
						Neue Zutat hinzufügen
					</label>
					<div className="mt-1 flex rounded-md shadow-sm">
						<input
							type="text"
							id="search_ingredient"
							placeholder="Zucc..."
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					</div>
				</div>
			</div>
			<div className="mt-5 md:col-span-2 md:mt-0">
				<table className="min-w-full divide-y divide-gray-300">
					<thead className="bg-gray-50">
					<tr>
						<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
							Zutat
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							Anzahl
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							Einheit
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							Anmerkung
						</th>
						<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
							<span className="sr-only">Löschen</span>
						</th>
					</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
					{ingredients.map((ingredient) => (
						<tr key={ingredient.id}>
							<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
								{ingredient.label}
							</td>
							<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
								<input
								type="number"
								name={ingredient_field_name(ingredient.id, 'count')}
								placeholder="1"
								min="1"
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</td>
							<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
								<select
									name={ingredient_field_name(ingredient.id, 'unit')}
									className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
								>
									<option value="585">Stück</option>
									<option>...</option>
									<option>...</option>
								</select>
							</td>
							<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
								<input
									type="text"
									name={ingredient_field_name(ingredient.id, 'comment')}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</td>
							<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
								<a href="#" className="text-indigo-600 hover:text-indigo-900">
									<button type="button"
											className="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
											 stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round"
												  d="M6 18L18 6M6 6l12 12"/>
										</svg>
										<span className="sr-only">{ingredient.label} Entfernen</span>
									</button>
								</a>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
		</div>
	</div>
	)
}