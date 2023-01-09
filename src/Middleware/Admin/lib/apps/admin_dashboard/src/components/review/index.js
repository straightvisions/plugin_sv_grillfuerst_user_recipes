import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import Spinner from '../spinner';
import RecipeDatasheet from '../recipe_datasheet';
import FeedbackEditor from '../feedback_editor';
import routes from "../../models/routes";
import ActivityMap from "../activity_map";

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
	
	if(loading){
		return (
			<div className="bg-white px-4 py-12 shadow sm:rounded-lg  h-full">
				<Spinner />
			</div>
		)
	}
	
	const handleRelease = () => {
	
	}
	
	const ReleaseButton = saving ? <button
		disabled
		type="submit"
		className="col-span-12 ml-3 mt-4 inline-flex justify-center gap-x-3 rounded-md border border-transparent bg-neutral-400 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 inline-flex items-center"
	><Spinner/> Speichert..</button> : <button
		type="submit"
		className="col-span-12 ml-3 mt-4 inline-flex justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-orange-600 hover:border-orange-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
		onClick={handleRelease}
	>Rezepte freigeben</button>;
	
	return (
		<div className="py-6">
			<div className="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8">
				<main className="xs:col-span-12 sm:col-span-6 xl:col-span-6 space-y-4 mb-4">
					<RecipeDatasheet data={formState} />
					<div className="space-y-4">
						<h3 className="text-lg font-medium leading-6 text-gray-900">Feedback Historie</h3>
						<ActivityMap items={formState.feedback} />
					</div>
				</main>
				<aside className="xs:col-span-12 sm:col-span-6 xl:col-span-6 xs:block">
					<div className="sticky top-6">
						<FeedbackEditor formState={formState} onSubmit={handleSubmit} saving={saving} />
					</div>
				</aside>
			</div>
			<div className="mx-auto my-8 max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8">
				<hr className="h-px bg-gray-400 border-0 col-span-12" />
				{ReleaseButton}
			</div>
		</div>
	);

}