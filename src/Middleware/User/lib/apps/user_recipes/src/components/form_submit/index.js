import React from "react";
import Spinner from '../spinner';
import {FireIcon, ArrowDownOnSquareIcon as SaveIcon} from '@heroicons/react/20/solid';

export default function Submit(props) {
	const {
		saving,
		formState,
		setFormState,
		onSubmit = () => {},
		onSave = () => {},
	} = props;
	
	const {
		legal_rights,
		newsletter
	} = formState;
	
	const handleNewsletter = () => {
		formState.newsletter = newsletter === 1 ? 0 : 1;
		setFormState(formState);
	};
	
	const handleLegalRights = () => {
		formState.legal_rights = legal_rights === 1 ? 0 : 1;
		setFormState(formState);
	};

	return (
		<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
			<div className="md:grid md:grid-cols-4 md:gap-6">
				<div className="md:col-span-1">
					<h3 className="text-lg font-bold leading-6 text-gray-900">Rezept einreichen</h3>
					<p className="mt-1 text-gray-500">Wir prüfen dein Rezept und geben dir Feedback. Sobald wir
						dein Rezept annehmen, erhältst du von uns einen Gutschein für den Grillfürst-Shop.</p>
				</div>
				<div className="mt-5 space-y-6 md:col-span-3 md:mt-0">
					<fieldset>
						<legend className="sr-only">By Email</legend>
						<div className="text-base font-bold text-gray-900" aria-hidden="true">
							Bitte bestätigen
						</div>
						<div className="mt-4 space-y-4">
							<div className="flex items-start">
								<div className="flex h-5 items-center">
									<input
										id="legals"
										name="legals"
										required="required"
										type="checkbox"
										checked={legal_rights}
										onChange={handleLegalRights}
									/>
								</div>
								<div className="ml-3">
									<label htmlFor="legals" className="font-bold cursor-pointer">
										Rechteabtretung
										<p className="text-gray-500 font-normal">Du bestätigst, alle Rechte an dem Rezept und den
											Bildern zu besitzen und trittst diese an uns ab.</p>
									</label>
									
								</div>
							</div>
						</div>
					</fieldset>
				</div>
			</div>
			<div className="flex justify-end">
				{saving ?
					<button
						disabled
						type="button"
						className="ml-3 btn"
					><Spinner width="4" height="4"/> Speichert..
					</button>:
					<button
						onClick={onSave}
						type="button"
						className="ml-3 btn"
					>
						<SaveIcon className="-ml-0.5 h-4 w-4 stroke-white" aria-hidden="true" />Nur speichern
					</button>
				}
				{saving ?
					<button
						disabled
						type="button"
						className="ml-3 btn"
					>
						<Spinner width="4" height="4"/> Speichert..
					</button> :
					<button
						type="button"
						onClick={onSubmit}
						className="ml-3 btn"
					>
						<FireIcon className="-ml-0.5 h-4 w-4 stroke-white" aria-hidden="true" /> Abschicken
					</button>
				}
		
			</div>
		</div>
	)
}