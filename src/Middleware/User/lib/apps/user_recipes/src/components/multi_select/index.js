import React, {Fragment, useState} from "react";
import {Listbox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function MultiSelect(props) {
	const {
		label = '',
		items = [],
		selectedItems = [],
		onChange = () => {
		},
	} = props;
	
	const [selection, setSelection] = useState(selectedItems);

	const handleInputChange = (items) => {
		const _selection = items.map(i => i.value);
		onChange(_selection);
		return setSelection(items);
	}
	
	const selectedItemsString = () =>{
		const _string = selection.map((i) => {
			return i.label.replace(/&amp;/g, '&')
		}).join(', ');
		
		return _string !== '' ? _string : 'Bitte auswählen';
	} ;
	
	
	const isSelected = (id) => {
		return selection.includes(id)
	};
	
	return (
		<div>
			{label !== '' &&
				<label htmlFor="recipe_menu_type" className="block text-sm font-medium text-gray-700">{label}</label>
			}
			<div className="relative">
				<Listbox
					value={selection}
					onChange={(id) => handleInputChange(id)}
					multiple
				>
					<Listbox.Button
						className="relative mt-2 w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
					>
						<span className="block truncate">{selectedItemsString()}</span>
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                        </span>
					</Listbox.Button>
					
					<Listbox.Options
						static
						className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
						>
						{items.map((i) => (
							<Listbox.Option
								key={i.value}
								value={i}
								className={({active}) =>
									classNames(
										active ? 'text-white bg-indigo-600' : 'text-gray-900',
										'relative cursor-default select-none py-2 pl-3 pr-9 cursor-pointer'
									)
								}
							>
								{({active}) => (
									<>
				                        <span className={classNames(isSelected(i.value) ? 'font-semibold' : 'font-normal', 'block truncate')}>
				                          {i.label.replace(/&amp;/g, '&')}
				                        </span>
										{isSelected(i.value) ? (
											<span
												className={classNames(
													active ? 'text-white' : 'text-indigo-600',
													'absolute inset-y-0 right-0 flex items-center pr-4'
												)}
											>
												<CheckIcon className="h-5 w-5" aria-hidden="true"/>
											</span>
										) : null}
									</>
								)}
		
							</Listbox.Option>
						))}
					</Listbox.Options>
				
				</Listbox>
			</div>
		</div>
	)
}