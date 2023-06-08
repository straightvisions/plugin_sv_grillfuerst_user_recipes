import React, {useContext} from "react";
import Image from "../form_image";
import {IconTrash} from "../icons";
import {GlobalContext} from "../../modules/context";

export default function Step(props){
	const {
		index,
		item,
		onChange,
		onDelete,
		uuid,
		onChangeOrderUp,
		onChangeOrderDown,
		formState,
	} = props;
	
	const { globalModalConfirm, setGlobalModalConfirm } = useContext(GlobalContext);
	
	/* legacy item fix */
	if(item.hasOwnProperty('images') === false){
		item.images = [];
		delete item.image;
		onChange(item);
	}
	
	const handleImageUpload = (files) => {
		if(formState.state === 'review_pending' || formState.state === 'published') return;
		item.images = files;
		onChange(item);
	}
	
	const handleImageDelete = (image) => {
		if(formState.state === 'review_pending' || formState.state === 'published') return;
		item.images = item.images.map(img => {
			if(image.url !== img.url){
				return img;
			}
		});
		onChange(item);
	}
	
	const columnsClassnames = [
		'w-full lg:w-1/12 lg:whitespace-nowrap overflow-hidden px-2 py-2 flex justify-center items-center gap-2 lg:flex-col',
		'w-full lg:w-4/12 whitespace-nowrap overflow-hidden px-2 py-2',
		'w-full lg:w-6/12 whitespace-nowrap overflow-hidden px-2 py-2',
		'w-full lg:w-1/12 whitespace-nowrap overflow-hidden px-2 py-2 flex justify-center items-center',
	];
	
	const wrapperClassnames = parseInt(index) % 2 === 1 ? 'flex flex-wrap items-center overflow-hidden py-4 bg-grey-50' : 'flex flex-wrap items-center overflow-hidden';
	
	return (
		<div key={index} className={wrapperClassnames}>
			<div className={columnsClassnames[0]}>
					<button
						onClick={onChangeOrderUp}
						type="button"
						className="w-[30%] lg:w-auto bg-white border border-grey-500 text-grey-500 px-2 py-1 rounded hover:text-white hover:bg-orange-500 hover:border-orange-500"
					>
						&#x25B2;
					</button>
					<span className="flex justify-center items-center bg-black text-white rounded-full w-10 h-10 font-bold text-center cursor-pointer">{index + 1}</span>
					<button
						onClick={onChangeOrderDown}
						type="button"
						className="w-[30%] lg:w-auto bg-white border border-grey-500 text-grey-500 px-2 py-1 rounded hover:text-white hover:bg-orange-500 hover:border-orange-500"
					>
						&#x25BC;
					</button>
			</div>
			<div className={columnsClassnames[1]}>
				<span className="lg:hidden">Bild</span>
				<Image onChange={handleImageUpload} onDelete={handleImageDelete} image={item.images[0]} uuid={uuid} />
			</div>
			<div className={columnsClassnames[2]}>
				<span className="lg:hidden">Beschreibung</span>
				<textarea
					rows={12}
					className="block w-full h-full min-h-[260px] rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
					placeholder="Die leckersten Grillspieße..."
					value={item.description}
					onChange={(e) => {item.description = e.target.value; onChange(item);}}
				/>
			</div>
			<div className={columnsClassnames[3]}>
				<button
					onClick={() => setGlobalModalConfirm({
						message: 'Möchtest du diesen Schritt wirklich löschen?',
						onConfirm: onDelete
					})}
					type="button"
					className="opacity-20 hover:opacity-100 text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-0 focus:outline-none focus:ring-red-300 font-bold rounded-full p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800"
				>
					<IconTrash width="24" height="24" />
					<span className="sr-only">Schritt {index+1} Entfernen</span>
				</button>
			</div>
		</div>
	);
}