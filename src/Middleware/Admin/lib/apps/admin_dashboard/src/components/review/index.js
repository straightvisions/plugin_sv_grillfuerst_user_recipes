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
import Modal from "../modal";

export default function Review() {
	const params = useParams();
	
	const attributesModel = {
		data: {},      // Placeholder for the recipe data
		_data: {},     // Hidden backup of the recipe data
		customer: {},
		feedback: '',  // Placeholder for the feedback
		saving: false, // Flag indicating if the recipe is being saved
		submitting: false, // Flag indicating if the recipe is being submitted
		publishing: false, // Flag indicating if the recipe is being published
		deleting: false, // Flag indicating if the recipe is being deleted
		disabled: false,
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
		{...attributesModel ,...storage.get(storageSlug, attributesModel), ...{saving: false, loading: false, publishing: false}}
		);

	// local states
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [messageOpen, setMessageOpen] = useState(false);
	const [forcedEditing, setForcedEditing] = useState(false);
	const [refresh, setRefresh] = useState(false);
	
	// load customer data
	useEffect(() => {
		// customer not set -> wait
		if(!attributes.data.user_id) return;
		// customer already set -> skip
		if(Object.keys(attributes.customer).length) return;
		fetch(routes.getUserInfoById.replace('{id}', attributes.data.user_id),{
			method: 'GET',
			headers: headers.get(),
		})
			.then(response => response.json())
			.then(res => {
				//@todo implement error handling here
				if(res.status === 'success'){
					setAttributes({customer:res.data});
				}
				
			});
	}, [attributes.data.user_id]);
	
	// load data from db
	useEffect(() => {
		setLoading(true);
		//if(Object.keys(attributes.data).length === 0 || refresh){
			fetch(routes.getRecipeByUuid + params.uuid,{
				headers:headers.get(),
			})
				.then(response => response.json())
				.then(data => {
					// create a hidden backup of the data, might be useful later
					const _data = Object.keys(attributes._data).length <= 0 ? data : attributes._data;
					setAttributes({data, _data});
					setLoading(false);
					setRefresh(false);
				});
		/*}else{
			setLoading(false);
			setRefresh(false);
		}*/
	}, []);
	
	// handle form locking
	useEffect(() => {
		// override if forced editing is set
		if(forcedEditing) return setAttributes({disabled: false});
		
		if(attributes.data.state !== 'review_pending' || attributes.saving || attributes.submitting || attributes.publishing){
			setAttributes({disabled: true});
			//setRefresh(true);
		}else{
			setAttributes({disabled: false});
		}
	}, [attributes.data.state, attributes.saving, attributes.submitting, attributes.publishing, forcedEditing]);
	
	// add refresh stuff here
	const onSave = () => {
		if(attributes.saving) return;
		setForcedEditing(false);
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
	
	const onDelete = () => {
		if(!window.confirm("Wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!")){
			return;
		}

		if(attributes.deleting) return;
		setForcedEditing(false);
		setAttributes({deleting: true});
		
		
		fetch(routes.deleteRecipe + params.uuid, {
			method: 'DELETE',
			cache: 'no-cache',
			headers:headers.get()
		})
			.then(response => response.json())
			.then(data => {
				if(data.success === true){
					alert(data.message);
					window.location.href = routes.config.appURL;
				}else{
					alert(data.message);
					setAttributes({deleting: false});
				}
				
			}).catch(function(error) {
			// do error handling
			//@todo give a notice on error
			console.log(error);
			setAttributes({deleting: false});
		});
	}
	
	const onSubmit = () => {
		if(attributes.submitting) return;
		
		// prevent empty feedback additions
		const feedback = attributes.feedback.length <= 0 ? attributes.data.feedback : [...attributes.data.feedback, ...[createFeedback(attributes.feedback)]]
		let data = {...attributes.data, ...{state: 'reviewed', feedback}};
		
		// empty feedback storage
		setForcedEditing(false);
		setAttributes({data, feedback: '', submitting: true});
		
		fetch(routes.updateRecipe + params.uuid + '/feedback', {
			method: 'PUT',
			cache: 'no-cache',
			headers:headers.get(),
			body: JSON.stringify(data),
		})
			.then(response => response.json())
			.then(res => {
				setAttributes({submitting: false});
				//setRefresh(true);
			}).catch(function(error) {
			// do error handling
			//@todo give a notice on error
			console.log(error);
			setAttributes({submitting: false});
		});
	}
	
	const onPublish = () => {
		if (attributes.publishing) return;
		
		// check if recipe is valid
		if( hasCustomIngredients() ){
			setMessage('<strong>Veröffentlichung nicht möglich! Custom Zutaten vorhanden.</strong>');
			setMessageOpen(true);
			return;
		}
		
		setForcedEditing(false);
		setAttributes({publishing: true});
		const route = routes.exportRecipe.replace('{id}', params.uuid);
		
		fetch(route, {
			method: 'PUT',
			cache: 'no-cache',
			headers: headers.get()
		})
		.then((response) => {
			return new Promise((resolve) => response.json()
				.then((json) => resolve({
					status: response.status,
					ok: response.ok,
					json,
				})));
		}).then(({status, json, ok}) => {
			if(ok){
				// export ok
				setAttributes({data: {...attributes.data, ...{state: 'published', link: json.link}}});
				setMessage(json.message
					+ '<br />Link: <a class="text-red-500" target="_blank" href="' + json.link + '" target="_blank">' + json.link + '</a>');
			}else{
				// export error
				setMessage(json.message
					+ '<br />Errors: ' + json.errors.join('<br />'));
			}
		}).finally(() => {
			setAttributes({publishing: false});
			setMessageOpen(true);
		});
	}
	
	const hasCustomIngredients = () => {
		let hasCustomIngredients = false;
		attributes.data.ingredients.forEach((ingredient) => {
			if(ingredient.custom){
				hasCustomIngredients = true;
			}
		});
		return hasCustomIngredients;
	}
	
	const createFeedback = (value) => {
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
			{message &&
				<Modal
					message={message}
					isOpen={messageOpen}
					onClose={() => setMessageOpen(false)}
					onConfirm={() => setMessageOpen(false)}
					confirmText='Ok'
					cancelText=''
					name="modalMessage"
					/>
			}
			<ReviewToolbar {...attributes} setAttributes={setAttributes} forcedEditing={forcedEditing} setForcedEditing={setForcedEditing} refreshing={refresh} onSave={onSave} onSubmit={onSubmit} onPublish={onPublish} onRefresh={()=>setRefresh(true)} onDelete={onDelete}/>
			<div className="flex gap-5 w-full max-w-full">
				<div className="flex-grow">
					<ReviewRecipeForm {...attributes} setAttributes={setAttributes} />
				</div>
				<div className="w-full max-w-[400px] relative">
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

