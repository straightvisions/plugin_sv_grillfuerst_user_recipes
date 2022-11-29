import React, { useEffect, useState } from "react";
import Step from "../step";

export default function Steps(props) {
	const {
		formState,
		setFormState
	} = props
	
	const {
		steps
	} = formState;
	
	// needs custom function to apply data to the right array item
	const setStep = (item) => {
		const newSteps = steps.map(step => { return step.id === item.id ? item : step; });
		setFormState({steps: newSteps});
	}
	
	const removeStep = (index) => {
		// filter out the item from list
		const newSteps = steps.filter((_, i) => i !== index);
		setFormState({steps: newSteps});
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
						{steps.map((item, i) => (
								<Step
									key={i+1}
									onChange={(item) => setStep(item)}
									onDelete={(index) => removeStep(index)}
									item={item}
									index={i}
									uuid={formState.uuid}
								/>
						))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}