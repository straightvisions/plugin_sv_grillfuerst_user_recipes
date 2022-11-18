import React, {useEffect, useState} from "react";
import Common from '../form_common';
import Ingredients from '../form_ingredients';
import Steps from '../form_steps';
import Submit from '../form_submit';
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
	const [formState, setFormState] = LocalStorage(formStateSlug , RecipeModel);
	
	useEffect(() => {
		fetch(routes.getRecipeByUuid + params.uuid)
			.then(response => response.json())
			.then(data => {
				setFormState(data)});
	}, [])
	
	const handleSubmit = (e) => {
		e.preventDefault();
		//@todo form submit should be "PUT" fetch - first "save" should be "POST"
		console.log(formState);
	}
	
	return (
		<form className="space-y-6" onSubmit={handleSubmit}>
			<Common formState={formState} setFormState={setFormState} />
			<Ingredients formState={formState} setFormState={setFormState} />
			<Steps formState={formState} setFormState={setFormState} />
			<Submit formState={formState} setFormState={setFormState} />
		</form>
	)
}