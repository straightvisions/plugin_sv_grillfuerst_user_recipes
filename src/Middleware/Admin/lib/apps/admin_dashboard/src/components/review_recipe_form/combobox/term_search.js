import React, { useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function TermSearch(props) {
	const{
		label = '',
		onChange = () => {},
		items = []
	} = props;

	const [filteredItems, setFilteredItems] = useState([]);
	
	const searchItems = (term) => {
		if(term.length > 1){
			
			const results = items.filter((item) => {
				return (
					item.name.toLowerCase().includes(term.toLowerCase())
				);
			});
			
			setFilteredItems(results);
		}else{
			setFilteredItems([]);
		}
		
	}
	
	const handleClick = (item) => {
		onChange(item);
		setFilteredItems([]);
	}
	// @todo convert this to a common combobox with label-value pairs and move the term context up to parent component
	// reduce the given options there
	return (
		<Combobox as="div">
			<Combobox.Label className="block text-sm font-medium text-gray-700">{label}</Combobox.Label>
			<div className="relative mt-1">
				<Combobox.Input
					className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
					onChange={(e) => searchItems(e.target.value)}
				/>
				<Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
					<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
				</Combobox.Button>
				
				{filteredItems.length > 0 && (
					<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{filteredItems.map((item) => (
							<Combobox.Option
								key={item.id}
								value={item.name}
								className={({ active }) =>
									classNames(
										'relative cursor-default select-none py-2 pl-3 pr-9',
										active ? 'bg-indigo-600 text-white' : 'text-gray-900'
									)
								}
								onClick={() => handleClick(item)}
							>
								{({ active, selected }) => (
									<>
										<span className={classNames('block truncate', selected && 'font-semibold')}>{item.name}</span>
										
										{selected && (
											<span
												className={classNames(
													'absolute inset-y-0 right-0 flex items-center pr-4',
													active ? 'text-white' : 'text-indigo-600'
												)}
											>
					                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
					                      </span>
										)}
									</>
								)}
							</Combobox.Option>
						))}
					</Combobox.Options>
				)}
			</div>
		</Combobox>
	)
}