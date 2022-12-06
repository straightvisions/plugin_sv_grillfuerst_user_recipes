import React, {useEffect, useState, } from "react";
import { useInterval } from 'usehooks-ts'
import Common from '../form_common';
import Ingredients from '../form_ingredients';
import Steps from '../form_steps';
import Submit from '../form_submit';
import Spinner from '../spinner';
import routes from "../../models/routes";
import { useParams } from "react-router-dom";

function dateIsValid(date) {
	return typeof date === 'object' && date !== null && typeof date.getTime === 'function' && !isNaN(date);
}

export default function Form(props) {
	const {user} = props;
	const params = useParams();
	const [formState, setFormState] = useState({});
	const [loading, setLoadingState] = useState(true);
	const [saving, setSavingState] = useState(false);
	
	// load data from db and check if newer than storage
	useEffect(() => {
		fetch(routes.getRecipeByUuid + params.uuid)
			.then(response => response.json())
			.then(data => {
				setFormState(data);
				setLoadingState(false);
			});
			
	}, []);

	// update storage on formState change
	// somehow useEffect doesn't work here
	const _setFormState = (state) => {
		state.edited = new Date();
		state = {...formState, ...state};
		setFormState(state);
	};
	
	// manual save
	const handleSubmit = (e = null) => {
		if (e) e.preventDefault();
		if(saving || loading) return;
		setSavingState(true);
		//@todo change route in backend to match stateless route here
		
		fetch(routes.updateRecipe +  params.uuid, {
			method: 'PUT',
			cache: 'no-cache',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(formState),
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
	
	// auto save
	useInterval(() => {
		handleSubmit();
	}, 20000);
	
	if(loading){
		return (
			<div className="bg-white px-4 py-12 shadow sm:rounded-lg  h-full">
				<Spinner />
			</div>
		)
	}
	
	return (
		<form className="space-y-6" onSubmit={handleSubmit}>
			<Common formState={formState} setFormState={_setFormState} />
			<Ingredients formState={formState} setFormState={_setFormState} />
			<Steps formState={formState} setFormState={_setFormState} />
			<Submit saving={saving} formState={formState} setFormState={_setFormState} />
		</form>
	);
	
}