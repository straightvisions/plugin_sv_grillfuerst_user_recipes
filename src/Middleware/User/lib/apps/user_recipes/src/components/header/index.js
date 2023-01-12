import React from "react";
import {Link, useNavigate} from "react-router-dom";
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/20/solid';

import {  useLocation } from 'react-router-dom';
import routes from "../../models/routes";

function FormButton(props){
	const location = useLocation();
	const navigate = useNavigate();
	
	const handleNewRecipe = () => {
		fetch(routes.createRecipe + props.user.id, {
			method: 'POST',
			cache: 'no-cache',
			body: JSON.stringify({})
		})
			.then(response => response.json())
			.then(data => {
				navigate('/edit/' + data.uuid)
			});
	}
	
	if(location.pathname.includes('/edit/')) {
		return (
			
			<Link
				className="relative inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-black hover:border-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
				role="button"
				to="/"
			>
				<ArrowRightIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
				<span>Übersicht</span>
			</Link>
		);
	}
	
	// default
	return (
		
		<button
			className="relative inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-orange-600 hover:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
			role="button"
			onClick={handleNewRecipe}
		>
			<PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
			<span>Neues Rezept</span>
		</button>
		
	
	);
}

export default function Header(props) {
	return (
		<div className="px-4 sm:px-6 lg:px-8 mb-4 bg-white shadow">
			<div className="flex h-16 justify-between">
				<div className="flex items-center">
					<div className="flex flex-shrink-0 items-center">
						<a href="https://www.grillfuerst.de" target="_blank">
						<img
							className="block h-8 w-auto"
							src="https://www.grillfuerst.de/magazin/wp-content/uploads/2022/09/Logo.svg"
							alt="Grillfürst"
						/>
						</a>
					</div>
				</div>
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<FormButton {...props} />
					</div>
					<div className="ml-4 flex flex-shrink-0 items-center">
						<button
							type="button"
							className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
						>
							<img
								className="h-8 w-8 rounded-full"
								src={props.user.avatar}
								alt=""
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}