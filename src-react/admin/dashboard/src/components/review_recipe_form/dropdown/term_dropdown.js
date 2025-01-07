import React, {useState} from "react";

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function TermDropdown(props) {
	const {
		label = '',
		value = '',
		onChange = () => {
		},
		items = []
	} = props;
	
	const [options, setOptions] = useState(items);
	
	return (
		<div>
			{label !== '' &&
				<label htmlFor="recipe_menu_type" className="block text-sm font-medium text-gray-700">{label}</label>
			}
			<div className="mt-1 flex rounded-md shadow-sm">
				<select
					className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					onChange={e => onChange(parseInt(e.target.value))}
					value={String(value)}
				>
					{ options.map((i) => {
						return <option key={i.id} value={i.id}>{i.name}</option>;
					}) }
				</select>
			</div>
		</div>
	
	)
}