import React, {useEffect, useState} from "react";
import { useInterval } from 'usehooks-ts'
import Common from '../form_common';
import Ingredients from '../form_ingredients';
import Accessories from '../form_accessories';
import Steps from '../form_steps';
import Submit from '../form_submit';
import Spinner from '../spinner';
import routes from "../../models/routes";
import { useParams } from "react-router-dom";
import { AlertReviewed, AlertReviewPending, AlertPublished } from '../form_alerts';
import RecipeDatasheet  from '../recipe_datasheet';
import storage from "../../modules/storage";

function dateIsValid(date) {
	return typeof date === 'object' && date !== null && typeof date.getTime === 'function' && !isNaN(date);
}

export default function Form(props) {
	const {user} = props;
	const params = useParams();
	const [formState, setFormState] = useState({});
	const [loading, setLoadingState] = useState(true);
	const [saving, setSavingState] = useState(false);
	
	// load data from db and check if newer than storage
	useEffect(() => {
		fetch(routes.getRecipeByUuid + params.uuid,{
			headers: {
				'Authorization': 'Bearer ' + storage.get('token'),
			}
		})
			.then(response => response.json())
			.then(data => {
				setFormState(data);
			}).finally(() => {
			setLoadingState(false);
		});;
			
	}, []);
	
	useEffect(()=>{
		if(formState.state === 'review_pending'){
			handleSave();
		}
	},[formState]);

	// update storage on formState change
	// somehow useEffect doesn't work here
	const _setFormState = (state) => {
		state.edited = new Date();
		state = {...formState, ...state};
		setFormState(state);
	};
	
	// manual save
	const handleSave = () => {
		if(formState.state === 'review_pending' || formState.state === 'published') return;
		if(saving || loading) return;
		setSavingState(true);
		//@todo change route in backend to match stateless route here
		
		fetch(routes.updateRecipe +  params.uuid, {
			method: 'PUT',
			cache: 'no-cache',
			headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + storage.get('token')},
			body: JSON.stringify(formState),
		})
			.then(response => response.json())
			.then(data => {
				//@todo give a notice on success
			}).finally(() => {
			setSavingState(false);
		});
	};
	
	const handleSubmit = () => {
		_setFormState({state: 'review_pending'});
	}
	
	// auto save
	useInterval(() => {
		handleSave();
	}, 20000);
	
	if(loading){
		return (
			<div className="bg-white px-4 py-12 shadow sm:rounded-lg  h-full">
				<Spinner />
			</div>
		)
	}
	
	const getAlerts = () => {
		if(formState.state === 'review_pending'){
			return (
				<AlertReviewPending />
			)
		}
		
		if(formState.state === 'published'){
			return (
				<AlertPublished {...formState} />
			)
		}
		
		if(formState.state === 'reviewed'){
			return (
				<AlertReviewed {...formState} />
			)
		}
	}
	
	return (
		<>
			{getAlerts()}
			<form className="space-y-6 relative">
				
				{(formState.state === 'review_pending' || formState.state === 'published') && (
					<div className="z-10 absolute top-0 left-0 h-full w-full bg-gray-500 opacity-20 flex items-start justify-end">
						<p className="text-red-900 font-bold p-2">Die Bearbeitung ist derzeit gesperrt.</p>
					</div>
				)}
				<Common formState={formState} setFormState={_setFormState} />
				<Ingredients formState={formState} setFormState={_setFormState} />
				<Accessories formState={formState} setFormState={_setFormState} />
				<Steps formState={formState} setFormState={_setFormState} />
				<Submit saving={saving} formState={formState} setFormState={_setFormState} onSave={handleSave} onSubmit={handleSubmit}/>
			</form>
		</>
	);

	
}