import React, {useState} from 'react';
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
					// user meta
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
		<>
			<div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 relative">
				{isSending &&
					<Overlay/>
				}
				<form className="space-y-6" onSubmit={handleSubmit}>
					{message !== '' &&
						<div role="alert">
							<div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
								Login fehlgeschlagen
							</div>
							<div
								className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700"
								dangerouslySetInnerHTML={{__html: message}}
							>
							</div>
						</div>
					}
					<div>
						<label htmlFor="email" className="block font-bold text-gray-700">
							Email
						</label>
						<div className="mt-1">
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 "
								onChange={handleEmail}
								disabled={isSending}
							/>
						</div>
					</div>
					
					<div>
						<label htmlFor="password" className="block font-bold text-gray-700">
							Passwort
						</label>
						<div className="mt-1">
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 "
								onChange={handlePassword}
								disabled={isSending}
							/>
						</div>
					</div>
					
					{/*
					<div className="flex items-center justify-between">
						<div className="">
							<a href={routes.getUrl('/reset')} className="font-bold text-orange-500 hover:text-orange-500">
								Passwort vergessen?
							</a>
						</div>
					</div>
					*/}
					<div className="flex items-center justify-between">
						<div className="">
							<a target="_blank" href="https://www.grillfuerst.de/customer/password_reset" className="font-bold text-orange-500 hover:text-orange-500">
								Passwort vergessen?
							</a>
						</div>
					</div>
					<div>
						<button
							disabled={isSending}
							type="submit"
							className="flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 font-bold text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
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
						<div className="relative flex justify-center">
							<span className="bg-white px-2 text-gray-500">oder</span>
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
							className="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 font-bold text-white shadow-sm hover:bg-grey3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
							href={routes.getUrl('/register')}
						>
							Neuen Account erstellen
						</a>
					</div>
				</div>
			</div>
		</>
	);
};