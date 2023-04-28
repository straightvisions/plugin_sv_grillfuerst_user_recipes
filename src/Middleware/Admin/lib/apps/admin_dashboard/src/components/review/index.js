import React, {useEffect, useState, useReducer} from 'react';
import ReviewToolbar from '../review_toolbar';
import Spinner from "../spinner";
import FeedbackEditor from '../feedback_editor';
import routes from "../../models/routes";
import headers from "../../modules/headers";
import {useParams} from "react-router-dom";
import storage from "../../modules/storage";
import ReviewRecipeForm from "../review_recipe_form";
import ActivityMap from "../activity_map";

export default function Review() {
	const params = useParams();
	
	const attributesModel = {
		data: {},      // Placeholder for the recipe data
		_data: {},     // Hidden backup of the recipe data
		feedback: '',  // Placeholder for the feedback
		saving: false, // Flag indicating if the recipe is being saved
		submitting: false, // Flag indicating if the recipe is being submitted
		publishing: false, // Flag indicating if the recipe is being published
	};
	
	// data handling
	// 1. Load data from localStorage
	// 2. Load data from db if localStorage is empty
	// 3. Update data in localStorage on change
	// 4. Update data in database on save
	const storageSlug = 'recipeReview' + params.uuid; // multiple tabs support anyone?
	const [attributes, setAttributes] = useReducer((state, action) => {
		const _attributes = {...state, ...action};
			storage.set(storageSlug, JSON.stringify(_attributes));  // Save attributes to localStorage
			return _attributes;
		},
		// Default state:
		// If storage is empty, return the model
		// If storage has data, merge the model with the stored data
		{...attributesModel ,...storage.get(storageSlug, attributesModel)}
		);

	// local states
	const [loading, setLoading] = useState(true);
	const [refresh, setRefresh] = useState(false);
	
	console.log(attributes.data.steps);
	// load data from db
	useEffect(() => {
		if(Object.keys(attributes.data).length === 0 || refresh){
			fetch(routes.getRecipeByUuid + params.uuid,{
				headers:headers.get()
			})
				.then(response => response.json())
				.then(data => {
					// create a hidden backup of the data, might be useful later
					const _data = Object.keys(attributes._data).length <= 0 ? data : attributes._data;
					setAttributes({data, _data});
					setLoading(false);
					setRefresh(false);
				});
		}else{
			setLoading(false);
			setRefresh(false);
		}
	}, [refresh]);
	
	// add refresh stuff here
	const onSave = () => {
		if(attributes.saving) return;
		setAttributes({saving: true});
		
		let data = {
			...attributes.data,
			...{}
		};
		
		fetch(routes.updateRecipe + params.uuid, {
			method: 'PUT',
			cache: 'no-cache',
			headers:headers.get(),
			body: JSON.stringify(data),
		})
			.then(response => response.json())
			.then(data => {
				setAttributes({saving: false});
			}).catch(function(error) {
			// do error handling
			//@todo give a notice on error
			console.log(error);
			setAttributes({saving: false});
		});
	}
	
	const onSubmit = () => {
		if(attributes.submitting) return;
		setAttributes({submitting: true});
		
		let data = {
			...attributes.data,
			...{
				state: 'reviewed',
				feedback: [...attributes.data.feedback, ...[createFeedback(attributes.feedback)]]
			}
		};
		
		// empty feedback storage
		setAttributes({feedback: ''});
		
		fetch(routes.updateRecipe + params.uuid + '/feedback', {
			method: 'PUT',
			cache: 'no-cache',
			headers:headers.get(),
			body: JSON.stringify(data),
		})
			.then(response => response.json())
			.then(data => {
				setAttributes({submitting: false});
				setRefresh(true);
			}).catch(function(error) {
			// do error handling
			//@todo give a notice on error
			console.log(error);
			setAttributes({submitting: false});
		});
	}
	
	const onPublish = () => {
	
	}
	
	const createFeedback = (value) => {
		let feedbackHistory = attributes.data.feedback;
		
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		
		today = mm + '/' + dd + '/' + yyyy;
		
		return {
			date: today,
			text: value,
			userId: 1,
			type: 'comment'
		};
	};
	
	if(loading){
		return (
			<div className="bg-white px-4 py-12 shadow sm:rounded-lg  h-full">
				<Spinner />
			</div>
		);
	}
	
	return (
		<div>
			<ReviewToolbar {...attributes} refreshing={refresh} onSave={onSave} onSubmit={onSubmit} onPublish={onPublish} onRefresh={()=>setRefresh(true)}/>
			<div className="flex gap-5 w-full max-w-full">
				<div className="flex-grow">
					<ReviewRecipeForm {...attributes} setAttributes={setAttributes} />
				</div>
				<div className="w-full max-w-[600px] relative">
					<FeedbackEditor {...attributes} setAttributes={setAttributes}/>
				</div>
			</div>
			<div className="mt-5 bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Feedback Historie</h3>
				<ActivityMap items={attributes.data.feedback} />
			</div>
		</div>
	);
}

