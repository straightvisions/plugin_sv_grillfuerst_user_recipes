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
						By Email
					</div>
					<div className="mt-4 space-y-4">
						<div className="flex items-start">
							<div className="flex h-5 items-center">
								<input
									id="comments"
									name="comments"
									type="checkbox"
									className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
								/>
							</div>
							<div className="ml-3 text-sm">
								<label htmlFor="comments" className="font-medium text-gray-700">
									Comments
								</label>
								<p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
							</div>
						</div>
						<div className="flex items-start">
							<div className="flex h-5 items-center">
								<input
									id="candidates"
									name="candidates"
									type="checkbox"
									className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
								/>
							</div>
							<div className="ml-3 text-sm">
								<label htmlFor="candidates" className="font-medium text-gray-700">
									Candidates
								</label>
								<p className="text-gray-500">Get notified when a candidate applies for a job.</p>
							</div>
						</div>
						<div className="flex items-start">
							<div className="flex h-5 items-center">
								<input
									id="offers"
									name="offers"
									type="checkbox"
									className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
								/>
							</div>
							<div className="ml-3 text-sm">
								<label htmlFor="offers" className="font-medium text-gray-700">
									Offers
								</label>
								<p className="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
							</div>
						</div>
					</div>
				</fieldset>
				<fieldset>
					<legend className="contents text-base font-medium text-gray-900">Push Notifications</legend>
					<p className="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p>
					<div className="mt-4 space-y-4">
						<div className="flex items-center">
							<input
								id="push-everything"
								name="push-notifications"
								type="radio"
								className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
								Everything
							</label>
						</div>
						<div className="flex items-center">
							<input
								id="push-email"
								name="push-notifications"
								type="radio"
								className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
								Same as email
							</label>
						</div>
						<div className="flex items-center">
							<input
								id="push-nothing"
								name="push-notifications"
								type="radio"
								className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<label htmlFor="push-nothing" className="ml-3 block text-sm font-medium text-gray-700">
								No push notifications
							</label>
						</div>
					</div>
				</fieldset>
			</div>
		</div>
		<div className="flex justify-end">
			<button
				type="button"
				className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			>
				Cancel
			</button>
			<button
				type="submit"
				className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			>
				Save
			</button>
		</div>
	</div>
	)
}