import React, { useState } from "react";
import MediaUpload from "../media_upload";

export default function Image(props) {
	const {
		onChange = (e) => console.log(e),
		image = false,
		uuid = 0,
	} = props;
	
	const route = '/recipes/' + uuid;
	
	if(image !== false){
		return (
			<img alt="" src={image.url} />
		);
	}else{
		return (
			<MediaUpload onChange={onChange} label="Bild hochladen" subLabel="oder per Drag & Drop ablegen" route={route}  />
		);
	}
	
}