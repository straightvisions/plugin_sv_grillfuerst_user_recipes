import React, { useState, useEffect } from 'react';
import ingredientModel from '../../../models/ingredient';

function IngredientReplacer(props) {
	const {
		target,
		items,
		onSelect = ()=>{},
		setShow = ()=>{},
	} = props;
	const [searchResults, setSearchResults] = useState([]);
	const [searchQuery, setSearchQuery] = useState(target.ingredient.label);
	
	useEffect(()=>{
		handleSearch(searchQuery);
	},[]);
	
	const handleSearch = (searchTerm) => {
		// Filter the items based on the searchTerm
		const results = items.filter((ingredient) =>
			ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setSearchQuery(searchTerm);
		setSearchResults(results);
	};
	
	const handleSelect = (selectedIngredient) => {
		// Create a new ingredient object with the selected ingredient data
		const newIngredient = {
			...ingredientModel,
			...target.ingredient,
			id: selectedIngredient.id,
			label: selectedIngredient.name,
			custom: false
		};
		
		console.log(newIngredient);
		
		// Add the new ingredient to the parent component's state
		onSelect(newIngredient, target.ingredient.id);
		setShow(false);
	};

	return (
		<div id="wrapper" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div id="innerWrapper" className="bg-white rounded-lg p-6 w-full w-3/4 h-[100vh] max-h-[80vh] flex flex-col">
				<div id="searchBar" className="mb-4">
					<h3 className="mb-2">Zutat ersetzen</h3>
					<input
						type="text"
						className="border-gray-400 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						placeholder="Nach Zutaten suchen..."
						value={searchQuery}
						onChange={(e) => handleSearch(e.target.value)}
					/>
				</div>
				<div id="results" className="h-full max-h-[100%] overflow-y-scroll bg-grey-50 p-6">
					<div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
						{searchResults.length > 0 ? searchResults.map((item) => (
								<div
									onClick={()=>handleSelect(item)}
									key={item.id}
									className="relative flex flex-col items-center justify-center bg-white round  shadow-md hover:shadow-lg cursor-pointer">
									<div className="p-6 text-sm">
										{item.name}
									</div>
									{searchResults.includes(item.id) && (
										<div className="absolute bg-orange-500 top-0 left-0 w-full h-full bg-black bg-opacity-60 flex flex-col items-center justify-center">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 20 20" fill="currentColor">
												<path d="M6 11.586l-2.293-2.293a1 1 0 0 1 1.414-1.414l1.88 1.88 4.59-4.59a1 1 0 0 1 1.414 1.414L7.414 11.586a1 1 0 0 1-1.414 0z" />
											</svg>
										</div>
									)}
								</div>
							))
							:
							<p><strong>Keine Ergebnisse</strong></p>
						}
					</div>
				</div>
				<div className="flex justify-end mt-4">
					<button type="button" className="bg-grey-500 text-white font-bold py-2 px-4 rounded" onClick={()=>setShow(false)}>Schließen</button>
				</div>
			</div>
		</div>
	);
}


export default IngredientReplacer;
