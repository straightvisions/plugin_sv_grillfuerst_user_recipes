import React, { useState, useEffect } from "react";
import Image from "../form_image";

export default function Step(props){
	const {
		index,
		item,
		onChange,
		onDelete,
		uuid
	} = props;
	
	return (
		<tr key={index}>
			<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
				<div className="bg-black text-white p-3 rounded-full w-10 h-10 font-bold text-center cursor-pointer">{index+1}</div>
			</td>
			<td className="h-72 rounded-md overflow-hidden whitespace-nowrap py-4 text-sm font-medium text-gray-900">
				<Image props={item.image} multiple={true} uuid={uuid} />
			</td>
			<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-full">
				<textarea
					rows={12}
					className="min-w-max block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					placeholder="Die leckersten Grillspieße..."
					defaultValue={item.description}
				/>
			</td>
			<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
				<button
					onClick={() => removeStep(index)}
					type="button"
					className="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
					     strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round"
						      d="M6 18L18 6M6 6l12 12"/>
					</svg>
					<span className="sr-only">Schritt {index+1} Entfernen</span>
				</button>
			</td>
		</tr>
	);
}