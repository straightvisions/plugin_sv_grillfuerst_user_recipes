import React, { useState } from "react";
import Dropzone from '../dropzone';
import routes from '../../../models/routes';
import headers from '../../../modules/headers';

export default function MediaUpload(props) {
	const {
		label = '',
		subLabel = '',
		multiple = false,
		accept = 'image/*',
		onChange = (e) => {console.log('change')},
		route = '',
	} = props;
	
	const [uploadingState, setUploadingState] = useState(false);
	
	const handleFileDrop = (files) => {
		setUploadingState(true);
		
		// create form data
		const formData = new FormData();
		// add files to form date
		Array.from(files).forEach((item, index) => {
			formData.append(index, item);
		});
		
		let modifiedHeaders = {...{}, ...headers.get()};
		delete modifiedHeaders['Content-Type'];
		console.log(modifiedHeaders);
		// upload fetch
		fetch(
			routes.uploadMedia + route,
			{
				method: 'POST',
				headers: modifiedHeaders,
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				onChange(result);
				setUploadingState(false);
			})
			.catch((error) => {
				// error handling here
				console.error('Error:', error);
				setUploadingState(false);
			});
	};
	
	return (
		<Dropzone
			label={label}
			subLabel={subLabel}
			multiple={multiple}
			onChange={handleFileDrop}
			uploading={uploadingState}
		/>
	)
}