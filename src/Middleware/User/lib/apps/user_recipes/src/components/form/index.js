import React, {useEffect, useState} from "react";
import Common from '../form_common';
import Ingredients from '../form_ingredients';
import Steps from '../form_steps';
import Submit from '../form_submit';
import Spinner from '../spinner';
import RecipeModel from '../../models/recipe';
import LocalStorage from "../local_storage";
import routes from "../../models/routes";

import {
	useParams
} from "react-router-dom";

export default function Form(props) {
	//const [formState, setFormState] = useState(RecipeModel);
	const params = useParams();
	const formStateSlug = 'formState' + params.uuid; // multiple tabs support anyone?
	const [localStorage, setLocalStorage] = LocalStorage(formStateSlug , RecipeModel);
	const [formState, setFormState] = useState(RecipeModel);

	// load data from db and check if newer than storage
	useEffect(() => {
		fetch(routes.getRecipeByUuid + params.uuid)
			.then(response => response.json())
			.then(data => {
				const remoteTime = new Date(data.edited);
				const localTime = new Date(localStorage.edited);
			
				if (remoteTime > localTime) {
					setFormState(data);
					setLocalStorage(data);
				} else {
					setFormState(localStorage);
				}
			});
			
	}, []);
	
	// update storage on formState change
	// somehow useEffect doesn't work here
	const _setFormState = (state) => {
		state.edited = new Date();
		state = {...formState, ...state};
		setFormState(state);
		setLocalStorage(state);
	};
	
	
	const handleSubmit = (e) => {
		e.preventDefault();
		//@todo form submit should be "PUT" fetch - first "save" should be "POST"
		console.log(formState);
		
	};
	
	return (
		<form className="space-y-6" onSubmit={handleSubmit}>
			<Spinner/>
			<Common formState={formState} setFormState={_setFormState} />
			<Ingredients formState={formState} setFormState={_setFormState} />
			<Steps formState={formState} setFormState={_setFormState} />
			<Submit formState={formState} setFormState={_setFormState} />
		</form>
	);
}