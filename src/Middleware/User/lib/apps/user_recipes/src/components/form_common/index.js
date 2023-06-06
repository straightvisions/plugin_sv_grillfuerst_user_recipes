import React, {useEffect, useState} from 'react';
import Image from '../form_image';
import Dropdown from '../dropdown/';
import MultiSelect from '../multi_select/';
import {
	IconPot,
	IconClock,
	IconClockFire,
	IconMeter,
	IconCutlery,
	IconGrill,
} from '../icons/';
import routes from '../../models/routes';
import Spinner from '../spinner';
import storage from '../../modules/storage';

const difficultyValues = [
	{
		label : "leicht",
		value : "easy",
	},
	{
		label : "mittel",
		value : "medium",
	},
	{
		label : "schwer",
		value : "difficult",
	},
	
];


export default function Common(props) {
	const {
		formState,
		setFormState,
		userId
	} = props;
	
	const {
		title,
		excerpt,
		featured_image,
		preparation_time,
		cooking_time,
		waiting_time,
		difficulty,
	} = formState;
	
	// MENU TYPES -----------------------------------------------------------------------------------------------------
	// MENU TYPES -----------------------------------------------------------------------------------------------------
	// MENU TYPES -----------------------------------------------------------------------------------------------------
	// data
	const {menu_type: menuTypes} = formState;
	const [loadingMenuTypes, setLoadingMenuTypesState] = useState(true);
	const [menuTypeOptions, setMenuTypeOptions] = useState([]); // data from db
	const [menuTypeOptionsSelected, setMenuTypeOptionsSelected] = useState([]); // data from db
	
	// element
	const MenuTypesSelect = loadingMenuTypes ? <Spinner /> :
		<MultiSelect
			className="flex-auto max-w-full"
			style={{maxWidth: 'calc(100% - 59px)'}}
			label={"Art des Gerichts"}
			selected={menuTypeOptionsSelected}
			options={menuTypeOptions}
			onChange={selection => setFormState({menu_type: selection})} />;
	
	// async call
	useEffect( () => {
		fetch(routes.getMenuTypes,{
			headers: {
				'Authorization': 'Bearer ' + storage.get('token'),
			},
		})
			.then(response => response.json())
			.then(data => {
				// reduced given object items
				const _options = data.items.map(i => { return { label: i.name, value: i.term_id }; }); // all items
				const _selection = _options.filter(i => menuTypes.includes(i.value)); // filtered items
				
				setMenuTypeOptions(_options);
				setMenuTypeOptionsSelected(_selection);
			}).finally(() => {
			setLoadingMenuTypesState(false);
		});
	}, []); // if deps are an empty array -> effect runs only once
	// MENU TYPES -----------------------------------------------------------------------------------------------------
	// MENU TYPES -----------------------------------------------------------------------------------------------------
	// MENU TYPES -----------------------------------------------------------------------------------------------------
	// KITCHEN STYLES -------------------------------------------------------------------------------------------------
	// KITCHEN STYLES -------------------------------------------------------------------------------------------------
	// KITCHEN STYLES -------------------------------------------------------------------------------------------------
	// data
	
	const {kitchen_style: kitchenStyles} = formState;
	const [loadingKitchenStyles, setLoadingKitchenStylesState] = useState(true);
	const [kitchenStyleOptions, setKitchenStyleOptions] = useState([]); // data from db
	const [kitchenStyleOptionsSelected, setKitchenStyleOptionsSelected] = useState([]); // data from db
	
	// element
	// element
	const KitchenStylesSelect = loadingKitchenStyles ? <Spinner /> :
		<MultiSelect
			className="flex-auto"
			style={{maxWidth: 'calc(100% - 59px)'}}
			label={"Kategorie"}
			selected={kitchenStyleOptionsSelected}
			options={kitchenStyleOptions}
			onChange={selection => setFormState({kitchen_style: selection})} />;
	
	// async call
	useEffect( () => {
		fetch(routes.getKitchenStyles,{
			headers: {
				'Authorization': 'Bearer ' + storage.get('token'),
			},
		})
			.then(response => response.json())
			.then(data => {
				// reduced given object items
				const _options = data.items.map(i => { return { label: i.name, value: i.term_id }; }); // all items
				const _selection = _options.filter(i => kitchenStyles.includes(i.value)); // filtered items
				
				setKitchenStyleOptions(_options);
				setKitchenStyleOptionsSelected(_selection);
			}).finally(() => {
			setLoadingKitchenStylesState(false);
		});
	}, []); // if deps are an empty array -> effect runs only once
	
	// KITCHEN STYLES -------------------------------------------------------------------------------------------------
	// KITCHEN STYLES -------------------------------------------------------------------------------------------------
	// KITCHEN STYLES -------------------------------------------------------------------------------------------------
	
	const handleImageUpload = (files) => {
		if(formState.state === 'review_pending' || formState.state === 'published') return;
		formState.featured_image = files[0];
		setFormState(formState);
	}
	
	const handleImageDelete = (image) => {
		if(formState.state === 'review_pending' || formState.state === 'published') return;
		formState.featured_image = {};
		setFormState(formState);
	}
	
	// conditional
	const Difficulties = <Dropdown className="flex-auto" label={"Schwierigkeitsgrad"} value={difficulty} items={difficultyValues} onChange={val => setFormState({difficulty: val})}/>;
	
	return (
			<div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
				<div className="md:grid md:grid-cols-4 md:gap-8">
					<div className="md:col-span-1">
						<h3 className="text-lg font-bold leading-6 text-gray-900">Allgemeines</h3>
						<p className="mt-1 text-gray-500">
							Bitte trage die Kerninformationen zu deinem Rezept ein und lade ein passendes Hauptbild hoch.<br/>Die korrekte Kategorisierung des Rezeptes ist später wichtig für die Suche und die Filter, versuche daher bitte möglichste genau zu sein.
						</p>
					</div>
					<div className="mt-5 space-y-6 md:col-span-3 md:mt-0">
						<div className="col-span-3 sm:col-span-2">
							<label htmlFor="recipe_title" className="block font-bold mb-1">
								Name des Rezepts
							</label>
							<input
								type="text"
								name="title"
								id="title"
								className="block w-full flex-1 rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500 "
								placeholder="Leckere Grillspieße"
								value={title}
								onChange={(e)=>setFormState({title: e.target.value})}
								required
							/>
						</div>
						
						<div>
							<label htmlFor="recipe_excerpt" className="block font-bold mb-1">
								Kurzbeschreibung des Rezepts
							</label>
							<textarea
								id="recipe_excerpt"
								rows={3}
								className="block w-full min-h-[120px] rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
								placeholder="Die leckersten Grillspieße..."
								value={excerpt}
								onChange={(e)=>setFormState({excerpt: e.target.value})}
								required
							/>
							<p className="mt-2 text-gray-400">Eine knackige Zusammenfassung oder Einführung in dein Rezept.</p>
						</div>
						
						<div className="h-200 rounded-md overflow-hidden">
							<label className="block font-bold">Hauptbild</label>
							<Image onChange={handleImageUpload} onDelete={handleImageDelete} image={featured_image} uuid={formState.uuid} />
						</div>
						
						<div className="md:grid md:grid-cols-3 md:gap-6">
							<div className="mb-5 flex items-center gap-[15px]">
								<IconCutlery />
								{MenuTypesSelect}
							</div>
							<div className="mb-5 flex items-center gap-[15px]">
								<IconGrill />
								{KitchenStylesSelect}
							</div>
							<div className="mb-5 flex items-center gap-[15px]">
								<IconMeter />
								{Difficulties}
							</div>
						</div>
						
						<div className="md:grid md:grid-cols-3 md:gap-6">
							<div className="mb-5 flex items-center gap-[15px]">
								<IconPot />
								<div className="flex-auto">
									<label htmlFor="recipe_preparation_time" className="block font-bold">
										Vorbereitungszeit in Min.
									</label>
									<div className="mt-1 rounded-md shadow-sm">
										<input
											type="number"
											name="recipe_preparation_time"
											id="recipe_preparation_time"
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
											onChange={(e)=>setFormState({preparation_time: parseInt(e.target.value)})}
											value={preparation_time}
										/>
									</div>
								</div>
							</div>
							<div className="mb-5 flex items-center gap-[15px]">
								<IconClockFire />
								<div className="flex-auto">
									<label htmlFor="recipe_cooking_time" className="block font-bold">
										Kochzeit in Min.
									</label>
									<div className="mt-1 rounded-md shadow-sm">
										<input
											type="number"
											name="recipe_cooking_time"
											id="recipe_cooking_time"
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
											onChange={(e)=>setFormState({cooking_time: parseInt(e.target.value)})}
											value={cooking_time}
										/>
									</div>
								</div>
							</div>
							<div className="mb-5 flex items-center gap-[15px]">
								<IconClock />
								<div className="flex-auto">
									<label htmlFor="recipe_waiting_time" className="block font-bold">
										Ruhezeit in Min.
									</label>
									<div className="mt-1 rounded-md shadow-sm">
										<input
											type="number"
											name="recipe_waiting_time"
											id="recipe_waiting_time"
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
											onChange={(e)=>setFormState({waiting_time: parseInt(e.target.value)})}
											value={waiting_time}
										/>
									</div>
								</div>
								
							</div>
						</div>
					</div>
				</div>
			</div>
	)
}