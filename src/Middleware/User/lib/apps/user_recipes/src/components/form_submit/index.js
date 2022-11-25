import React from "react";
import Spinner from '../spinner';

export default function Submit(props) {
	const {
		saving,
		formState,
		setFormState
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
	
	const SubmitButton = saving ? <button
		disabled
		type="submit"
		className="ml-3
		inline-flex
		justify-center
		gap-x-3
		rounded-md border
		border-transparent
		bg-neutral-400
		px-4 py-2
		text-sm
		font-medium
		text-white
		shadow-sm
		focus:outline-none
		focus:ring-2
		focus:ring-indigo-500
		focus:ring-offset-2
		inline-flex items-center
		"
	>
		<Spinner />  Speichert..
	</button> :
		<button
			type="submit"
			className="ml-3
		inline-flex
		justify-center
		rounded-md border
		border-transparent
		bg-orange-600
		px-4 py-2
		text-sm
		font-medium
		text-white
		shadow-sm
		hover:bg-white
		hover:text-orange-600
		hover:border-orange-600
		focus:outline-none
		focus:ring-2
		focus:ring-indigo-500
		focus:ring-offset-2"
		>
			Absenden
		</button>
	;
	
	return (
	<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
		<div className="md:grid md:grid-cols-4 md:gap-6">
			<div className="md:col-span-1">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Rezept einreichen</h3>
				<p className="mt-1 text-sm text-gray-500">Wir prüfen dein Rezept und geben dir Feedback. Sobald wir dein Rezept annehmen, erhältst du von uns einen Gutschein für den Grillfürst-Shop.</p>
			</div>
			<div className="mt-5 space-y-6 md:col-span-3 md:mt-0">
				<fieldset>
					<legend className="sr-only">By Email</legend>
					<div className="text-base font-medium text-gray-900" aria-hidden="true">
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
									className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
									checked={legal_rights}
									onChange={handleLegalRights}
								/>
							</div>
							<div className="ml-3 text-sm">
								<label htmlFor="legals" className="font-medium text-gray-700">
									Rechteabtretung
								</label>
								<p className="text-gray-500">Du bestätigst, alle Rechte an dem Rezept und den Bildern zu besitzen und trittst diese an uns ab.</p>
							</div>
						</div>
						<div className="flex items-start">
							<div className="flex h-5 items-center">
								<input
									id="newsletter"
									name="newsletter"
									type="checkbox"
									className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
									checked={newsletter}
									onChange={handleNewsletter}
								/>
							</div>
							<div className="ml-3 text-sm">
								<label htmlFor="newsletter" className="font-medium text-gray-700">
									Newsletteranmeldung
								</label>
								<p className="text-gray-500">Manche Rezepte stellen wir in unserem Newsletter vor - nicht verpassen!</p>
							</div>
						</div>
					</div>
				</fieldset>
			</div>
		</div>
		<div className="flex justify-end">
			{SubmitButton}
		</div>
	</div>
	)
}