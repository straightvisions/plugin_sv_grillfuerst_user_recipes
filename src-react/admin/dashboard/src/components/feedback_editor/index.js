import React, {useState, useEffect} from "react";
import WYSIWYG from '../wysiwyg';

export default function FeedbackEditor(props) {
	const {
		feedback,
		setAttributes
	} = props;

	return (
		<div className="sticky top-5">
			<WYSIWYG onChange={val => setAttributes({feedback:val})} value={feedback}/>
		</div>
	);
	
}