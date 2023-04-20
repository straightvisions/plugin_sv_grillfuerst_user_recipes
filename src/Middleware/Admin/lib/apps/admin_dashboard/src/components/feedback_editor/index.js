import React, {useState, useEffect} from "react";
import WYSIWYG from '../wysiwyg';

export default function FeedbackEditor(props) {
	const {
		feedback,
		setAttributes
	} = props;
console.log(props);
	return (
		<div>
			<WYSIWYG onChange={val => setAttributes({feedback:val})} value={feedback}/>
		</div>
	);
	
}