import React, { useState, useEffect } from 'react';
import ingredientModel from '../../../models/ingredient';
import routes from "../../../models/routes";
import headers from "../../../modules/headers";
import Spinner from '../../spinner';

function IngredientCreator(props) {
	const {
		target,
		onAdd = ()=>{},
		onUpdate = ()=>{},
		setShow = ()=>{},
	} = props;
	
	const [taxonomy, setTaxonomy] = useState({
		name: target.ingredient.label,
		name_multiple: '',
		unit: '',
		unit_multiple: ''
	});
	
	const [saving, setSaving] = useState(false);
	
	const handleAdd = (item) => {
		// Add the new ingredient to the parent component's state
		const ingredient = { ...ingredientModel, ...target.ingredient, ...{id: item.id, label: item.name, order: target.ingredient.order, custom: false} };
		// it's not the real ingredient item, it's the taxonomy without meta data
		onAdd(ingredient, target.ingredient.id);
	
		setShow(false);
	}
	
	const handleCreate = () => {
		if(validate()){
			setSaving(true);
			fetch(routes.createIngredient, {
				method: 'POST',
				cache: 'no-cache',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(taxonomy)
			})
				.then(response => response.json())
				.then(data => {
					alert(data.message);
					if(data.status === 'success') {
						handleAdd({
							id: data.data.id,
							name: taxonomy.name,
						});
					}
				}).finally(() => {
					setSaving(false);
				});
		}else{
			// show error
			alert('Bitte fülle alle Felder aus!');
		}
	};
	
	const validate = () => {
		return taxonomy.name.length > 2 && taxonomy.name_multiple.length > 2;
	}
	
	return (
		<div id="wrapper" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div id="innerWrapper" className="bg-white rounded-lg p-6 w-full w-3/4 h-[100vh] max-h-[80vh] flex flex-col">
				<div id="searchBar" className="mb-4">
					<h3 className="mb-2">Zutat erstellen</h3>
				</div>
				<div id="results" className="h-full max-h-[100%] overflow-y-scroll bg-grey-50 p-6">
					<div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
						<input
							placeholder="Name Zutat"
							type="text"
							className="min-w-max block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							value={taxonomy.name}
							onChange={e => setTaxonomy({ ...taxonomy, name: e.target.value })}
						/>
						<input
							placeholder="Name Zutat (Mehrzahl)"
							type="text"
							className="min-w-max block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							value={taxonomy.name_multiple}
							onChange={e => setTaxonomy({ ...taxonomy, name_multiple: e.target.value })}
						/>
					
					</div>
				</div>
				<div className="flex justify-end mt-4">
					{saving ? <Spinner/> :
					<>
						<button type="button" className="bg-orange-600 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleCreate}>Speichern</button>
						<button type="button" className="bg-grey-500 text-white font-bold py-2 px-4 rounded" onClick={()=>setShow(false)}>Abbrechen</button>
					</>
					}
				</div>
			</div>
		</div>
	);
}


export default IngredientCreator;
