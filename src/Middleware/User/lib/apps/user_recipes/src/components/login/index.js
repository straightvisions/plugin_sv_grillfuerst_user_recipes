import React, {useState} from 'react';
import Logo from '../logo';
import Overlay from '../overlay';
import storage from '../../modules/storage';
import routes from '../../models/routes';

export default function Login(props) {
	const [credentials, setCredentials] = useState({
		username: '',
		password: ''
	});
	
	const [message, setMessage] = useState('');
	const [isSending, setIsSending] = useState(false);
	
	const handleEmail = (e) => {
		let newCredentials = {...credentials};
		newCredentials.username = e.target.value;
		setCredentials(newCredentials);
	}
	
	const handlePassword = (e) => {
		let newCredentials = {...credentials};
		newCredentials.password = e.target.value;
		setCredentials(newCredentials);
	}
	
	const handleSubmit = (e) => {
		e.preventDefault();
		if (isSending) return;
		setIsSending(true);
		
		fetch(routes.login, {
			method: 'POST',
			cache: 'no-cache',
			// no auth header - this is a public call
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(credentials),
		})
			.then(response => {
				const authHeader = response.headers.get('Authorization');
				const token = authHeader ? authHeader.split(' ')[1] : null;
				return response.json().then(data => ({data, token}));
			})
			.then(res => {
				const {data, token} = res;
				
				if (data.status === 'success') {
					storage.set('userId', data.customerId);
					storage.set('token', token);
					window.location.href = data.url + '&ref=' + encodeURIComponent(routes.config.appURL);
				} else {
					setMessage(data.message);
					// clean storage just in case
					storage.set('userId', 0);
					storage.set('token', '');
				}
			}).catch(function (error) {
			setMessage(error.message);
		}).finally(() => {
			setIsSending(false);
		});
	}
	
	return (
		<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<Logo/>
				<h2 className="mt-6 text-center">Community Rezepte</h2>
				<p className="mt-2 text-center text-sm text-gray-600">Melde dich mit deinem Grillfürst Shop Account
					an!</p>
			</div>
			
			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 relative">
					{isSending &&
						<Overlay/>
					}
					<form className="space-y-6" onSubmit={handleSubmit}>
						{message !== '' &&
							<div role="alert">
								<div className="bg-red-500 text-sm text-white font-bold rounded-t px-4 py-2">
									Login fehlgeschlagen
								</div>
								<div
									className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-sm text-red-700"
									dangerouslySetInnerHTML={{__html: message}}
								>
								</div>
							</div>
						}
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
									disabled={isSending}
								/>
							</div>
						</div>
						
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<div className="mt-1">
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									onChange={handlePassword}
									disabled={isSending}
								/>
							</div>
						</div>
						
						{/*}
						<div className="flex items-center justify-between">
							<div className="text-sm">
								<a href={routes.getUrl('/reset')} className="font-medium text-indigo-600 hover:text-indigo-500">
									Passwort vergessen?
								</a>
							</div>
						</div>
						*/}
						<div>
							<button
								disabled={isSending}
								type="submit"
								className="flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							>
								Anmelden
							</button>
						</div>
					</form>
					
					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"/>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-white px-2 text-gray-500">Oder</span>
							</div>
						</div>
						<div className="mt-6">
							<input
								id="email-second"
								name="email-second"
								type="email"
								className="hidden"
							/>
							<a
								className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								href={routes.getUrl('/register')}
							>
								Neuen Account erstellen
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};