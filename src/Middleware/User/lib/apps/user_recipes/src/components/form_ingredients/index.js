import React, { useEffect, useState } from "react";
import Spinner from '../spinner';
import TermSearch from "../combobox/term_search.js";
import Dropdown from "../dropdown";

import routes from "../../models/routes";
import ingredientUnitValues from "../../models/ingredient/units";
import ingredientModel from "../../models/ingredient";

export default function Ingredients(props) {
	const {
		formState,
		setFormState,
	} = props;

	const {
		servings,
		ingredients
	} = formState;
	
	const [loading, setLoadingState] = useState(true);
	
	// database stuff
	const [ingredientsDB, setIngredientsDB] = useState([]); // data from db
	
	// ingredients list from db for TermSearch
	useEffect( () => {
		fetch(routes.getIngredients).then(response => response.json())
		.then(data => { setIngredientsDB(data.items); setLoadingState(false); });
	}, []);

	// needs custom function to apply data to the right array item
	const setIngredient = (item) => {
		const newIngredients =
			ingredients.map(ingredient => { return ingredient.id === item.id ? item : ingredient; });

		setFormState({ingredients: newIngredients});
	}
	
	const addIngredient = (item) =>{
		const ingredient = { ...ingredientModel, id: item.id, label: item.name };
		
		ingredients.push(ingredient);
		setFormState({ingredients: ingredients});
	}
	
	const removeIngredient = (item) => {
		// filter out the item from list
		const newIngredients = ingredients.filter(ingredient => ingredient.id !== item.id);
		setFormState({ingredients: newIngredients});
	}
	
	// conditional rendering for TermSearch
	const TermSearchComp = loading ? <Spinner /> : <TermSearch label={"Neue Zutat hinzufügen"} items={ingredientsDB} onChange={addIngredient} />;

	return (
	<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
		<div className="md:grid md:grid-cols-4 md:gap-6">
			<div className="md:col-span-1">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Zutaten</h3>
				<p className="mt-1 text-sm text-gray-500">Gib alle Zutaten ein, die für das Rezept benötigt werden.</p>
				<div className="col-span-6 sm:col-span-4 my-4">
					<label htmlFor="recipe_servings" className="mr-4 text-sm font-medium text-gray-700">
						Rezept für
					</label>
					<select
						value={servings}
						onChange={e => setFormState({"servings": parseInt(e.target.value)})}
						className="w-52 max-w-full whitespace-nowrap mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					>
						{[1,2,4,6,8,10,12,14,16,18,20].map(i => (
							<option value={i} key={i}>{i} Portionen</option>
						))}
					</select>
				</div>
				{TermSearchComp}
			</div>
			<div className="mt-5 md:col-span-3 md:mt-0 overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-300">
					<thead className="bg-gray-50">
					<tr>
						<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
							Zutat
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							Menge
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
					{ingredients.map(ingredient => (
						<tr key={ingredient.id}>
							<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
								{ingredient.label}
							</td>
							<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
								<input
									value={ingredient.amount}
									onChange={e => { ingredient.amount = e.target.value; setIngredient(ingredient); }}
									type="number"
									placeholder="1"
									min="1"
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</td>
							<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
								<Dropdown value={ingredient.unit} items={ingredientUnitValues}
								          onChange={val => { ingredient.unit = val; setIngredient(ingredient);}}
								          defaultValue={"g"}
								/>
							</td>
							<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
								<input
									type="text"
									className="min-w-max mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									value={ingredient.note}
									onChange={e => { ingredient.note = e.target.value; setIngredient(ingredient); }}
								/>
							</td>
							<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
								<button
									onClick={() => removeIngredient(ingredient)}
									type="button"
										className="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
										 strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
										<path strokeLinecap="round" strokeLinejoin="round"
											  d="M6 18L18 6M6 6l12 12"/>
									</svg>
									<span className="sr-only">{ingredient.label} Entfernen</span>
								</button>
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