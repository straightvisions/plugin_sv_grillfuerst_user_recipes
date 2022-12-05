import React, {useState} from "react";
import { Listbox } from '@headlessui/react'

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
	
	const [options, setOptions] = useState(items);
	const [selection, setSelection] = useState(selectedItems);
	
	const handleSelect = (id) => {
		const _selection = [...new Set([...selection, ...[id]])];
		setSelection(_selection);
	}
	
	const handleUnselect = (id) => {
		const _selection = selection.filter(i => i !== id);
		setSelection(_selection);
	}
	
	const handleInputChange = (value) => {
		value = String(value);
		let _options = [...items, []];
		
		if(value !== ''){
			_options = items.filter(i => i.label.includes(value));
		}
		
		setOptions(_options);
	}
	
	const getItem = (id) => {
		let item = null;
		
		for(let i=0; i < items.length; i++){
			if(id === items[i].value){
				item = items[i];
				break;
			}
		}
		
		return item;
	}

	return (
		<div>
			{label !== '' &&
				<label htmlFor="recipe_menu_type" className="block text-sm font-medium text-gray-700">{label}</label>
			}
			
			<Listbox value={selectedItems} onChange={onChange} multiple>
				<Listbox.Button>
					{selectedItems.map((id) => {return }).join(', ')}
				</Listbox.Button>
				<Listbox.Options>
					{items.map((i) => (
						<Listbox.Option
							key={i.value}
							value={i.value}
							
						>
							{i.label}
						</Listbox.Option>
					))}
				</Listbox.Options>
			</Listbox>
			
		</div>
	
	)
}