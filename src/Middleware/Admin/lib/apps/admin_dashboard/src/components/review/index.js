import React, {useEffect, useState, useReducer} from 'react';
import ReviewToolbar from '../review_toolbar';
import Spinner from "../spinner";
import FeedbackEditor from '../feedback_editor';
import routes from "../../models/routes";
import headers from "../../modules/headers";
import {useParams} from "react-router-dom";
import storage from "../../modules/storage";
import ReviewRecipeForm from "../review_recipe_form";

export default function Review() {
	const params = useParams();
	
	// data handling
	const storageSlug = 'recipeReview' + params.uuid; // multiple tabs support anyone?
	const [attributes, setAttributes] = useReducer((state, action) => {
		const _attributes = {...state, ...action};
			storage.set(storageSlug, JSON.stringify(_attributes))
			return _attributes;
		},
		// default
		storage.get(storageSlug, {
		data: {},
		_data: {}, // hidden backup
		feedback: '',
	}));
	
	// local states
	const [loading, setLoading] = useState(true);
	
	// load data from db
	useEffect(() => {
		if(Object.keys(attributes.data).length === 0){
			fetch(routes.getRecipeByUuid + params.uuid,{
				headers:headers.get()
			})
				.then(response => response.json())
				.then(data => {
					// create a hidden backup of the data, might be useful later
					const _data = Object.keys(attributes._data).length <= 0 ? data : attributes._data;
					setAttributes({data, _data});
					setLoading(false);
				});
		}else{
			setLoading(false);
		}
	}, []);
	
	// add refresh stuff here
	
	if(loading){
		return (
			<div className="bg-white px-4 py-12 shadow sm:rounded-lg  h-full">
				<Spinner />
			</div>
		);
	}
	
	return (
		<div>
			<ReviewToolbar {...attributes} />
			<div className="flex gap-5 w-full max-w-full">
				<div className="flex-grow">
					<ReviewRecipeForm {...attributes} setAttributes={setAttributes}/>
				</div>
				<div className="w-full max-w-[600px]">
					<FeedbackEditor {...attributes} setAttributes={setAttributes}/>
				</div>
				
			</div>
		</div>
	);
}

