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
	
	const handleSubmit = (value) => {
		console.log(value);
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