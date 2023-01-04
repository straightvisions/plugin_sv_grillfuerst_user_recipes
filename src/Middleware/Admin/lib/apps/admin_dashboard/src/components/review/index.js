import React, {useEffect, useState} from "react";
import Spinner from '../spinner';
import RecipeDatasheet from '../recipe_datasheet';
import FeedbackEditor from '../feedback_editor';
import routes from "../../models/routes";

import {
	useParams
} from "react-router-dom";


export default function Review(props) {
	const {user} = props;
	const params = useParams();
	
	const [formState, setFormState] = useState({});
	const [loading, setLoadingState] = useState(true);
	const [saving, setSavingState] = useState(false);
	
	// load data from db
	useEffect(() => {
		fetch(routes.getRecipeByUuid + params.uuid)
			.then(response => response.json())
			.then(data => {
				setFormState(data);
				setLoadingState(false);
			});
			
	}, []);
	
	const createFeedback = (value) => {
		let feedbackHistory = formState.feedback;
		
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		
		today = mm + '/' + dd + '/' + yyyy;
		
		return {
			date: today,
			text: value,
			userId: 1,
			type: 'comment'
		};
	}
	
	const handleSubmit = (value) => {
		if(saving || loading) return;
		setSavingState(true);
		formState.feedback.push( createFeedback(value) )
		const feedback = formState.feedback;
		const data = {
			feedback,
		};
	
		fetch(routes.updateRecipe +  params.uuid, {
			method: 'PUT',
			cache: 'no-cache',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(data),
		})
			.then(response => response.json())
			.then(data => {
				setSavingState(false);
				//@todo give a notice on success
			}).catch(function(error) {
			// do error handling
			//@todo give a notice on error
			console.log(error);
			setSavingState(false);
		});
	};
	
	console.log(formState);
	
	if(loading){
		return (
			<div className="bg-white px-4 py-12 shadow sm:rounded-lg  h-full">
				<Spinner />
			</div>
		)
	}
	
	return (
		<div className="py-6">
			<div className="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8">
				<main className="lg:col-span-9 xl:col-span-6">
					<RecipeDatasheet data={formState} />
				</main>
				<aside className="hidden xl:col-span-6 xl:block">
					<div className="sticky top-6 space-y-4">
						<FeedbackEditor formState={formState} onSubmit={handleSubmit} saving={saving} />
					</div>
				</aside>
			</div>
		</div>
		
		
	);

}