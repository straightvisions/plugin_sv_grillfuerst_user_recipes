import React from 'react';
import Common from './form_common';
import Ingredients from './form_ingredients';

export default function ReviewRecipeForm(props) {
	const {
		data,
		setAttributes
	} = props;
	
	const _setAttributes = (state) => {
		const updatedData = {...data, ...state};
		setAttributes({data:updatedData});
	};
	
	return (
		<div className="w-full max-w-full">
			<Common formState={data} setFormState={_setAttributes} />
			<Ingredients formState={data} setFormState={_setAttributes} />
			{/*
			<Common formState={formState} setFormState={_setFormState} />
				<Ingredients formState={formState} setFormState={_setFormState} />
				<Accessories formState={formState} setFormState={_setFormState} />
				<Steps formState={formState} setFormState={_setFormState} />
				<Submit saving={saving} formState={formState} setFormState={_setFormState} onSave={handleSave} onSubmit={handleSubmit}/>
				*/
			}
		</div>
	);
}

