import React, {useEffect, useState} from "react";
// tiny ref https://www.tiny.cloud/docs/tinymce/6/react-ref/
import { Editor } from '@tinymce/tinymce-react';

export default function WYSIWYG(props) {
	const {
		value,
		onChange
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
				}}
				onEditorChange={(newValue, editor) => {
					setText(editor.getContent({format: 'text'}));
					onChange(newValue);
					
				}}
			/>
		</>
	);
	
}