import React, {useEffect, useState} from "react";
import Common from '../common';
import Ingredients from '../ingredients';
import Steps from '../steps';
import Submit from '../submit';
import Spinner from '../spinner';
import RecipeModel from '../../models/recipe';
import LocalStorage from "../local_storage";
import routes from "../../models/routes";

import {
	useParams
} from "react-router-dom";
import headers from "../../modules/headers";

export default function Form(props) {
	const {user} = props;
	const params = useParams();
	const formStateSlug = 'formState' + params.uuid; // multiple tabs support anyone?
	const [localStorage, setLocalStorage] = LocalStorage(formStateSlug , {});
	const [formState, setFormState] = useState({});
	const [loading, setLoadingState] = useState(true);
	const [saving, setSavingState] = useState(false);
	// load data from db and check if newer than storage
	useEffect(() => {
		fetch(routes.getRecipeByUuid + params.uuid, {
				headers:headers.get()
			})
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
				
				setLoadingState(false);
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
	
	// manual save
	const handleSubmit = (e = null) => {
		if (e) e.preventDefault();
		if(saving) return;
		setSavingState(true);
		//@todo change rout in backend to match stateless route here
		fetch(routes.updateRecipe +  params.uuid + '/' + user.id, {
			method: 'PUT',
			cache: 'no-cache',
			headers:headers.get(),
			body: JSON.stringify(formState)
		})
			.then(response => response.json())
			.then(data => {
				setSavingState(false);
				console.log(data);
			});
	};
	
	// auto save
	/*
	setTimeout(function() {
		if (loading || saving) { return; } // abandon
		self._timer = setInterval(handleSubmit, 15000);
	}, 1000);*/
	
	if(loading){
		return (
			<div className="bg-white px-4 py-12 shadow sm:rounded-lg  h-full">
				<Spinner />
			</div>
		)
	}
	
	return (
		<form className="space-y-6" onSubmit={handleSubmit}>
			<Common formState={formState} setFormState={_setFormState} />
			<Submit saving={saving} formState={formState} setFormState={_setFormState} />
		</form>
	);
	
	/*
	
				<Common formState={formState} setFormState={_setFormState} />
			<Ingredients formState={formState} setFormState={_setFormState} />
			<Steps formState={formState} setFormState={_setFormState} />
	
	 */
	
}