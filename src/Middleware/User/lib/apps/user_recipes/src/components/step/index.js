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
	
	/* legacy item fix */
	if(item.hasOwnProperty('images') === false){
		item.images = [];
		delete item.image;
		onChange(item);
	}
	
	const handleImageUpload = (files) => {
		item.images = files;
		onChange(item);
	}
	
	const handleImageDelete = (image) => {
		item.images = item.images.map(img => {
			if(image.url !== img.url){
				return img;
			}
		});
		onChange(item);
	}

	return (
		<tr key={index}>
			<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
				<div className="bg-black text-white flex justify-center rounded-full w-10 h-10 font-bold text-center cursor-pointer"><span className="m-auto">{index+1}</span></div>
			</td>
			<td className="h-72 rounded-md overflow-hidden whitespace-nowrap py-4 text-sm font-medium text-gray-900">
				<Image onChange={handleImageUpload} onDelete={handleImageDelete} image={item.images[0]} uuid={uuid} />
			</td>
			<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-full">
				<textarea
					rows={12}
					className="block w-full h-full min-h-[260px] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					placeholder="Die leckersten Grillspieße..."
					value={item.description}
					onChange={(e) => {item.description = e.target.value; onChange(item);}}
				/>
			</td>
			<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
				<button
					onClick={onDelete}
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