import React, {useEffect, useState} from "react";
import Image from '../form_image';

export default function Common(props) {
	const {
		formState,
		setFormState
	} = props;
	
	const {
		title,
		excerpt,
		featured_image
	} = formState;
	
	return (
			<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
				<div className="md:grid md:grid-cols-4 md:gap-6">
					<div className="md:col-span-1">
						<h3 className="text-lg font-medium leading-6 text-gray-900">Allgemeines</h3>
						<p className="mt-1 text-sm text-gray-500">
							Bearbeite hier die Basisinformationen zu deinem Rezept.
						</p>
					</div>
					<div className="mt-5 space-y-6 md:col-span-3 md:mt-0">
						<div className="col-span-3 sm:col-span-2">
							<label htmlFor="recipe_title" className="block text-sm font-medium text-gray-700">
								Titel
							</label>
							<div className="mt-1 flex rounded-md shadow-sm">
								<input
									value={title}
									type="text"
									name="title"
									id="title"
									className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									placeholder="Leckere Grillspieße"
									onChange={(e)=>setFormState({title: e.target.value})}
								/>
							</div>
						</div>
						
						<div>
							<label htmlFor="recipe_excerpt" className="block text-sm font-medium text-gray-700">
								Zusammenfassung
							</label>
							<div className="mt-1">
								<textarea
									id="recipe_excerpt"
									rows={3}
									className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									placeholder="Die leckersten Grillspieße..."
									value={excerpt}
									onChange={(e)=>setFormState({excerpt: e.target.value})}
								/>
							</div>
							<p className="mt-2 text-sm text-gray-500">Eine knackige Zusammenfassung oder Einführung in dein Rezept.</p>
						</div>
						
						<div className="h-200 rounded-md overflow-hidden">
							<label className="block text-sm font-medium text-gray-700">Hauptbild</label>
							<Image props={featured_image} />
						</div>
						
						<div className="md:grid md:grid-cols-3 md:gap-6">
							<div className="mb-5">
								<label htmlFor="recipe_menu_type" className="block text-sm font-medium text-gray-700">
									Menüart
								</label>
								<div className="mt-1 flex rounded-md shadow-sm">
									<select
										id="recipe_menu_type"
										name="recipe_menu_type"
										className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									>
										<option value="594">Beilage</option>
										<option>...</option>
										<option>...</option>
									</select>
								</div>
							</div>
							<div className="mb-5">
								<label htmlFor="recipe_kitchen_style" className="block text-sm font-medium text-gray-700">
									Küchenstil
								</label>
								<div className="mt-1 flex rounded-md shadow-sm">
									<select
										id="recipe_kitchen_style"
										name="recipe_kitchen_style"
										className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									>
										<option value="585">Fisch</option>
										<option>...</option>
										<option>...</option>
									</select>
								</div>
							</div>
							<div className="mb-5">
								<label htmlFor="recipe_difficulty" className="block text-sm font-medium text-gray-700">
									Schwierigkeit
								</label>
								<div className="mt-1 flex rounded-md shadow-sm">
									<select
										id="recipe_difficulty"
										name="recipe_difficulty"
										className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									>
										<option value="easy ">leicht</option>
										<option value="medium">mittel</option>
										<option value="difficult">schwer</option>
									</select>
								</div>
							</div>
						</div>
						
						<div className="md:grid md:grid-cols-3 md:gap-6">
							<div className="mb-5">
								<label htmlFor="recipe_preparation_time" className="block text-sm font-medium text-gray-700">
									Vorbereitungszeit
								</label>
								<div className="mt-1 flex rounded-md shadow-sm">
									<input
										type="number"
										name="recipe_preparation_time"
										id="recipe_preparation_time"
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										placeholder="0"
									/>
								</div>
							</div>
							<div className="mb-5">
								<label htmlFor="recipe_cooking_time" className="block text-sm font-medium text-gray-700">
									Kochzeit
								</label>
								<div className="mt-1 flex rounded-md shadow-sm">
									<input
										type="number"
										name="recipe_cooking_time"
										id="recipe_cooking_time"
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										placeholder="0"
									/>
								</div>
							</div>
							<div className="mb-5">
								<label htmlFor="recipe_waiting_time" className="block text-sm font-medium text-gray-700">
									Wartezeit
								</label>
								<div className="mt-1 flex rounded-md shadow-sm">
									<input
										type="number"
										name="recipe_waiting_time"
										id="recipe_waiting_time"
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										placeholder="0"
									/>
								</div>
							</div>
						</div>
					
					</div>
				</div>
			</div>
	)
}