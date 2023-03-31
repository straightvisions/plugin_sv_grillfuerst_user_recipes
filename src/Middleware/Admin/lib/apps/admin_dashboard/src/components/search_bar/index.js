import React, {useEffect, useState} from 'react';

const arrayToMap = (arr) => {
	console.log(arr);
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
	console.log(values);
	const handleChange = (attr) => {
		let _filter = [];
		
		// set params level array
		_filter = filter.map((item, index) => {
			if(item.key === attr[0]){
				item.value = attr[1];
			}
			return item;
		});
	
		onChange(_filter);
	}
	
	const handleFilterChange = (attr) => {
		// set filter in sub array
		let fi = filter.findIndex(obj => obj.key === 'filter');
		let check = false;
		filter[fi].value = filter[fi].value.map((item, index) => {
			if(item.field === attr[0]){
				item.value = attr[1];
				check = true;
			}
			return item;
		});
		
		if(check === false){
			filter[fi].value.push({key:attr[0], value:attr[1]});
		}
		
		onChange([...filter, ...[]]);
	}
	
	
	return (
		<div id={id} className="flex flex-col items-center">
			<input
				type="text"
				placeholder="Search by title or UUID"
				className="w-64 p-2 border"
				defaultValue={values.filter.query}
				onKeyDown={(e)=>{
					const value = e.target.value;
					if(e.key === 'Enter' && value.length > 3){
						handleFilterChange(['query',value])
					}
				}}
			/>
			<div className="mt-2 flex space-x-2">
				<button className="px-2 py-1 border" onClick={() => handleChange(['order','edited ASC'])}>Sort by date (ASC)</button>
				<button className="px-2 py-1 border" onClick={() => handleChange(['order','edited DESC'])}>Sort by date (DESC)</button>
			</div>
			<div className="mt-2 flex space-x-2">
				<button className="px-2 py-1 border" onClick={() => handleFilterChange(['state','published'])}>Published</button>
				<button className="px-2 py-1 border" onClick={() => handleFilterChange(['state','review_pending'])}>Review Pending</button>
				<button className="px-2 py-1 border" onClick={() => handleFilterChange(['state','reviewed'])}>Reviewed</button>
			</div>
		
		</div>
	);
}