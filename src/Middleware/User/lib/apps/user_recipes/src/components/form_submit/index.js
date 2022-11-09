import React from "react";

export default function Example() {
	return (
	<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
		<div className="md:grid md:grid-cols-3 md:gap-6">
			<div className="md:col-span-1">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Rezept einreichen</h3>
				<p className="mt-1 text-sm text-gray-500">Wir prüfen dein Rezept und geben dir Feedback. Sobald wir dein Rezept annehmen, erhältst du von uns einen Gutschein für den Grillfürst-Shop.</p>
			</div>
			<div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
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
			<button
				type="submit"
				className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			>
				Absenden
			</button>
		</div>
	</div>
	)
}