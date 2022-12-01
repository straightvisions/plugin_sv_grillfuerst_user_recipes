import React, { useEffect, useState } from "react";
import Step from "../step";
import stepModel from "../../models/step";

export default function Steps(props) {
	const {
		formState,
		setFormState
	} = props
	
	let {steps} = formState;
	
	// needs custom function to apply data to the right array item
	const setStep = (index, item) => {
		steps[index] = item;
		setFormState({steps: steps});
	}
	
	const addStep = () =>{
		const step = { ...stepModel, order: steps.length + 1};
		steps.push(step);
		setFormState({steps: steps});
	}
	
	
	const removeStep = (index) => {
		// filter out the item from list
		steps.splice(index, 1);
		setFormState({steps: steps});
	}

	
	return (
		<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
			<div className="md:grid md:grid-cols-4 md:gap-6">
				<div className="md:col-span-1">
					<h3 className="text-lg font-medium leading-6 text-gray-900">Schritte</h3>
					<p className="mt-1 text-sm text-gray-500">Gib alle Zubereitungsschritte ein.</p>
					<div className="col-span-6 sm:col-span-4 my-4">
						<button
							onClick={addStep}
							type="button"
							className="relative inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-orange-600 hover:border-orange-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Schritt hinzufügen
						</button>
					</div>
				</div>
				<div className="mt-5 md:col-span-3 md:mt-0 overflow-x-auto">
					<table className="w-full divide-y divide-gray-300">
						<thead className="bg-gray-50 font-semibold text-left text-gray-900 text-sm">
						<tr>
							<th scope="col"
								className="px-4 py-3.5 sm:px-6">
								Schritt
							</th>
							<th scope="col"
								className="min-w-[300px] px-4 py-3.5 sm:px-6">
								Bild
							</th>
							<th scope="col" className="min-w-[300px] px-4 py-3.5 sm:px-6">
								Beschreibung
							</th>
							<th scope="col" className="px-4 py-3.5 sm:px-6">
								<span className="hidden sr-only">Löschen</span>
							</th>
						</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white" id="gf_recipe_steps">
						{steps.map((item, i) => (
								<Step
									key={i}
									onChange={(i, _item) => setStep(i, _item)}
									onDelete={() => removeStep(i)}
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