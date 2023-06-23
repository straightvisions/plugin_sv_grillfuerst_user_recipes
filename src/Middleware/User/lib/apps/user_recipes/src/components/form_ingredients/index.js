import React, {useEffect, useReducer, useState, useContext} from 'react';
import Spinner from '../spinner';
import TermSearch from '../combobox/term_search.js';
import Dropdown from '../dropdown';
import ProductFinder from '../product_finder';
import routes from '../../models/routes';
import ingredientUnitValues from '../../models/ingredient/units';
import ingredientModel from '../../models/ingredient';
import storage from '../../modules/storage';
import {IconTrash} from '../icons';
import {GlobalContext} from "../../modules/context";

export default function Ingredients(props) {
	const {
		formState,
		setFormState,
	} = props;
	
	const {
		servings,
		ingredients = [],
	} = formState;
	
	const [showProductFinder, setShowProductFinder] = useState(false);
	const [productSelected, setProductSelected] = useState(0);
	const [productParent, setProductParent] = useState({});
	const [products, setProducts] = useState([]);
	const [loading, setLoadingState] = useState(true);
	const [showCustomIngredientButton, setShowCustomIngredientButton] = useState(false);
	const { globalModalConfirm, setGlobalModalConfirm } = useContext(GlobalContext);
	
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
				if (response && ingredientsDB.length > 0) {
					// If the response is in the cache, return it
					return response.json().then((data) => {
						setIngredientsDB(data.items);
						setLoadingState(false);
					});
				} else {
					// If the response is not in the cache, fetch it and add it to the cache
					return fetch(routes.getIngredients, {
						headers: {
							Authorization: "Bearer " + storage.get("token"),
						},
					})
						.then((response) => {
							cache.put(routes.getIngredients, response.clone());
							return response.json();
						})
						.then((data) => {
							setIngredientsDB(data.items);
						}).finally(() => {
							setLoadingState(false);
						});
				}
			});
		});
		
		// products
		caches.open(cacheName).then((cache) => {
			cache.match(routes.getIngredientsProducts).then((response) => {
				if (response && products.length > 0) {
					// If the response is in the cache, return it
					return response.json().then((data) => {
						const filteredItems = data.items;
						setProducts(filteredItems);
						setLoadingState(false);
					});
				} else {
					// If the response is not in the cache, fetch it and add it to the cache
					return fetch(routes.getIngredientsProducts, {
						headers: {
							Authorization: "Bearer " + storage.get("token"),
						},
					})
						.then((response) => {
							cache.put(routes.getIngredientsProducts, response.clone());
							return response.json();
						})
						.then((data) => {
							const filteredItems = data.items;
							setProducts(filteredItems);
						}).finally(() => {
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
		const _ingredients =
			ingredients.map(ingredient => { return ingredient.id === item.id ? item : ingredient; });
	
		setFormState({ingredients: sort(_ingredients)});
	}
	
	const addIngredient = (item) =>{
		const ingredient = { ...ingredientModel, ...{id: item.id, label: item.name, order: ingredients.length + 1} };
		
		ingredients.push(ingredient);

		setFormState({ingredients: sort(ingredients)});
	}
	
	const getRandomId = () => {
		const min = 10000000;
		const max = 99999999;
		let customNumber;
		
		do {
			customNumber = Math.floor(Math.random() * (max - min + 1)) + min;
		} while (ingredients.find((ingredient) => ingredient.id === customNumber));
		
		return customNumber;
	}
	
	const addCustomIngredient = () =>{
		
		const ingredient = { ...ingredientModel, ...{id: getRandomId(), label: '', order: ingredients.length + 1, custom: true} };
		
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
		
		setIngredient({ ...ingredient, amount: value });
	}
	
	const listItems = ingredients.map((ingredient, index) => {
		return {
			columns: [
				<>
					<button
						onClick={()=>handleOrderUp(index, ingredient)}
						type="button"
						className="bg-white border border-grey-500 text-grey-500 px-2 py-1 rounded hover:text-white hover:bg-orange-500 hover:border-orange-500"
					>
						&#x25B2;
					</button>
					<button
						onClick={()=>handleOrderDown(index, ingredient)}
						type="button"
						className="bg-white border border-grey-500 text-grey-500 px-2 py-1 rounded hover:text-white hover:bg-orange-500 hover:border-orange-500"
					>
						&#x25BC;
					</button>
				</>,
				<>{ingredient.custom === false ?
					ingredient.label
					: <input
						placeholder="Zutat"
						type="text"
						className="min-w-max block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
						value={ingredient.label}
						onChange={e => { ingredient.label = e.target.value; setIngredient(ingredient); }}
					/>
				}</>
				,
				<input
					value={ingredient.amount.toString().replace('.', ',')}
					onChange={(e) => handleCommaInput(e, ingredient)}
					onBlur={(e) => handleCommaInput(e, ingredient, true)}
					type="text"
					placeholder="1"
					className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
				/>,
				<Dropdown value={ingredient.unit} items={ingredientUnitValues}
				          onChange={val => { ingredient.unit = val; setIngredient(ingredient);}}
				          defaultValue={"g"}
				/>,
				<input
					type="text"
					className="min-w-max block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
					value={ingredient.note}
					onChange={e => { ingredient.note = e.target.value; setIngredient(ingredient); }}
				/>,
				<>
					{ isFalsy(ingredient.products_id) ?
						<button
							onClick={() => handleShowProductFinder(ingredient)}
							type="button"
							className="text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white focus:ring-0 focus:outline-none focus:ring-red-300 font-bold rounded-full p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-80">
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
							className="w-[46px] h-[46px] max-h-[46px] overflow-hidden text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white focus:ring-0 focus:outline-none focus:ring-red-300 font-bold rounded-full p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-80">
							<img width="24" height="24" src={getThumb(ingredient.products_id)} alt={getName(ingredient.products_id)} title={getName(ingredient.products_id)}/>
							<span className="sr-only">Verlinken</span>
						</button>
					}
					</>,
				<button
					onClick={() => removeIngredient(index, ingredient)}
					type="button"
					className="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-0 focus:outline-none focus:ring-red-300 font-bold rounded-full p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
					     strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round"
						      d="M6 18L18 6M6 6l12 12"/>
					</svg>
					<span className="sr-only">{ingredient.label} Entfernen</span>
				</button>
			]
		};
	});
	
	// conditional rendering for TermSearch
	const TermSearchComp = loading ? <Spinner /> : <TermSearch label="Zutat hinzufügen" placeholder="hier tippen" items={ingredientsDB} onChange={addIngredient} />;
	return (
		<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
			{showProductFinder && <ProductFinder id="IngredientsProductFinder" description="Hier kannst du Grillfürst Shop-Produkte als Zutat verlinken." items={products} itemsSelected={productSelected} onSelect={handleFinderSelect} setShow={setShowProductFinder}/>}
			<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
				<div className="col-span-1 relative">
					<div className="sticky top-4">
						<h3 className="text-lg font-bold leading-6 text-gray-900">Zutaten</h3>
						<p className="mt-1 text-gray-500">Gib alle Zutaten ein, die für das Rezept benötigt werden. Wir empfehlen das Rezept für 4 Personen anzulegen und entsprechend die Zutatenmengen anzupassen. Du kannst hier auch die passenden Gewürze, Marinaden oder Rubs direkt aus unserem Shop wählen.</p>
						<div className="my-4">
							{TermSearchComp}
						</div>
						
						<div className="my-4">
							<label htmlFor="recipe_servings" className="mr-4 font-bold text-gray-700">
								Rezept für
							</label>
							<select
								value={servings}
								onChange={e => setFormState({"servings": parseInt(e.target.value)})}
								className="w-52 max-w-full whitespace-nowrap mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 "
							>
								{[1,2,4,6,8,10,12,14,16,18,20].map(i => (
									<option value={i} key={i}>{i} { i > 1 ? "Portionen" : "Portion"}</option>
								))}
							</select>
						</div>
						
						<div className="text-[12px] text-gray-500 mt-2">
							<p onClick={()=>setShowCustomIngredientButton(!showCustomIngredientButton)} className="select-none inline cursor-pointer border-b border-dashed border-gray-500 hover:text-gray-700 hover:border-gray-700">
								Deine Zutat ist nicht im Katalog? Hier hinzufügen!
							</p>
							{showCustomIngredientButton &&
								<button
									onClick={()=>addCustomIngredient()}
									type="button"
									className="bg-white border border-grey-500 text-grey-500 px-2 py-1 mt-2 rounded hover:text-white hover:bg-orange-600"
								>
									Eigene Zutat hinzufügen
								</button>
							}
						</div>
					</div>
				</div>
				<div className="flex col-span-1 xl:col-span-3 mt-5 md:mt-0 overflow-x-auto">
					<div className="flex flex-col rounded shadow w-full">
						{ /* header ---------------------------------------------------- */ }
						<div className="flex flex-auto bg-gray-50 pt-4 pb-4 grow-0">
							<span className="w-full lg:w-1/12 px-2 whitespace-nowrap overflow-hidden font-semibold hidden md:block"></span>
							<span className="w-full lg:w-[200px] px-2 whitespace-nowrap overflow-hidden font-semibold hidden md:block">Zutat</span>
							<span className="w-full lg:w-[85px] px-2 whitespace-nowrap overflow-hidden font-semibold hidden md:block">Menge</span>
							<span className="w-full lg:w-2/12 px-2 whitespace-nowrap overflow-hidden font-semibold hidden md:block">Einheit</span>
							<span className="w-full lg:w-3/12 px-2 whitespace-nowrap overflow-hidden font-semibold hidden md:block">Anmerkung</span>
							<span className="w-full lg:w-1/12 px-2 whitespace-nowrap overflow-hidden font-semibold hidden md:block text-center">Produkt</span>
							<span className="w-full lg:w-1/12 px-2 whitespace-nowrap overflow-hidden font-semibold hidden md:block text-center"></span>
						</div>
						
						{ /* body ---------------------------------------------------- */ }
						<div className="flex flex-col min-h-[300px] lg:h-auto flex-auto pt-4 pb-4 gap-4 overflow-hidden">
							{ingredients.length > 0 ? ingredients.map((ingredient, index) => {
								const classnames = [
									'w-full lg:w-1/12 whitespace-nowrap overflow-hidden px-2 py-2',
									'w-full lg:w-[200px] whitespace-nowrap overflow-hidden px-2 py-2 font-semibold',
									'w-1/2 lg:w-[85px] whitespace-nowrap overflow-hidden px-2 py-2',
									'w-1/2 lg:w-2/12 whitespace-nowrap overflow-hidden px-2 py-2',
									'w-full lg:w-3/12 whitespace-nowrap overflow-hidden px-2 py-2',
									'w-1/2 lg:w-1/12 whitespace-nowrap overflow-hidden px-2 py-2 flex justify-center',
									'w-1/2 lg:w-1/12 whitespace-nowrap overflow-hidden px-2 py-2 flex justify-center',
								];
								
								const wrapperClassnames = parseInt(index) % 2 === 1 ? 'flex flex-wrap items-center overflow-hidden py-4 bg-grey-50' : 'flex flex-wrap items-center overflow-hidden';
						
								return (
								<div key={ingredient.id + '-' + index} className={wrapperClassnames}>
									<div className={classnames[0]}>
										<button
											onClick={()=>handleOrderUp(index, ingredient)}
											type="button"
											className="w-[50%] lg:w-auto bg-white border border-grey-500 text-grey-500 px-2 py-1 rounded hover:text-white hover:bg-orange-500 hover:border-orange-500"
										>
											&#x25B2;
										</button>
										<button
											onClick={()=>handleOrderDown(index, ingredient)}
											type="button"
											className="w-[50%] lg:w-auto bg-white border border-grey-500 text-grey-500 px-2 py-1 rounded hover:text-white hover:bg-orange-500 hover:border-orange-500"
										>
											&#x25BC;
										</button>
									</div>
									<div className={classnames[1]}>
										{ingredient.custom === false ?
											ingredient.label
											: <input
												placeholder="Zutat"
												type="text"
												className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
												value={ingredient.label}
												onChange={e => { ingredient.label = e.target.value; setIngredient(ingredient); }}
											/>
										}
									</div>
									<div className={classnames[2]}>
										<span className="lg:hidden">Menge</span>
										<input
											value={ingredient.amount.toString().replace('.', ',')}
											onChange={(e) => handleCommaInput(e, ingredient)}
											onBlur={(e) => handleCommaInput(e, ingredient, true)}
											type="text"
											placeholder="1"
											className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
										/>
									
									</div>
									<div className={classnames[3]}>
										<span className="lg:hidden">Einheit</span>
										<Dropdown value={ingredient.unit} items={ingredientUnitValues}
										          onChange={val => { ingredient.unit = val; setIngredient(ingredient);}}
										          defaultValue={"g"}
										/>
									</div>
									<div className={classnames[4]}>
										<span className="lg:hidden">Anmerkung</span>
										<input
											type="text"
											className="min-w-max block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
											value={ingredient.note}
											onChange={e => { ingredient.note = e.target.value; setIngredient(ingredient); }}
										/>
									</div>
									<div className={classnames[5]}>
										{ isFalsy(ingredient.products_id) ?
											<button
												onClick={() => handleShowProductFinder(ingredient)}
												type="button"
												className="text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white focus:ring-0 focus:outline-none focus:ring-red-300 font-bold rounded-full p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-80">
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
												className="w-[46px] h-[46px] max-h-[46px] overflow-hidden text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white focus:ring-0 focus:outline-none focus:ring-red-300 font-bold rounded-full p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-80">
												<img width="24" height="24" src={getThumb(ingredient.products_id)} alt={getName(ingredient.products_id)} title={getName(ingredient.products_id)}/>
												<span className="sr-only">Verlinken</span>
											</button>
										}
									
									</div>
									<div className={classnames[6]}>
										<button
											onClick={() => setGlobalModalConfirm({
												message: 'Möchtest du die Zutat wirklich löschen?',
												onConfirm: () => removeIngredient(index, ingredient)
											})}
											type="button"
											className="opacity-20 hover:opacity-100 text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-0 focus:outline-none focus:ring-red-300 font-bold rounded-full p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800"
										>
											<IconTrash width="24" height="24" />
											<span className="sr-only">{ingredient.label} Entfernen</span>
										</button>
									</div>
								</div>
							)}) : <></>}
						</div>
						{ /* footer ---------------------------------------------------- */ }
					</div>
				</div>
			</div>
		</div>
	)
}