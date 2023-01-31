import React, {useState} from 'react';
import Logo from '../logo';
import Overlay from "../overlay";

export default function Reset(props){
	
	const routeLogin = 'https://relaunch-magazin.grillfuerst.de/wp-json/sv-grillfuerst-user-recipes/v1/users/reset';
	const [credentials, setCredentials] = useState({
		username: ''
	});
	
	const [message, setMessage] = useState('');
	const [isSending, setIsSending] = useState(false);
	
	const handleEmail = (e) => {
		let newCredentials = {...credentials};
		newCredentials.username = e.target.value;
		setCredentials(newCredentials);
	}
	
	const handleSubmit = (e) => {
		e.preventDefault();
		if(isSending) return;
		setIsSending(true);
		
		fetch(routeLogin, {
			method: 'PUT',
			cache: 'no-cache',
			// no auth header - this is a public call
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(credentials),
		})
			.then(response => response.json())
			.then(res => {
				if(res.status === 'success'){
					window.location.href = res.url + '&ref=https%3A%2F%2Frelaunch-magazin.grillfuerst.de%2Fnutzerrezepte';
				}else{
					setMessage(res.message);
				}
				
				setIsSending(false);
				
			}).catch(function(error) {
			setMessage(error.message);
			setIsSending(false);
		});
	}
	
	return (
		<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<Logo />
				<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Nutzerrezepte</h2>
				<p className="mt-2 text-center text-sm text-gray-600">Passwort erneuern</p>
			</div>
			
			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 relative">
					{ isSending &&
						<Overlay />
					}
					<form className="space-y-6" onSubmit={handleSubmit}>
						{message !== '' &&
							<div role="alert">
								<div className="bg-red-500 text-sm text-white font-bold rounded-t px-4 py-2">
									Reset fehlgeschlagen
								</div>
								<div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-sm text-red-700"
								     dangerouslySetInnerHTML={{__html: message}}
								>
								</div>
							</div>
						}
						<div className="text-sm text-gray-600">
							Bitte geben Sie die E-Mail-Adresse ein, unter der Sie Ihr Konto in unserem Shop angelegt haben.
							Klicken Sie danach auf "Weiter" und wir senden Ihnen eine E-Mail mit einem Bestätigungs-Link!
						</div>
						
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">
								Email
							</label>
							<div className="mt-1">
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									onChange={handleEmail}
								/>
							</div>
						</div>
					
						<div>
							<input
								id="email-second"
								name="email-second"
								type="email"
								className="hidden"
							/>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							>
								Neues Passwort anfordern
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};