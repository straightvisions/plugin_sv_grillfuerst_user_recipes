import React, { useState } from "react";
import MediaUpload from "../media_upload";

export default function Image(props) {
	const {
		onChange = (e) => console.log(e),
		multiple = false,
		images = [],
		uuid = 0,
	} = props;

	const route = '/recipes/' + uuid;
	
	if(images.length > 0){
		return (
			<p>SHOW IMAGE PLACEHOLDER</p>
		)
	}else{
		return (
			<MediaUpload label="Bild hochladen" subLabel="oder per Drag & Drop ablegen" route={route} multiple={multiple} />
		)
	}
	
}