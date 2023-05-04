import React, { useState } from "react";
import Dropzone from '../dropzone';
import routes from '../../models/routes';
import storage from "../../modules/storage";

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
	
		// upload fetch
		fetch(
			routes.uploadMedia + route,
			{
				method: 'POST',
				headers: {
					'Authorization': 'Bearer ' + storage.get('token'),
				},
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				onChange(result);
			})
			.catch((error) => {
				// error handling here
				console.error('Error:', error);
			}).finally(() => {
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