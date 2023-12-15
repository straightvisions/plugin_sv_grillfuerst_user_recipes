import React, {useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/20/solid';
import routes from '../../models/routes';
import user from '../../modules/user';
import headers from '../../modules/headers';
import Spinner from '../spinner';
const User = user.get();

function FormButton(props){
	const location = useLocation();
	const navigate = useNavigate();
	
	const [loading, setLoading] = useState(false);
	
	const handleNewRecipe = () => {
		setLoading(true);
		
		fetch(routes.createRecipe + User.id, {
			method: 'POST',
			headers: headers.get(),
			cache: 'no-cache',
			body: JSON.stringify({})
		})
			.then(response => response.json())
			.then(data => {
				const path = '/edit/' + data.uuid;
				navigate(path);
				window.postMessage({ type: 'NAVIGATION', payload: window.location.pathname }, '*');
			}).finally(() => {
				setLoading(false);
			});
		};

	
	if(location.pathname.includes('/edit/')) {
		return (
			<button
				className="btn primary"
				role="button"
				onClick={(e) => {
					const path = '/';
					navigate(path);
					window.postMessage({ type: 'NAVIGATION', payload: window.location.pathname }, '*');
				}}
			>
				<ArrowLeftIcon className="-ml-1 h-5 w-5" aria-hidden="true"/>
				<span>Übersicht</span>
			</button>
		);
	}
	
	// default
	return (
		<button
			className="btn"
			role="button"
			onClick={handleNewRecipe}
			disabled={loading}
		>
			{loading ? <Spinner width="4" height="4"/>:
				<PlusIcon className="-ml-1 h-5 w-5" aria-hidden="true"/>
			}
			<span>Neues Rezept hinzufügen</span>
		</button>
	);
}

export default function Header(props) {
	const handleLogout = () => {
		user.logout();
	}
	
	return (
		<>
			<div className="flex items-center mb-4 gap-2 justify-between">
				<FormButton {...props} />
				<button
					className="btn secondary"
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>
		</>
		
	)
}