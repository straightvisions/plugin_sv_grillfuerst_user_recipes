import React, { useEffect, useState } from "react";

export default function SearchBar({ filter, onChange, id }) {
	const [query, setQuery] = useState(filter.find((item) => item.key === "query").value);
	const [state, setState] = useState(filter.find((item) => item.key === "state").value);

	const handleChange = ()=>{
		const updatedFilter = filter.map((item) => {
			if (item.key === "query") {
				return { ...item, value: query };
			}
			if (item.key === "state") {
				return { ...item, value: state };
			}
			return item;
		});
		
		onChange(updatedFilter);
	}
	
	useEffect(()=>{
		handleChange();
	},[state]);
	
	return (
		<div id={id} className="flex flex-row items-center gap-2 mb-4">
			{/* Search Query */}
			<input
				type="text"
				placeholder="Search by title or UUID"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") handleChange();
				}}
				className="w-64 p-2 border shadow rounded border-gray-200 text-sm"
			/>
			
			{/* State Filter */}
			<select
				value={state}
				onChange={(e) => {
					setState(e.target.value);
				}}
				className="text-sm cursor-pointer rounded border border-gray-200"
			>
				<option value="all">All</option>
				<option value="export_pending">Pending</option>
				<option value="export_running">Running</option>
				<option value="export_error">Error</option>
				<option value="published">Done</option>
			</select>
		</div>
	);
}
