import React, {useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/20/solid';
import routes from '../../models/routes';
import user from '../../modules/user';
import headers from '../../modules/headers';
import Spinner from '../spinner';
import VideoPlayer from '../video';
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
				navigate('/edit/' + data.uuid)
			}).finally(() => {
				setLoading(false);
			});
		};

	
	if(location.pathname.includes('/edit/')) {
		return (
			<Link
				className="btn primary"
				role="button"
				to="/"
			>
				<ArrowLeftIcon className="-ml-1 h-5 w-5" aria-hidden="true"/>
				<span>Übersicht</span>
			</Link>
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
	const location = useLocation();
	const currentPath = (routes.config.appPath + location.pathname).replace('//', '/').replace(/\/$/, '');
	
	const handleLogout = () => {
		user.logout();
	}
	
	return (
		<>
			{ user.isLoggedIn && currentPath === routes.config.appPath &&
				<div className="mb-12">
					<h1 className="mb-4">Herzlich Willkommen bei den Grillfürst Community-Rezepten</h1>
					<div className="flex flex-wrap lg:flex-nowrap mb-4 gap-12 justify-between items-center bg-grey-50 rounded shadow">
						<div className="p-4">
							<p className="mt-2">Du befindest dich nun in deinem persönlichen Login Bereich, in dem du neue Rezepte erstellen und zur Prüfung freigeben kannst. Bitte halte dich beim Erstellen an unsere <a className="underline" href="https://www.grillfuerst.de/magazin/allgemein/community-rezepte-guideline/" target="_blank">Guidelines</a>, denn natürlich möchten wir unsere Community möglichst mit hochwertigen Rezepten und Inhalten bereichern.</p>
							<p className="mt-2">Eine Übersicht aller veröffentlichten Community-Rezepte findest du im Magazin im Bereich <a className="underline" href="https://www.grillfuerst.de/magazin/grillrezepte/quelle/community/" target="_blank">Grillrezepte</a>.</p>
							<p className="mt-2">Du selbst kannst unten neue Rezepte erstellen und zur Prüfung freigeben. Bitte berücksichtige, dass du bei jeder Rezept-Einreichung unsere <a className="underline" href="https://www.grillfuerst.de/magazin/wp-content/uploads/2023/06/grillfuerst_rezeptwelt-atb.pdf" target="_blank">AGB für die Community Rezepte</a> akzeptieren musst.</p>
							<p className="mt-2">Nach abgeschlossener Prüfung und ggf. Freischaltung erhälst du per E-Mail einen Gutschein für unseren Onlineshop als Dankeschön für deinen Beitrag. Bitte berücksichtige, dass dies etwas dauern kann und siehe von Nachfragen dazu ab, da wir die Rezeptvorschläge wirklich per Hand prüfen”</p>
						</div>
						
						<div className="p-4">
							<VideoPlayer className="shadow rounded overflow-hidden" src="https://www.grillfuerst.de/magazin/wp-content/uploads/2023/06/community-rezepte-how-to-v1.mp4" />
						</div>
					</div>
				</div>
				
			}
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