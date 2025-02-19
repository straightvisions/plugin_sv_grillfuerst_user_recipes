import React, {useEffect, useReducer, useState} from "react";
import Spinner from '../../spinner';
import TermSearch from "../combobox/term_search.js";
import Dropdown from "../dropdown";
import ProductFinder from "../product_finder";
import routes from "../../../models/routes";
import ingredientUnitValues from "../../../models/ingredient/units";
import ingredientModel from "../../../models/ingredient";
import headers from "../../../modules/headers";

export default function Ingredients(props) {
	const {
		formState,
		setFormState,
	} = props;
	
	const {
		servings,
		ingredients,
	} = formState;
	
	const [showProductFinder, setShowProductFinder] = useState(false);
	const [productSelected, setProductSelected] = useState(0);
	const [productParent, setProductParent] = useState({});
	const [products, setProducts] = useState([]);
	const [loading, setLoadingState] = useState(true);
	
	// database stuff
	const [ingredientsDB, setIngredientsDB] = useState([]); // data from db
	const cacheName = "ingredients-cache";

	// ingredients list from db for TermSearch
	useEffect( () => {
		// migrate ingredients
		const _ingredients = ingredients.map((item, i) => {
			item = { ...ingredientModel, ...item };
			item.order = ('order' in item && item.order !== 0) ? item.order : i + 1;
			return item;
		});
		setFormState({ingredients: sort(_ingredients)});
		// ingredients
		caches.open(cacheName).then((cache) => {
			cache.match(routes.getIngredients).then((response) => {
				if (response) {
					// If the response is in the cache, return it
					return response.json().then((data) => {
						setIngredientsDB(data.items);
						setLoadingState(false);
					});
				} else {
					// If the response is not in the cache, fetch it and add it to the cache
					return fetch(routes.getIngredients, {
						headers: headers.get(),
					})
						.then((response) => {
							cache.put(routes.getIngredients, response.clone());
							return response.json();
						})
						.then((data) => {
							setIngredientsDB(data.items);
							setLoadingState(false);
						});
				}
			});
		});
		
		// products
		caches.open(cacheName).then((cache) => {
			cache.match(routes.getIngredientsProducts).then((response) => {
				if (response) {
					// If the response is in the cache, return it
					return response.json().then((data) => {
						const filteredItems = data.items;
						setProducts(filteredItems);
						setLoadingState(false);
					});
				} else {
					// If the response is not in the cache, fetch it and add it to the cache
					return fetch(routes.getIngredientsProducts, {
						headers: headers.get(),
					})
						.then((response) => {
							cache.put(routes.getIngredientsProducts, response.clone());
							return response.json();
						})
						.then((data) => {
							const filteredItems = data.items;
							setProducts(filteredItems);
							setLoadingState(false);
						});
				}
			});
		});
	}, []);
	
	const isFalsy = (value) => {
		return typeof value === "undefined" || value === null || value === '' || value === 0 || value === '0';
	}
	
	const sort = (items) => {
		return items.sort((a, b) => a.order - b.order);
	}
	
	// needs custom function to apply data to the right array item
	const setIngredient = (item) => {
		const _ingredients = ingredients.map(ingredient => { return ingredient.id === item.id ? item : ingredient; });
	
		setFormState({ingredients: sort(_ingredients)});
	}
	
	const addIngredient = (item) =>{
		const ingredient = { ...ingredientModel, ...{id: item.id, label: item.name, order: ingredients.length + 1} };
		
		ingredients.push(ingredient);

		setFormState({ingredients: sort(ingredients)});
	}
	
	const addCustomIngredient = () =>{
		const ingredient = { ...ingredientModel, ...{id: 0, label: '', order: ingredients.length + 1, custom: true} };
		
		ingredients.push(ingredient);
		
		setFormState({ingredients: sort(ingredients)});
	}
	
	const removeIngredient = (index, item) => {
		// filter out the item from list
		ingredients.splice(index, 1);
		setFormState({ingredients: sort(ingredients)});
	}
	
	const handleFinderSelect = (product) => {
		// link product
		let item = productParent;

		item.products_id = item.products_id === product.products_id ? 0 : product.products_id;
		const _product = isFalsy(item.products_id) ? [] : [product];

		setProductParent(item);
		setProductSelected(_product);
		setIngredient(item);
	}
	
	const handleShowProductFinder = (item) => {
		setProductParent(item);
		const _product = {
			id: isFalsy(item.products_id) ? 0 : item.products_id
		};
		
		setProductSelected([_product]);
		setShowProductFinder(true);
	}
	
	const getThumb = (id) => {
		const item = products.find(item => item.products_id === id);
		let thumb = 'abc';
		
		if(isFalsy(item) === false && item.images.length > 0){
			thumb = item.images[0];
		}
		
		return thumb;
	}
	
	const getName = (id) => {
		const item = products.find(item => item.products_id === id);
		let name = 'unbekannt';
		
		if(isFalsy(item) === false && item.images.length > 0){
			name = item.name;
		}
		
		return name;
	}
	
	// -1
	const handleOrderUp = (index, item) => {
		// handle missing order property
		if(!item.order) item.order = index + 1;
		//---
		item.order = item.order > 1 ? item.order -1 : item.order;
		ingredients[index] = item;
		
		if(ingredients[index - 1]){
			if(!item.order) item.order = index + 1;
			ingredients[index - 1].order = ingredients[index - 1].order + 1;
		}
		
		setIngredient(sort(ingredients));
	}
	
	// +1
	const handleOrderDown = (index, item) => {
		item.order = item.order < ingredients.length ? item.order + 1 : item.order;
		ingredients[index] = item;
		
		if(ingredients[index + 1]){
			ingredients[index + 1].order = ingredients[index + 1].order - 1;
		}
		
		setIngredient(sort(ingredients));
	}
	
	const handleCommaInput = (e, ingredient, cleanUp = false) => {
		let value = e.target.value;
		const stringWithoutChars = value.replace(/[^,\d]/g, ''); // Remove all non-numeric characters except the commas
		const lastIndex = stringWithoutChars.lastIndexOf(',');
		value = stringWithoutChars.slice(0, lastIndex).replace(/,/g, '') + stringWithoutChars.slice(lastIndex);
		
		// if comma is at the end, check for decimals, if decimals parse as float
		if(value.includes(',')){
			value = value.replace(',','.');
			
			// trim empty decimals if not in focus anymore
			if(cleanUp){
				value = value.replace(/\.00$/, '').replace(/\.0$/, '').replace(/\.$/, '');
			}
			
			let _value = value.split('.');
			if(_value.length >= 2 && _value[1] !== ''){
				value = parseFloat(value).toFixed(2);
			}
		}else{
			// not a potential float, parse as int
			value = parseInt(value);
		}
		
		if(isNaN(value)){
			value = 0;
		}
		
		return value;
	}
	
	const handleInputAmount = (e, ingredient, cleanUp = false) => {
		const value = handleCommaInput(e, ingredient, cleanUp);
		setIngredient({ ...ingredient, amount: value });
	}
	
	const handleInputAmount4p = (e, ingredient, cleanUp = false) => {
		const value = handleCommaInput(e, ingredient, cleanUp);
		setIngredient({ ...ingredient, amount4p: value });
	}
	
	const getAmount4p = (ingredient) => {
		const amount = ingredient.amount;
		let amount4p = ingredient.amount4p ?? 0;
		
		if(ingredient.scalable && !amount4p){
			// calculate amount for 4 persons/servings
			const factor = 4 / servings;
			amount4p = amount * factor;
			//amount4p = roundUpToHalf(amount4p); // round to nearest 0.5
		}else{
			amount4p = amount;
		}
		
		return amount4p;
	}
	
	function roundUpToHalf(number) {
		const roundedNumber = Math.ceil(number);
		if (roundedNumber < 1.7) {
			return roundedNumber / 2;
		} else {
			return 2;
		}
	}
	
	// conditional rendering for TermSearch
	const TermSearchComp = loading ? <Spinner /> : <TermSearch label={"Neue Zutat hinzufügen"} items={ingredientsDB} onChange={addIngredient} />;
	return (
		<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 mt-5">
			{showProductFinder && <ProductFinder id="IngredientsProductFinder" description="Hier kannst du Grillfürst Shop-Produkte als Zutat verlinken." items={products} itemsSelected={productSelected} onSelect={handleFinderSelect} setShow={setShowProductFinder}/>}
			<div className="md:grid md:grid-cols-5 md:gap-6">
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
								<option value={i} key={i}>{i} { i > 1 ? "Portionen" : "Portion"}</option>
							))}
						</select>
					</div>
					{TermSearchComp}
					<div className="mt-2 text-[12px] text-gray-500 ">
						<p className="inline border-b border-dashed border-gray-500 hover:text-gray-700 hover:border-gray-700">
							Deine Zutat ist nicht dabei?:
						</p>
						<br/>
						<button
							onClick={()=>addCustomIngredient()}
							type="button"
							className="bg-white border border-grey-500 text-grey-500 px-2 py-1 mt-2 rounded hover:text-white hover:bg-orange-600"
						>
							Eigene Zutat hinzufügen
						</button>
					</div>
					
				
				</div>
				<div className="mt-5 md:col-span-4 md:mt-0 overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-300">
						<thead className="bg-gray-50">
						<tr>
							<th scope="col" className="">
							</th>
							<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
								Zutat
							</th>
							<th scope="col" className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
								Menge
							</th>
							<th scope="col" className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
								Menge 4P
							</th>
							<th scope="col" className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
								Scale?
							</th>
							<th scope="col" className="min-w-[140px] px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
								Einheit
							</th>
							<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
								Anmerkung
							</th>
							<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
								Produkt
							</th>
							<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
								<span className="sr-only">Löschen</span>
							</th>
						</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">
						{ingredients.map((ingredient, index) => (
							<tr key={ingredient.id + '-' + index} className={ingredient.custom ? 'bg-red-100' : ''}>
								<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
									<button
										onClick={()=>handleOrderUp(index, ingredient)}
										type="button"
										className="bg-white border border-grey-500 text-grey-500 px-2 py-1 rounded hover:text-white hover:bg-orange-600"
									>
										&#x25B2;
									</button>
									<button
										onClick={()=>handleOrderDown(index, ingredient)}
										type="button"
										className="bg-white border border-grey-500 text-grey-500 px-2 py-1 rounded hover:text-white hover:bg-orange-600"
									>
										&#x25BC;
									</button>
								</td>
								<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
									{ingredient.custom === false ?
										ingredient.label
									: <input
											placeholder="Zutat"
											type="text"
											className="min-w-max block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											value={ingredient.label}
											onChange={e => { ingredient.label = e.target.value; setIngredient(ingredient); }}
										/>
									}
								</td>
								<td className="w-1/5 whitespace-nowrap px-3 py-4 text-sm text-gray-500">
									<input
										value={ingredient.amount.toString().replace('.', ',')}
										onChange={(e) => handleInputAmount(e, ingredient)}
										onBlur={(e) => handleInputAmount(e, ingredient, true)}
										type="text"
										placeholder="1"
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								
								</td>
								<td className="w-1/5 whitespace-nowrap px-3 py-4 text-sm text-gray-500">
									<input
										value={ingredient.amount4p ? ingredient.amount4p.toString().replace('.', ',')  : getAmount4p(ingredient)}
										onChange={(e) => handleInputAmount4p(e, ingredient)}
										onBlur={(e) => handleInputAmount4p(e, ingredient, true)}
										type="text"
										placeholder="1"
										className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${ingredient.amount4p ? 'border-red-500' : ''}`}
									/>
								
								</td>
								<td className="w-1/9 whitespace-nowrap px-3 py-4 text-sm text-gray-500">
									<input
										value={ingredient.scalable}
										onChange={(event) => {
											ingredient.scalable = event.target.checked;
											setIngredient(ingredient);
										}}
										type="checkbox"
										placeholder="1"
										className="block cursor-pointer rounded-md mr-auto ml-auto border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										checked={ingredient.scalable}
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
										className="min-w-max block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										value={ingredient.note}
										onChange={e => { ingredient.note = e.target.value; setIngredient(ingredient); }}
									/>
								</td>
								<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
									{ isFalsy(ingredient.products_id) ?
										<button
											onClick={() => handleShowProductFinder(ingredient)}
											type="button"
											className="text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white focus:ring-0 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-80">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
											     strokeWidth="1.5" stroke="currentColor"
											     className="w-6 h-6 transform rotate-45">
												<path strokeLinecap="round" strokeLinejoin="round"
												      d="M6 18L18 6M6 6l12 12"></path>
											</svg>
											<span className="sr-only">Mit Shop Produtk verlinken</span>
										</button>
										:
										<button
											onClick={() => handleShowProductFinder(ingredient)}
											type="button"
											className="w-[46px] h-[46px] max-h-[46px] overflow-hidden text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white focus:ring-0 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-80">
												<img width="24" height="24" src={getThumb(ingredient.products_id)} alt={getName(ingredient.products_id)} title={getName(ingredient.products_id)}/>
											<span className="sr-only">Verlinken</span>
										</button>
									}
									
								</td>
								<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
									<button
										onClick={() => removeIngredient(index, ingredient)}
										type="button"
										className="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-0 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800">
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