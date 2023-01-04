import React, {useState} from "react";
import Submit from '../submit';
import WYSIWYG from '../wysiwyg';
import Spinner from "../spinner";
import LocalStorage from "../local_storage";

export default function FeedbackEditor(props) {
	const {
		onSubmit,
		formState,
		saving
	} = props;
	
	const formStateSlug = 'formStateFeedback' + formState.uuid; // multiple tabs support anyone?
	const [localStorage, setLocalStorage] = LocalStorage(formStateSlug , '');
	
	const getCommentHistory = () => {
		const history = formState.feedback;
		let html = history.length > 0 ? '' : <p>Bisher kein Feedback eingereicht.</p>;
		
		for(let i = 0; i < history.length; i++){
			html += <p><strong>{history[i].date}</strong><br />{history[i].content}</p>;
		}
		
		return html;
	}
	
	const handleClick = () => {
		return onSubmit(localStorage);
	}
	
	const SubmitButton = saving ? <button
				disabled
				type="submit"
				className="ml-3 inline-flex justify-center gap-x-3 rounded-md border border-transparent bg-neutral-400 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 inline-flex items-center"
			><Spinner/> Speichert..</button> : <button
				type="submit"
				className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-orange-600 hover:border-orange-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				onClick={handleClick}
			>Feedback absenden</button>;
	
	return (
		<>
			<WYSIWYG formState={formState} onChange={val => setLocalStorage(val)} value={localStorage}/>
			{SubmitButton}
			{getCommentHistory()}
		</>
	);
	
}