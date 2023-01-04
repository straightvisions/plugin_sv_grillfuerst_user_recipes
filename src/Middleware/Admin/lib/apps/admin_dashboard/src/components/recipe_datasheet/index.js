import React, { useState } from "react";
import { PaperClipIcon } from '@heroicons/react/20/solid'

export default function RecipeDatasheet(props) {
	const [data, setData] = useState(props.data);
	
	const getImage = (image) => {
		return image.url ? <img src={image.url} /> : 'none';
	}
	
	const getSteps = () => {
		const _steps = data.steps;
		return 'steps...';
	};
	
	const getKitchenStyles = () => {
		const _kitchenStyles = data.kitchen_style;
		return 'kitchen...';
	}
	
	const getMenuTypes = () => {
		const _menuTypes = data.menu_type;
		return 'menu...';
	}
	
	const getIngredients = () => {
		const _menuTypes = data.ingredients;
		return 'ingredients...';
	}
	
	
	return (
		

		<div className="overflow-hidden bg-white shadow sm:rounded-lg">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Rezept Informationen</h3>
				<p className="mt-1 max-w-2xl text-sm text-gray-500">UUID: {data.uuid}</p>
				<p>{getImage(data.featured_image)}</p>
			</div>
			<div className="border-t border-gray-200 px-4 py-5 sm:p-0">
				<dl className="sm:divide-y sm:divide-gray-200">
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Titel</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data.title}</dd>
					</div>
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Kurzbeschreibung</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data.excerpt}</dd>
					</div>
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Personen</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data.servings}</dd>
					</div>
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Vorbereitungszeit</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data.perparation_time}</dd>
					</div>
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Menütyp</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{getMenuTypes()}</dd>
					</div>
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Küchenstil</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{getKitchenStyles()}</dd>
					</div>
					
					<div className="px-4 py-5 sm:px-6">
						<h3 className="text-lg font-medium leading-6 text-gray-900">Zutaten</h3>
						<p className="mt-1 max-w-2xl text-sm text-gray-500">...</p>
					</div>
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Zwiebeln...</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">1</dd>
					</div>
					
					<div className="px-4 py-5 sm:px-6">
						<h3 className="text-lg font-medium leading-6 text-gray-900">Schritte</h3>
						<p className="mt-1 max-w-2xl text-sm text-gray-500">...</p>
					</div>
					
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">1</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Text...</dd>
					</div>
					
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Attachments</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							<ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
								<li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
									<div className="flex w-0 flex-1 items-center">
										<PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
										<span className="ml-2 w-0 flex-1 truncate">resume_back_end_developer.pdf</span>
									</div>
									<div className="ml-4 flex-shrink-0">
										<a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
											Download
										</a>
									</div>
								</li>
								<li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
									<div className="flex w-0 flex-1 items-center">
										<PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
										<span className="ml-2 w-0 flex-1 truncate">coverletter_back_end_developer.pdf</span>
									</div>
									<div className="ml-4 flex-shrink-0">
										<a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
											Download
										</a>
									</div>
								</li>
							</ul>
						</dd>
					</div>
				</dl>
			</div>
			
		
			
		</div>
		
	)
}