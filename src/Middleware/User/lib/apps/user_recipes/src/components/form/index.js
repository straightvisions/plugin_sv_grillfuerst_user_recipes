import React, {useEffect, useState} from "react";
import Common from '../form_common';
import Ingredients from '../form_ingredients';
import Steps from '../form_steps';
import Submit from '../form_submit';
import Spinner from '../spinner';
import RecipeModel from '../../models/recipe';
import LocalStorage from "../local_storage";
import routes from "../../models/routes";
import { useParams } from "react-router-dom";

function dateIsValid(date) {
	return typeof date === 'object' && date !== null && typeof date.getTime === 'function' && !isNaN(date);
}

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
		fetch(routes.getRecipeByUuid + params.uuid)
			.then(response => response.json())
			.then(data => {
				const remoteTime = new Date(data.edited);
				const localTime = new Date(localStorage.edited);

				// it's new or local is not set yet
				if(	dateIsValid(remoteTime) === false || dateIsValid(localTime) === false ){
					setFormState(data);
					setLocalStorage(data);
					setLoadingState(false);
			
					return; // break
				}
			
				if ( remoteTime > localTime) {
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
		if(saving || loading) return;
		setSavingState(true);
		//@todo change rout in backend to match stateless route here
		
		fetch(routes.updateRecipe +  params.uuid, {
			method: 'PUT',
			cache: 'no-cache',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(formState),
		})
			.then(response => response.json())
			.then(data => {
				setSavingState(false);
			}).catch(function(error) {
				// do error handling
				console.log(error);
				setSavingState(false);
		});
	};
	
	// auto save
	const autoSave = setInterval(() => {
		if(loading || saving) return;
		clearInterval(autoSave);
		handleSubmit();
	}, 30000); // save all 30s
	
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
			<Ingredients formState={formState} setFormState={_setFormState} />
			<Steps formState={formState} setFormState={_setFormState} />
			<Submit saving={saving} formState={formState} setFormState={_setFormState} />
		</form>
	);
	
}