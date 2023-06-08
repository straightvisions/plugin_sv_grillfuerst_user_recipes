import React, { useEffect, useState } from "react";
import Step from "../step";
import stepModel from "../../models/step";
import Dropdown from "../dropdown";
import ingredientUnitValues from "../../models/ingredient/units";
import {IconTrash} from "../icons";

export default function Steps(props) {
	const {
		formState,
		setFormState
	} = props
	
	const [steps, setSteps] = useState(formState.steps);
	
	const [orderedSteps, setOrderedSteps] = useState(steps.sort((a, b) => a.order - b.order));
	
	// needs custom function to apply data to the right array item
	const setStep = (index, item) => {
		steps[index] = item;
		
		// order
		const _steps = steps.sort((a, b) => a.order - b.order);
		
		setFormState({steps: _steps});
		setSteps(_steps);
	}

	const addStep = () =>{
		const step = { ...stepModel, order: steps.length + 1};
		steps.push(step);
		setFormState({steps: steps});
		setSteps(steps);
	}
	
	const removeStep = (index) => {
		// filter out the item from list
		steps.splice(index, 1);
		setFormState({steps: steps});
		setSteps(steps);
	}
	
	// -1
	const handleChangeOrderUp = (index, item) => {
		item.order = item.order > 1 ? item.order -1 : item.order;
		steps[index] = item;
		
		if(steps[index - 1]){
			steps[index - 1].order = steps[index - 1].order + 1;
		}
		
		const _steps = steps.sort((a, b) => a.order - b.order);
		setFormState({steps: _steps});
		setSteps(_steps);
	}
	
	// +1
	const handleChangeOrderDown = (index, item) => {
		item.order = item.order < steps.length ? item.order + 1 : item.order;
		steps[index] = item;
		
		if(steps[index + 1]){
			steps[index + 1].order = steps[index + 1].order - 1;
		}
		
		const _steps = steps.sort((a, b) => a.order - b.order);
		setFormState({steps: _steps});
		setSteps(_steps);
	}
	
	return (
		<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
			<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
				<div className="col-span-1">
					<h3 className="text-lg font-bold leading-6 text-gray-900">Schritte</h3>
					<p className="mt-1 text-gray-500">Hier kannst du alle Zubereitungsschritte eingeben. Achte dabei bitte auf die korrekte Reihenfolge und passende Bilder.</p>
					<div className="col-span-6 sm:col-span-4 my-4">
						<button
							onClick={addStep}
							type="button"
							className="btn"
						>
							Schritt hinzufügen
						</button>
					</div>
				</div>
				<div className="mt-5 col-span-1 xl:col-span-3 md:mt-0 overflow-x-auto">
					{ /* header ---------------------------------------------------- */ }
					<div className="flex flex-auto bg-gray-50 pt-4 pb-4">
						<span className="w-full lg:w-1/12 px-2 whitespace-nowrap overflow-hidden font-semibold hidden md:block">Schritt</span>
						<span className="w-full lg:w-4/12 px-2 whitespace-nowrap overflow-hidden font-semibold hidden md:block">Bild</span>
						<span className="w-full lg:w-6/12 px-2 whitespace-nowrap overflow-hidden font-semibold hidden md:block">Beschreibung</span>
						<span className="w-full lg:w-1/12 px-2 whitespace-nowrap overflow-hidden font-semibold hidden md:block"></span>
					</div>
					
					{ /* body ---------------------------------------------------- */ }
					<div className="flex flex-col flex-auto pt-4 pb-4 gap-4 overflow-hidden">
						{orderedSteps.map((item, i) => {
							return (
								<Step
									key={i}
									onChange={(i, _item) => setStep(i, _item)}
									onChangeOrderUp={() => handleChangeOrderUp(i, item)}
									onChangeOrderDown={() => handleChangeOrderDown(i, item)}
									onDelete={() => removeStep(i)}
									item={item}
									index={i}
									uuid={formState.uuid}
									formState={formState}
								/>
							)})}
					</div>
					{ /* footer ---------------------------------------------------- */ }
				</div>
			</div>
		</div>
	)
}