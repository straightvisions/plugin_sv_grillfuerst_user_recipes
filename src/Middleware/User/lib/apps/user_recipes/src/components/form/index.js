import React, { useState, useEffect } from "react";
import Common from '../form_common';
import Ingredients from '../form_ingredients';
import Steps from '../form_steps';
import Submit from '../form_submit';
import RecipeModel from '../../models/recipe';

export default function Form(props) {
	const [formState, setFormState] = useState(RecipeModel);
	
	return (
		<form className="space-y-6" action="#" method="POST">
			<Common formState={formState} setFormState={setFormState} />
			<Ingredients formState={formState} setFormState={setFormState} />
			<Steps formState={formState} setFormState={setFormState} />
			<Submit formState={formState} setFormState={setFormState} />
		</form>
	)
}