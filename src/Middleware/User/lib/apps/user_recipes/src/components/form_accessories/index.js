import React, {useContext, useEffect, useState} from "react";
import Spinner from '../spinner';
import {IconTrash} from '../icons';
import routes from "../../models/routes";
import accessoryModel from "../../models/accessory";
import storage from "../../modules/storage";
import ProductFinder from "../product_finder";
import {GlobalContext} from "../../modules/context";

export default function Accessories(props) {
	const {
		setFormState,
		formState
	} = props;
	
	const {
		accessories = []
	} = formState;
	
	const [loading, setLoadingState] = useState(true);
	const [accessoriesDB, setAccessoriesDB] = useState([]); // data from db
	const [showProductFinder, setShowProductFinder] = useState(false);
	const { globalModalConfirm, setGlobalModalConfirm } = useContext(GlobalContext);
	const cacheName = "accessories-cache";

	useEffect( () => {
		caches.open(cacheName).then((cache) => {
			cache.match(routes.getAccessories).then((response) => {
				if (response && accessoriesDB.length > 0) {
					// If the response is in the cache, return it
					return response.json().then((data) => {
						const filteredItems = filterAccessories(data.items);
						setAccessoriesDB(filteredItems);
						setLoadingState(false);
					});
				} else {
					// If the response is not in the cache, fetch it and add it to the cache
					return fetch(routes.getAccessories, {
						headers: {
							Authorization: "Bearer " + storage.get("token"),
						},
					})
						.then((response) => {
							cache.put(routes.getAccessories, response.clone());
							return response.json();
						})
						.then((data) => {
							const filteredItems = filterAccessories(data.items);
							setAccessoriesDB(filteredItems);
						}).finally(() => {
							setLoadingState(false);
						});
				}
			});
		});
		
		function filterAccessories(items) {
			// remove "ersatzteile"
			return items.filter((item) => {
				let check = true;
				// word in name
				if (item.name.toLowerCase().indexOf("ersatz") !== -1) {
					check = false;
				}
				// word in thumb url
				if (check && item.images.length > 0) {
					for (let i = 0; i < item.images.length; i++) {
						if (item.images[i].toLowerCase().indexOf("ersatz") !== -1) {
							check = false;
						}
					}
				}
				return check;
			});
		}
	}, []);
	
	const setAccessory = (item) => {
		const newAccessories =
			accessories.map(accessory => { return accessory.id === item.id ? item : accessory; });
		
		setFormState({accessories: newAccessories});
	}
	
	const addAccessory = (item) =>{
		const accessory = { ...accessoryModel, id: item.id, label: item.name };
		
		accessories.push(accessory);
		setFormState({accessories: accessories});
	}
	
	const removeAccessory = (item) => {
		// filter out the item from list
		const newAccessories = accessories.filter(accessory => accessory.id !== item.id);
		setFormState({accessories: newAccessories});
	}
	
	const handleFinderSelect = (item) => {
		const selectedIds = accessories.map(accessory => accessory.id);
		if(selectedIds.includes(item.id)){
			removeAccessory(item);
		}else{
			addAccessory(item);
		}
	}
	
	return (
		<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
			{showProductFinder === true && <ProductFinder id="AccessoriesFinder" items={accessoriesDB} itemsSelected={accessories} onSelect={handleFinderSelect} setShow={setShowProductFinder}/>}
			<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
				<div className="col-span-1">
					<h3 className="text-lg font-bold leading-6 text-gray-900">Zubehör</h3>
					<p className="mt-1 text-gray-500">Hier kannst du passende Zubehörprodukte aus unserem Shop angeben, die du für die Zubereitung des Rezepts empfiehlst.</p>
					<div className="col-span-6 sm:col-span-4 my-4">
						{loading ?
						<Spinner /> :
							<button
								onClick={()=>setShowProductFinder(true)}
								type="button"
								className="btn"
							>
								Zubehör hinzufügen
							</button>
						}
					</div>
				</div>
				<div className="mt-5 col-span-1 xl:col-span-3 md:mt-0 overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-300">
						<thead className="bg-gray-50">
						<tr>
							<th scope="col" className="py-3.5 pl-4 pr-3 text-left font-semibold text-gray-900 sm:pl-6">
								Zubehör
							</th>
							<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
								<span className="sr-only">Löschen</span>
							</th>
						</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">
						{accessories.length > 0 && accessories.map(accessory => (
							<tr key={accessory.id}>
								<td className="md:whitespace-nowrap py-4 pl-4 pr-3 font-bold text-gray-900 sm:pl-6">
									{accessory.label}
								</td>
								<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right font-bold sm:pr-6">
									<button
										onClick={() => setGlobalModalConfirm({
											message: 'Möchtest du dieses Zubehör wirklich löschen?',
											onConfirm: () => removeAccessory(accessory)
										})}
										type="button"
										className="opacity-20 hover:opacity-100 text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-bold rounded-full p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800">
										<IconTrash width="24" height="24"/>
										<span className="sr-only">{accessory.label} Entfernen</span>
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