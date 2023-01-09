import React, {useEffect, useState} from "react";
import {PaperClipIcon} from '@heroicons/react/20/solid'
import Spinner from "../spinner";
import routes from "../../models/routes";

export default function RecipeDatasheet(props) {
	const [data, setData] = useState(props.data);
	
	const getImage = image => image.url && <img src={image.url}/> || 'Kein Bild gesetzt.' ;
	
	const [kitchenStyles, setKitchenStyles] = useState(<Spinner/>);
	useEffect(() => {
		fetch(routes.getKitchenStyles).then(response => response.json()).then(res => {
			const _options = res.items.map(i => ({label: i.name, value: i.term_id})); // all items
			const _selection = _options.filter(i => data.kitchen_style.includes(i.value)); // filtered items
			const kitchenStyles = _selection.length > 0 ? _selection.reduce((acc, cur) => acc + cur.label + ', ', '').slice(0, -2) :
				<i className="text-red-600">Nicht ausgewählt.</i>;
			setKitchenStyles(kitchenStyles);
		});
	}, []);
	
	const [menuTypes, setMenuTypes] = useState(<Spinner/>);
	useEffect(() => {
		fetch(routes.getMenuTypes).then(response => response.json()).then(res => {
			const _options = res.items.map(i => ({label: i.name, value: i.term_id})); // all items
			const _selection = _options.filter(i => data.menu_type.includes(i.value)); // filtered items
			const menuTypes = _selection.length > 0 ? _selection.reduce((acc, cur) => acc + cur.label + ', ', '').slice(0, -2) :
				<i className="text-red-600">Nicht ausgewählt.</i>;
			setMenuTypes(menuTypes);
		});
	}, []);

	const getSteps = () => {
		const _steps = data.steps;
		return 'steps...';
	};
	
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
						<dt className="text-sm font-medium text-gray-500">Schwierigkeitsgrad</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data.difficulty}</dd>
					</div>
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Vorbereitungszeit</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data.preparation_time}</dd>
					</div>
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Kochzeit</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data.cooking_time}</dd>
					</div>
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Wartezeit</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data.waiting_time}</dd>
					</div>
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Menütyp</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{menuTypes}</dd>
					</div>
					<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Küchenstil</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{kitchenStyles}</dd>
					</div>
					
					<div className="px-4 py-5 sm:px-6">
						<h3 className="text-lg font-medium leading-6 text-gray-900">Zutaten</h3>
						<div className="mt-1 max-w-2xl text-sm text-gray-500"></div>
					</div>
					{data.ingredients.length > 0 ?
						data.ingredients.map(item => item.note === '' ?
							<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
								<dt className="text-sm font-medium text-gray-500">{item.label}</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{item.amount} {item.unit}</dd>
							</div> :
							<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
								<dt className="text-sm font-medium text-gray-500">{item.label}</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{item.amount} {item.unit}</dd>
								<dd className="mt-1 text-sm text-gray-900 sm:col-span-12 sm:mt-0"><i>{item.note}</i></dd>
							</div>
						) : <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
							<dt className="text-sm font-medium text-gray-500"><i className="text-red-600">Nicht gesetzt.</i></dt>
						</div>
					}
					
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
										<PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400"
										               aria-hidden="true"/>
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
										<PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400"
										               aria-hidden="true"/>
										<span
											className="ml-2 w-0 flex-1 truncate">coverletter_back_end_developer.pdf</span>
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