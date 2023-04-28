import React, {useState, useEffect} from 'react';
import Common from './form_common';
import Ingredients from './form_ingredients';
import Accessories from './form_accessories';
import Steps from './form_steps';

export default function ReviewRecipeForm(props) {
	const {
		data,
		setAttributes
	} = props;
	
	const _setAttributes = (state, save = false) => {
		const updatedData = {...data, ...state};
		console.log('updatedData');
		console.log(updatedData);
		setAttributes({data:updatedData});
	};
	
	return (
		<div className="w-full max-w-full">
			<Common formState={data} setFormState={_setAttributes} />
			<Ingredients formState={data} setFormState={_setAttributes} />
			<Accessories formState={data} setFormState={_setAttributes} />
			<Steps formState={data} setFormState={_setAttributes} />
		</div>
	);
}

