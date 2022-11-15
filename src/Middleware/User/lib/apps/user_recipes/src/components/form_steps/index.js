import React, { useEffect } from "react";
import Image from "../form_image";
import LocalStorage from '../local_storage';

export default function Steps(props) {
	const [steps, setSteps] = LocalStorage("steps", props.formState.steps);
	
	// push change to parent state
	useEffect(() => {
		props.formState.steps = steps;
		props.setFormState(props.formState);
	}, [steps, props.setFormState]);
	
	// needs custom function to apply data to the right array item
	const setStep = (item) => {
		
		const newSteps = steps.map(step => {
			if (step.id === item.id) {
				return item;
			}
		});
		
		setSteps(newSteps);
	}
	
	const removeStep = (index) => {
		// filter out the item from list
		const newSteps = steps.filter((_, i) => i !== index);
		setSteps(newSteps);
	}
	
	return (
		<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
			<div className="md:grid md:grid-cols-4 md:gap-6">
				<div className="md:col-span-1">
					<h3 className="text-lg font-medium leading-6 text-gray-900">Schritte</h3>
					<p className="mt-1 text-sm text-gray-500">Gib alle Zubereitungsschritte ein.</p>
					<div className="col-span-6 sm:col-span-4 my-4">
						<button
							className="relative inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-orange-600 hover:border-orange-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Schritt hinzufügen
						</button>
					</div>
				</div>
				<div className="mt-5 md:col-span-3 md:mt-0 overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-300">
						<thead className="bg-gray-50">
						<tr>
							<th scope="col"
								className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
								Schritt
							</th>
							<th scope="col"
								className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
								Bild
							</th>
							<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
								Beschreibung
							</th>
							<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
								<span className="sr-only">Löschen</span>
							</th>
						</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white" id="gf_recipe_steps">
						{steps.map((step, index) => (
							<tr key={step.id}>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
									<div className="bg-black text-white p-3 rounded-full w-10 h-10 font-bold text-center cursor-pointer">{index+1}</div>
								</td>
								<td className="h-72 rounded-md overflow-hidden whitespace-nowrap py-4 text-sm font-medium text-gray-900">
									<Image props={step.image} />
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-full">
							<textarea
								rows={12}
								className="min-w-max block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								placeholder="Die leckersten Grillspieße..."
								defaultValue={step.description}
							/>
								</td>
								<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
									<button
										onClick={() => removeStep(index)}
										type="button"
										className="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
											 strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
											<path strokeLinecap="round" strokeLinejoin="round"
												  d="M6 18L18 6M6 6l12 12"/>
										</svg>
										<span className="sr-only">Schritt {index+1} Entfernen</span>
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}