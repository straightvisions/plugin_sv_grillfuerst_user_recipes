import React, { useState } from "react";
import Dropzone from '../dropzone';
import routes from '../../models/routes';

export default function MediaUpload(props) {
	const {
		label = '',
		subLabel = '',
		multiple = false,
		accept = 'image/*',
		onChange = (e) => {console.log('change')},
	} = props;
	
	const [uploadingState, setUploadingState] = useState(false);
	
	const handleFileDrop = (files) => {
		setUploadingState(true);
		
		// create form data
		const formData = new FormData();
		// add files to form data
		Array.from(files).forEach((item, index) => {
			formData.append('files', item);
		});
		// upload fetch
		fetch(
			routes.uploadMedia,
			{
				method: 'POST',
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
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