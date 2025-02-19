import React, { useState, useEffect } from "react";
import Image from "../form_image";
import Modal from "../../modal";

export default function Step(props){
	const {
		index,
		item,
		onChange,
		onDelete,
		uuid,
		onChangeOrderUp,
		onChangeOrderDown,
	} = props;
	
	const [showModalImageDelete, setShowModalImageDelete] = useState(false);
	
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
	
	const handleImageChange = (image) => {
		item.images = item.images.map(img => {
			if(image.id === img.id){
				img = image;
			}
			return img;
		});

		onChange(item, true);
	}
	
	const handleImageDelete = (image) => {
		item.images = item.images.map(img => {
			if(image.id !== img.id){
				return img;
			}
		});
		onChange(item);
	}
	
	return (
		<tr key={index}>
			<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
				<div className="flex flex-col justify-center items-center gap-[5px] items-center">
					<button
						onClick={onChangeOrderUp}
						type="button"
						className="bg-white border border-grey-500 text-grey-500 px-2 py-1 rounded hover:text-white hover:bg-orange-600"
					>
						&#x25B2;
					</button>
					<span className="flex justify-center items-center bg-black text-white rounded-full w-10 h-10 font-bold text-center cursor-pointer">{index + 1}</span>
					<button
						onClick={onChangeOrderDown}
						type="button"
						className="bg-white border border-grey-500 text-grey-500 px-2 py-1 rounded hover:text-white hover:bg-orange-600"
					>
						&#x25BC;
					</button>
				</div>
			
			</td>
			<td className="h-72 rounded-md overflow-hidden whitespace-nowrap py-4 text-sm font-medium text-gray-900">
				{showModalImageDelete &&
					<Modal
						message={'Bild wirklich löschen?'}
						isOpen={showModalImageDelete}
						onClose={()=>setShowModalImageDelete(false)}
						name="modalImageDelete"
						onConfirm={()=>{setShowModalImageDelete(false);handleImageDelete(item.images[0]);}}/>
				}
				<Image onChange={handleImageChange} onUpload={handleImageUpload} onDelete={()=>setShowModalImageDelete(true)} image={item.images[0]} uuid={uuid} />
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