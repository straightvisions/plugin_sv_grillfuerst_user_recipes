import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import {  useLocation } from 'react-router-dom';
import routes from '../../models/routes';
import user from '../../modules/user';
import headers from "../../modules/headers";
const User = user.get();

function FormButton(props){
	const location = useLocation();
	const navigate = useNavigate();
	
	const handleNewRecipe = () => {
		fetch(routes.createRecipe + User.id, {
			method: 'POST',
			/*headers: {
				'Authorization': 'Bearer ' + storage.get('token'),
			},*/
			headers: headers.get(),
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
	const handleLogout = () => {
		user.logout();
	}
	
	return (
		<div className="flex items-center px-4 sm:px-6 lg:px-8 mb-4 gap-2">
			<FormButton {...props} />
			<button
				className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
				onClick={handleLogout}
			>
				Logout
			</button>
		</div>
	)
}