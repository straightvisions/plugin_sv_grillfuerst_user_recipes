import React, {useState} from "react";
import Submit from '../submit';
import WYSIWYG from '../wysiwyg';
import Spinner from "../spinner";
import LocalStorage from "../local_storage";
import ActivityMap from "../activity_map";

export default function FeedbackEditor(props) {
	const {
		onSubmit,
		formState,
		saving
	} = props;
	
	const formStateSlug = 'formStateFeedback' + formState.uuid; // multiple tabs support anyone?
	const [localStorage, setLocalStorage] = LocalStorage(formStateSlug , '');
	
	const handleClick = () => {
		const value = localStorage;
		setLocalStorage('');
		return onSubmit(value);
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
		<div className="space-y-12">
			<div className="space-y-4">
				<WYSIWYG formState={formState} onChange={val => setLocalStorage(val)} value={localStorage}/>
				{SubmitButton}
			</div>
			
			<div className="space-y-4">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Feedback Historie</h3>
				<ActivityMap items={formState.feedback} />
			</div>
		</div>
	);
	
}