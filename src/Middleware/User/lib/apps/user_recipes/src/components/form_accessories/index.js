import React, { useEffect, useState } from "react";
import Spinner from '../spinner';
import routes from "../../models/routes";
import accessoryModel from "../../models/accessory";
import storage from "../../modules/storage";
import ProductFinder from "../product_finder";

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
	const [showProductFinder, setShowProductFinder] = useState(false); // data from db

	useEffect( () => {
		fetch(routes.getAccessories,{
			headers: {
				'Authorization': 'Bearer ' + storage.get('token'),
			},
		}).then(response => response.json())
		.then(data => {
			setAccessoriesDB(data.items);
			setLoadingState(false);
		});
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
			{showProductFinder === true && <ProductFinder id="AccessoriesFinder" accessories={accessoriesDB} accessoriesSelected={accessories} onSelect={handleFinderSelect} setShow={setShowProductFinder}/>}
			<div className="md:grid md:grid-cols-4 md:gap-6">
				<div className="md:col-span-1">
					<h3 className="text-lg font-medium leading-6 text-gray-900">Zubehör</h3>
					<p className="mt-1 text-sm text-gray-500">Gib alles Zubehör ein, das für das Rezept benötigt oder von dir empfohlen werden.</p>
					<div className="col-span-6 sm:col-span-4 my-4">
						<button
							onClick={()=>setShowProductFinder(true)}
							type="button"
							className="relative inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-orange-600 hover:border-orange-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Zubehör hinzufügen
						</button>
					</div>
				</div>
				<div className="mt-5 md:col-span-3 md:mt-0 overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-300">
						<thead className="bg-gray-50">
						<tr>
							<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
								Zubehör
							</th>
							<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
								Menge
							</th>
							<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
								<span className="sr-only">Löschen</span>
							</th>
						</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">
						{accessories.length > 0 && accessories.map(accessory => (
							<tr key={accessory.id}>
								<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
									{accessory.label}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
									<input
										value={accessory.amount}
										onChange={e => { accessory.amount = e.target.value; setAccessory(accessory); }}
										type="number"
										placeholder="1"
										min="1"
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</td>
								<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
									<button
										onClick={() => removeAccessory(accessory)}
										type="button"
										className="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
										     strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
											<path strokeLinecap="round" strokeLinejoin="round"
											      d="M6 18L18 6M6 6l12 12"/>
										</svg>
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