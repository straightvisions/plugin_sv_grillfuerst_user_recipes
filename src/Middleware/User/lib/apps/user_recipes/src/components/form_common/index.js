import React, { useState, useEffect } from "react";

export default function Common() {
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
									type="text"
									name="recipe_title"
									id="recipe_title"
									className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									placeholder="Leckere Grillspieße"
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
									defaultValue={''}
								/>
							</div>
							<p className="mt-2 text-sm text-gray-500">Eine knackige Zusammenfassung oder Einführung in dein Rezept.</p>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700">Hauptbild</label>
							<div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
								<div className="space-y-1 text-center">
									<svg
										className="mx-auto h-12 w-12 text-gray-400"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 48 48"
										aria-hidden="true"
									>
										<path
											d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									<div className="flex text-sm text-gray-600">
										<label
											htmlFor="recipe_featured_image"
											className="relative cursor-pointer rounded-md bg-white font-medium text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
										>
											<span>Bild hochladen</span>
											<input id="recipe_featured_image" name="recipe_featured_image" type="file" className="sr-only" />
										</label>
										<p className="pl-1">oder per Drag & Drop ablegen</p>
									</div>
									<p className="text-xs text-gray-500">PNG oder JPG</p>
								</div>
							</div>
						</div>
						
						<div className="md:grid md:grid-cols-3 md:gap-6">
							<div className="mb-5">
								<label htmlFor="recipe_menu_type" className="block text-sm font-medium text-gray-700">
									Menü Art
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