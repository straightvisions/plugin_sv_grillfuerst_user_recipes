import React, { useEffect, useState } from 'react';

const arrayToMap = (arr) => {
	return arr.reduce((result, current) => {
		if (Array.isArray(current.value)) {
			result[current.key] = arrayToMap(current.value);
		} else {
			result[current.key] = current.value;
		}
		return result;
	}, {});
};

export default function SearchBar(props) {
	const {
		filter = [],
		id = 'searchBar',
		onChange = () => {},
	} = props;
	
	const [values, setValues] = useState(arrayToMap(filter));
	
	const handleChange = (attr) => {
		const _filter = filter.map((item) => {
			if (item.key === attr[0]) {
				item.value = attr[1];
			}
			return item;
		});
		
		setValues(arrayToMap(_filter));
		onChange(_filter);
	};
	
	const handleFilterChange = (attr) => {
		const fi = filter.findIndex((obj) => obj.key === 'filter');
		if (fi !== -1) {
			let check = false;
			filter[fi].value = filter[fi].value.map((item) => {
				if (item.key === attr[0]) {
					item.value = attr[1];
					check = true;
				}
				return item;
			});
			
			if (!check) {
				filter[fi].value.push({ key: attr[0], value: attr[1] });
			}
		}
		setValues(arrayToMap(filter));
		onChange([...filter]);
	};
	
	return (
		<div id={id} className="flex flex-row items-center items-stretch mb-2 gap-2">
			{/* Search by title or UUID */}
			<input
				type="text"
				placeholder="Search by title or UUID"
				className="w-64 p-2 border shadow rounded border-gray-200 text-sm"
				defaultValue={values.filter?.query || ''}
				onKeyDown={(e) => {
					const value = e.target.value;
					if (e.key === 'Enter') {
						handleFilterChange(['query', value]);
					}
				}}
			/>
			
			{/* Toggle order by date */}
			{values.order?.toLowerCase() === 'created desc' ? (
				<button
					className="px-2 py-1 bg-white border rounded text-sm border-gray-200"
					onClick={() => handleChange(['order', 'created ASC'])}
				>
					By Date &#x25BC;
				</button>
			) : (
				<button
					className="px-2 py-1 bg-white border rounded text-sm border-gray-200"
					onClick={() => handleChange(['order', 'created DESC'])}
				>
					By Date &#x25B2;
				</button>
			)}
			
			{/* Filter by state */}
			<select
				className="text-sm cursor-pointer rounded border border-gray-200"
				value={values.filter?.state || 'all'}
				onChange={(e) => handleFilterChange(['state', e.target.value])}
			>
				<option value="all">All</option>
				<option value="pending">Pending</option>
				<option value="done">Done</option>
				<option value="failed">Failed</option>
			</select>
		</div>
	);
}
