import React from 'react';
import Common from './form_common';

export default function ReviewRecipeForm(props) {
	const {
		data
	} = props;
	
	const _setFormState = (state) => {
		console.log('legacy update');
		console.log(state);
	}
	
	
	return (
		<div className="w-full max-w-full">
			<Common formState={data} setFormState={_setFormState} />
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

