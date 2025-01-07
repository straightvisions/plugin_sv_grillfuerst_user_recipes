import React, {useEffect, useState} from 'react';

const arrayToMap = (arr) => {
	return arr.reduce((result, current) => {
		if (Array.isArray(current.value)) {
			result[current.key] = arrayToMap(current.value);
		} else {
			result[current.key] = current.value;
		}
		return result;
	}, {});
}

export default function SearchBar(props) {
	const {
		filter = [],
		id = 'searchBar',
		onChange= ()=>{}
	} = props

	const [values, setValues] = useState(arrayToMap(filter));

	const handleChange = (attr) => {
		let _filter = [];
		
		// set params level array
		_filter = filter.map((item, index) => {
			if(item.key === attr[0]){
				item.value = attr[1];
			}
			return item;
		});
		
		setValues(arrayToMap(_filter));
		onChange(_filter);
	}
	
	const handleFilterChange = (attr) => {
		// set filter in sub array
		let fi = filter.findIndex(obj => obj.key === 'filter');
		let check = false;
		filter[fi].value = filter[fi].value.map((item, index) => {
			if(item.key === attr[0]){
				item.value = attr[1];
				check = true;
			}
			return item;
		});
		
		if(check === false){
			filter[fi].value.push({key:attr[0], value:attr[1]});
		}
		setValues(arrayToMap(filter));
		onChange([...filter, ...[]]);
	}
	
	return (
		<div id={id} className="flex flex-row items-center items-stretch mb-2 gap-2">
			<input
				type="text"
				placeholder="Suchte nach Titel oder UUID"
				className="w-64 p-2 border shadow rounded border-gray-200 text-sm"
				defaultValue={values.filter.query}
				onKeyDown={(e)=>{
					const value = e.target.value;
					if(e.key === 'Enter'){
						handleFilterChange(['query', value])
					}
				}}
			/>
			{values.order.toLowerCase() === 'edited desc' ?
				<button className="px-2 py-1 bg-white border rounded text-sm border-gray-200" onClick={() => handleChange(['order', 'edited ASC'])}>Nach Datum
					&#x25BC;</button>
				:
				<button className="px-2 py-1 bg-white border rounded text-sm border-gray-200" onClick={() => handleChange(['order', 'edited DESC'])}>Nach Datum
					&#x25B2;</button>
			}
			<select className="text-sm cursor-pointer rounded border border-gray-200" value={values.filter.state} onChange={(e) => handleFilterChange(['state', e.target.value])}>
				<option value="review_pending">Eingereicht</option>
				<option value="reviewed">Feedback gegeben</option>
				<option value="published">Veröffentlicht</option>
				<option value="all">Alle</option>
			</select>
			
		</div>
	);
}