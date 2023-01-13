import React, {useEffect, useState} from "react";
import Spinner from "../spinner";
import routes from "../../models/routes";

const difficultyValues =
	{
		easy: "leicht",
		medium: "mittel",
		difficult: "schwer",
	};


export default function RecipeDatasheet(props) {
	const [data, setData] = useState(props.data);
	
	const getImage = image => image.url && <img alt="" src={image.url}/> || 'Kein Bild gesetzt.';
	
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
	
	const Images = (props) => {
		const {items} = props;
		
		return (
			<>
				{items.length > 0 ? items.map(item =>
					<img key={item.filename} alt="" src={item.url}
					     className="transform-gpu transition duration-500 touch:scale-300 hover:scale-300"/>
				) : <i>Keine Bilder</i>
					
				}
			</>
		);
		
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
						<dt className="text-sm font-medium text-gray-500">Schwierigkeitsgrad</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{difficultyValues[data.difficulty] ? difficultyValues[data.difficulty]
						: data.difficulty
						}</dd>
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
							<div key={item.id} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
								<dt className="text-sm font-medium text-gray-500">{item.label}</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{item.amount} {item.unit}</dd>
							</div> :
							<div key={item.id} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
								<dt className="text-sm font-medium text-gray-500">{item.label}</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{item.amount} {item.unit}</dd>
								<dd className="mt-1 text-sm text-gray-900 sm:col-span-12 sm:mt-0"><i>{item.note}</i>
								</dd>
							</div>
						) : <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
							<dt className="text-sm font-medium text-gray-500"><i className="text-red-600">Nicht
								gesetzt.</i></dt>
						</div>
					}
					
					<div className="px-4 py-5 sm:px-6">
						<h3 className="text-lg font-medium leading-6 text-gray-900">Schritte</h3>
					</div>
					
					{data.steps.length > 0 ?
						data.steps.map(item =>
							<div key={item.order} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
								<dd className="grid grid-cols-6 mt-1 text-sm text-gray-900 sm:col-span-6 sm:mt-0">
									<div
										className="text-sm font-medium bg-blue-100 text-blue-800 mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{item.order}</div>
									<Images items={item.images}/>
								</dd>
								<dd className="mt-1 text-sm text-gray-900 sm:col-span-6 sm:mt-0">{item.description}</dd>
							</div>
						) : <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
							<dt className="text-sm font-medium text-gray-500"><i className="text-red-600">Nicht
								gesetzt.</i></dt>
						</div>
					}
				</dl>
			</div>
		</div>
	)
}