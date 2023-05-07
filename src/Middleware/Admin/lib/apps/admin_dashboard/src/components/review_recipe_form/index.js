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
		setAttributes({data:updatedData});
	};
	//@todo move this to attribute to allow forced overwrite
	const disabled = data.state !== 'review_pending';
	
	return (
		<div className="w-full max-w-full relative">
			{disabled && (
				<div className="z-10 absolute top-0 left-0 h-full w-full bg-gray-500 opacity-20 flex items-start justify-end">
					<p className="text-white font-bold p-2">This form is disabled</p>
				</div>
			)}
			<Common formState={data} setFormState={_setAttributes} />
			<Ingredients formState={data} setFormState={_setAttributes} />
			<Accessories formState={data} setFormState={_setAttributes} />
			<Steps formState={data} setFormState={_setAttributes} />
		</div>
	);
}

