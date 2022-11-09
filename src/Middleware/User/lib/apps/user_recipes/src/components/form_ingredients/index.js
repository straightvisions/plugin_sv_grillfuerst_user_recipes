import React from "react";

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
				<div className="grid grid-cols-6 gap-6">
					<div>
						<label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
							Zucchini
						</label>
						<div className="mt-1 flex rounded-md shadow-sm">
							<input
								type="number"
								name="ingredients[999]"
								id="ingredients"
								placeholder="1"
								min="1"
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
					</div>
					<div>
						<label htmlFor="recipe_kitchen_style" className="block text-sm font-medium text-gray-700">
							Einheit
						</label>
						<div className="mt-1 flex rounded-md shadow-sm">
							<select
								id="recipe_kitchen_style"
								name="recipe_kitchen_style"
								className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
							>
								<option value="585">Stück</option>
								<option>...</option>
								<option>...</option>
							</select>
						</div>
					</div>
					<div>
						<label htmlFor="recipe_kitchen_style" className="block text-sm font-medium text-gray-700">
							Anmerkung
						</label>
						<div className="mt-1 flex rounded-md shadow-sm">
							<input
								type="text"
								name="ingredients[999]"
								id="ingredients"
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	)
}