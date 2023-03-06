import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import Spinner from '../spinner';
import RecipeDatasheet from '../recipe_datasheet';
import FeedbackEditor from '../feedback_editor';
import routes from "../../models/routes";
import ActivityMap from "../activity_map";
import Modal from "../modal";
import headers from "../../modules/headers";

export default function Review(props) {
	const {user} = props;
	const params = useParams();
	
	const [formState, setFormState] = useState({});
	const [loading, setLoadingState] = useState(true);
	const [saving, setSavingState] = useState(false);
	
	const [confirmReleaseOpen, setConfirmReleaseOpen] = useState(false);
	const [infoExportOpen, setInfoExportOpen] = useState(true);
	const [exportState, setExportState] = useState({'message':'', 'status':''});
	
	// load data from db
	useEffect(() => {
		fetch(routes.getRecipeByUuid + params.uuid,{
			headers:headers.get()
		})
			.then(response => response.json())
			.then(data => {
				setFormState(data);
				setLoadingState(false);
			});
			
	}, []);
	
	const createFeedback = (value) => {
		let feedbackHistory = formState.feedback;
		
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
	
	const handleSubmit = (value) => {
		if(saving || loading) return;
		setSavingState(true);
		formState.feedback.push( createFeedback(value) )
		const feedback = formState.feedback;
		const data = {
			feedback,
			state: 'reviewed'
		};
	
		fetch(routes.updateRecipe + params.uuid + '/feedback', {
			method: 'PUT',
			cache: 'no-cache',
			headers:headers.get(),
			body: JSON.stringify(data),
		})
			.then(response => response.json())
			.then(data => {
				setSavingState(false);
				//@todo give a notice on success
			}).catch(function(error) {
			// do error handling
			//@todo give a notice on error
			console.log(error);
			setSavingState(false);
		});
	};
	
	// export
	const handleRelease = () => {
		if(saving || loading) return;
		setSavingState(true);
		const route = routes.exportRecipe.replace('{id}', params.uuid);
		
		fetch(route, {
			method: 'PUT',
			cache: 'no-cache',
			headers:headers.get()
			})
			.then((response) => {
				return new Promise((resolve) => response.json()
					.then((json) => resolve({
						status: response.status,
						ok: response.ok,
						json,
					})));
			}).then(({ status, json, ok }) => {
			setExportState({
				message: json.message,
				status
			});
			setInfoExportOpen(true);
			setSavingState(false);
		});
	};
	
	if(loading){
		return (
			<div className="bg-white px-4 py-12 shadow sm:rounded-lg  h-full">
				<Spinner />
			</div>
		);
	}
	
	const ReleaseButton = saving ? <button
		disabled
		type="button"
		className="col-span-12 ml-3 mt-4 inline-flex justify-center gap-x-3 rounded-md border border-transparent bg-neutral-400 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 inline-flex items-center"
	><Spinner/> Speichert..</button> : <button
		type="button"
		className="col-span-12 ml-3 mt-4 inline-flex justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-orange-600 hover:border-orange-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
		onClick={()=>setConfirmReleaseOpen(true)}
	>Rezepte freigeben</button>;
	
	return (
		
		<div className="py-6">
			
			<div className="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8">
				<main className="xs:col-span-12 sm:col-span-6 xl:col-span-6 space-y-4 mb-4">
					{formState.state === 'published' &&
						<div className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
							<svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg"
							     viewBox="0 0 20 20">
								<path
									d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/>
							</svg>
							<p>Dieses Rezept wurde bereits <a className="underline decoration-dashed" href={formState.link} target="_blank">veröffentlicht</a>!</p>
						</div>
					}
					<RecipeDatasheet data={formState} />
					<div className="space-y-4">
						<h3 className="text-lg font-medium leading-6 text-gray-900">Feedback Historie</h3>
						<ActivityMap items={formState.feedback} />
					</div>
				</main>
				{formState.state !== 'published' &&
					<aside className="xs:col-span-12 sm:col-span-6 xl:col-span-6 xs:block">
						<div className="sticky top-6">
							<FeedbackEditor formState={formState} onSubmit={handleSubmit} saving={saving}/>
						</div>
					</aside>
				}
			</div>
			{formState.state !== 'published' &&
				<div className="mx-auto my-8 max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8">
					<hr className="h-px bg-gray-400 border-0 col-span-12"/>
					{ReleaseButton}
					<Modal
						message={'Rezept wirklich freigeben? Dies kann <strong>nicht</strong> rückgängig gemacht werden'}
						isOpen={confirmReleaseOpen}
						onClose={()=>setConfirmReleaseOpen(false)}
						name="modalReleaseConfirm"
						onConfirm={()=>{setConfirmReleaseOpen(false);handleRelease();}}/>
				</div>
			}
			{
				exportState.status === 200 &&
				<Modal
					message={exportState.message}
					isOpen={infoExportOpen}
					onClose={()=>setInfoExportOpen(false)}
					name="modalExportInfo"
					confirmText=""
					cancelText="Ok"
					title="Export erfolgreich!"
				/>
			}
			
			{
				exportState.status !== 200 && exportState.status !== '' &&
				<Modal
					message={exportState.message}
					isOpen={infoExportOpen}
					onClose={()=>setInfoExportOpen(false)}
					name="modalExportInfo"
					confirmText=""
					cancelText="Schließen"
					title="Es ist ein Fehler aufgetreten"
				/>
			}
			
		</div>
	);

}