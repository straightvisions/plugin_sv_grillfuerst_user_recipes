import React, { useState } from "react";
import MediaUpload from "../media_upload";

export default function Image(props) {
	const {
		onChange = (e) => console.log(e),
		onDelete = (e) => console.log(e),
		image = null,
		uuid = 0,
	} = props;
	
	const route = '/recipes/' + uuid;
	
	if(image && image.hasOwnProperty('url') && image.url){
		return (
			<div
				className="h-full w-full min-h-[300px] relative group overflow-hidden flex justify-center rounded-md bg-gray-100"
			>
				<div className="h-full w-full hidden group-hover:flex justify-center align-center rounded-md bg-white/[.8] absolute">
					<div
						onClick={()=>onDelete(image)}
						className="justify-center m-auto p-6 rounded-full bg-red-500/[.6] cursor-pointer">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6 stroke-white">
							<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
						</svg>
					</div>
					
				</div>
				<img className="object-cover w-full flex justify-center" alt="" src={image.url} />
			</div>
			
		);
	}else{
		return (
			<MediaUpload onChange={onChange} label="Bild hochladen" subLabel="oder per Drag & Drop ablegen" route={route}  />
		);
	}
	
}