import React, { useState } from "react";
import MediaUpload from "../media_upload";

export default function Images(props) {
	const {
		onChange = (e) => console.log(e),
		multiple = false,
		images = [],
		uuid = 0,
	} = props;
	
	const route = '/recipes/' + uuid;

	if(images.length > 0){
		return (
			<>
				{images.map(item => {
					return <img alt="" src={item.url} />;
					}
				)}
			</>
		);
	}else{
		return (
			<MediaUpload onChange={onChange} label="Bild hochladen" subLabel="oder per Drag & Drop ablegen" route={route} multiple={multiple} />
		);
	}
	
}