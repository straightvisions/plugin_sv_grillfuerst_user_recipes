import React, { useState } from "react";

export default function ProductFinder(props) {
	const {
		id = 'productFinder',
		items,
		itemsSelected = [],
		setShow = ()=>{},
		onSelect = ()=>{}
	} = props;

	const localStorageSearchQueryKey = id + 'SearchQuery';
	const selectedIds = itemsSelected.map(item => item.id);
	const [searchQuery, setSearchQuery] = useState(
		localStorage.getItem(localStorageSearchQueryKey).split(',') || []
	);
	const [numToShow, setNumToShow] = useState(20);
	let filteredItems = [];
	
	const isNumeric = (str) => {
		return /^\d+$/.test(str);
	}
	
	if (searchQuery.length > 0 && searchQuery[0].length >= 3) {
		filteredItems = items.filter((item) => {
			const field = isNumeric(searchQuery[0]) ? item.ean.trim() : item.name.toLowerCase().trim();
			return field.includes(searchQuery[0].toLowerCase().trim());
		});
		
		for (let i = 1; i < searchQuery.length; i++) {
			filteredItems = filteredItems.filter((item) => {
				return item.name.toLowerCase().trim().includes(searchQuery[i].toLowerCase().trim());
			});
		}
		
		filteredItems = filteredItems.slice(0, numToShow);
	}
	
	const handleSearchChange = (event) => {
		const query = event.target.value;
		setSearchQuery(query.split(','));
		localStorage.setItem(localStorageSearchQueryKey, query);
		setNumToShow(20); // reset number of results shown when query changes
	};
	
	const handleShowMore = () => {
		setNumToShow(numToShow + 20);
	};
	
	const handleSelect = (item) => {
		onSelect(item);
	}
	
	return (
		<div id="wrapper" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div id="innerWrapper" className="bg-white rounded-lg p-6 w-full w-3/4 h-[100vh] max-h-[80vh] flex flex-col">
				<div id="searchBar" className="mb-4">
					<h3>Produktfinder</h3>
					<input
						type="text"
						className="border-gray-400 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						placeholder="Nach Produkte suchen..."
						value={searchQuery}
						onChange={handleSearchChange}
					/>
				</div>
				<div id="results" className="h-full max-h-[100%] overflow-y-scroll bg-grey-50 p-6">
					<div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
						{filteredItems.length > 0 ? filteredItems.map((item) => (
								<div
									onClick={()=>handleSelect(item)}
									key={item.id}
									className="relative  flex flex-col items-center justify-center bg-white round  shadow-md hover:shadow-lg cursor-pointer">
									<img src={item.images[0]} alt={item.name} className="w-auto h-1/2 max-h-[200px]" />
									<div className="p-6 text-sm">
										{item.name}
									</div>
									{selectedIds.includes(item.id) && (
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
					{filteredItems.length !== 0 && filteredItems.length < items.length &&
						<div className="flex justify-center mt-4">
							<button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleShowMore}>Mehr anzeigen</button>
						</div>
					}
				</div>
				<div className="flex justify-end mt-4">
					<button type="button" className="bg-greyDark text-white font-bold py-2 px-4 rounded" onClick={()=>setShow(false)}>Schließen</button>
				</div>
			</div>
		</div>
	);
}
