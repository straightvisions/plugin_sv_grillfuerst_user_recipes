import React, {useState} from 'react';
import Logo from '../logo';
import Spinner from '../spinner';

export default function Login(props){
	// @todo move this to config:
	const bearerToken = 'xx';
	const routeLogin = 'xxx';
	const [credentials, setCredentials] = useState({
		username: '',
		password: ''
	});
	
	const [message, setMessage] = useState('');
	
	const [isSending, setIsSending] = useState(false);
	
	console.log(credentials);
	
	const handleEmail = (e) => {
		credentials.username = e.target.value;
		setCredentials(credentials);
	}
	
	const handlePassword = (e) => {
		credentials.password = e.target.value;
		setCredentials(credentials);
	}
	
	const handleSubmit = (e) => {
		e.preventDefault();
		if(isSending) return;
		setIsSending(true);
	
		fetch(routeLogin, {
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Authorization': `Bearer ${bearerToken}`,
				'Content-Type': 'application/json'},
			body: JSON.stringify(credentials),
		})
			.then(response => response.json())
			.then(res => {
				if(res.status === 'success'){
					window.location.href = res.url + '&ref=xxx';
				}else{
					setMessage(res.message);
				}
				
				console.log(res);
				setIsSending(false);
				
			}).catch(function(error) {
			setMessage(error.message);
			setSavingState(false);
		});
	}
	
	return (
		<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<Logo />
				<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Nutzerrezepte</h2>
				<p className="mt-2 text-center text-sm text-gray-600">Melde dich mit deinem Grillfürst Shop Account an!</p>
			</div>
			
			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" onSubmit={handleSubmit}>
						{message !== '' &&
							<div role="alert">
								<div className="bg-red-500 text-sm text-white font-bold rounded-t px-4 py-2">
									Login fehlgeschlagen
								</div>
								<div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-sm text-red-700">
									<p>{message}</p>
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
						
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
									disabled={isSending}
								/>
								<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
									Angemeldet bleiben
								</label>
							</div>
							
							<div className="text-sm">
								<a href="/reset" className="font-medium text-indigo-600 hover:text-indigo-500">
									Passwort vergessen?
								</a>
							</div>
						</div>
						
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
								<div className="w-full border-t border-gray-300" />
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
							<button
								disabled={isSending}
								type="button"
								className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							>
								Neuen Account erstellen
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};