import React, {useEffect, useState} from "react";
// tiny ref https://www.tiny.cloud/docs/tinymce/6/react-ref/
import { Editor } from '@tinymce/tinymce-react';
import routes from '../../models/routes';

export default function WYSIWYG(props) {

	const {
		value,
		onChange,
		disabled = false
	} = props;
	
	const [text, setText] = useState('');
	
	return (
		<>
			<Editor
				onInit={(evt, editor) => {
					setText(editor.getContent({format: 'text'}));
				}}
				value={value}
				init={{
					height: 500,
					menubar: false,
					
					plugins: 'advlist autolink lists link image charmap preview anchor ' +
						'searchreplace visualblocks code fullscreen ' +
						'insertdatetime media table code help wordcount'
					,
					toolbar: 'undo redo | formatselect | ' +
						'bold italic backcolor | alignleft aligncenter ' +
						'alignright alignjustify | bullist numlist outdent indent | ' +
						'removeformat | help'
				}}
				onEditorChange={(newValue, editor) => {
					setText(editor.getContent({format: 'text'}));
					onChange(newValue);
				}}
				disabled={disabled}
				tinymceScriptSrc={'https://' + routes.config.publicURL + '/js/tinymce/tinymce.min.js'}
			/>
		</>
	);
	
}