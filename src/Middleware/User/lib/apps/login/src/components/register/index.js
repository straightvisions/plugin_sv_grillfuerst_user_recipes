import React, {useState, useEffect, useReducer} from 'react';
import Logo from '../logo';
import Overlay from '../overlay';
import { useNavigate } from 'react-router-dom';

export default function Register(props){
	
	// @todo move this to config:
	const routeLogin = 'https://relaunch-magazin.grillfuerst.de/wp-json/sv-grillfuerst-user-recipes/v1/users/register';
	
	const [credentials, setCredentials] = useState({
		'default_address': {
			'address_class': 'default',
			'customers_gender': 'm',
			'customers_firstname': '',
			'customers_lastname': '',
			'customers_street_address': '',
			'customers_postcode': '',
			'customers_city': '',
			'customers_country_code': '',
			'customers_phone': '',
			'borlabs_grid_phone_fallback': ''
		},
		'cust_info': {
			'customers_email_address': '',
			'customers_password': '',
			'customers_password_confirm': '',
			'customers_email_address_confirm': ''
		}
	});
	
	const [message, setMessage] = useReducer((state, action)=>{
		return action.payload.map(i=>i.info_message).join('<br><br>');
	},'');
	
	const [isSending, setIsSending] = useState(false);
	const [password, setPassword] = useState({
		password1: '',
		password2: '',
		message: '',
	});
	
	const [isSuccess, setIsSuccess] = useState(false);
	const navigate = useNavigate();
	
	useEffect(()=>{
		if(isSuccess === true){
			navigate('/');
		}
		
	},[isSuccess])
	
	const handleAddress = (key, val) => {
		if(credentials.default_address.hasOwnProperty(key)){
			let newCredentials = {...credentials};
			newCredentials.default_address[key] = val;
			setCredentials(newCredentials);
		}
	}
	
	const handleEmail = (e) => {
		let newCredentials = {...credentials};
		newCredentials.cust_info.customers_email_address = e.target.value;
		newCredentials.cust_info.customers_email_address_confirm = e.target.value;
		setCredentials(newCredentials);
	}
	
	const handlePassword = (key, val) => {
		let newPassword = {...password};
		if(newPassword.hasOwnProperty(key)){
			newPassword[key] = val;
		}
		
		if(newPassword.password1 === newPassword.password2){
			let newCredentials = {...credentials};
			newCredentials.cust_info.customers_password = newPassword.password1;
			newCredentials.cust_info.customers_password_confirm = newPassword.password1;
			newPassword.message = '';
			setCredentials(newCredentials);
		}else{
			// remove unsafe password from list
			let newCredentials = {...credentials};
			newCredentials.cust_info.customers_password = '';
			newCredentials.cust_info.customers_password_confirm = '';
			
			if(newPassword.password1 !== '' && newPassword.password2 !== ''){
				newPassword.message = 'Passwörter stimmen nicht überein!';
			}
			
			setCredentials(newCredentials);
		}
		setPassword(newPassword);
	}
	
	
	const handleSubmit = (e) => {
		e.preventDefault();
		
		// is already sending or pw is not valid yet?
		if(isSending || password.message !== '') return;
		setIsSending(true);
		
		fetch(routeLogin, {
			method: 'POST',
			cache: 'no-cache',
			// no auth header - this is a public call
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(credentials),
		})
			.then(response => response.json())
			.then(res => {
				if(res.status === 'success'){
					setIsSuccess(true);
				}else{
					setMessage({payload: res.message.error});
				}
				
				setIsSending(false);
				
			}).catch(function(error) {
			setMessage({payload: error.message});
			setIsSending(false);
		});
	}
	
	
	
	
	return (
		<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<Logo />
				<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Nutzerrezepte</h2>
				<p className="mt-2 text-center text-sm text-gray-600">Mit deinen Daten erstellen wir einen Account im Grillfürst-Shop damit du dort später deine Gutscheine einlösen kannst!</p>
			</div>
			
			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 relative">
					{ isSending &&
						<Overlay />
					}
					<form className="space-y-6 grid grid-cols-2 gap-x-4" onSubmit={handleSubmit}>
						{message !== '' &&
							<div role="alert" className="col-span-2">
								<div className="bg-red-500 text-sm text-white font-bold rounded-t px-4 py-2">
									Registrierung fehlgeschlagen
								</div>
								<div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-sm text-red-700"
								     dangerouslySetInnerHTML={{__html: message}}
								>
								</div>
							</div>
						}
						<div className="sm:col-span-2">
							<label htmlFor="salutation" className="block text-sm font-medium text-gray-700">
								Anrede
							</label>
							<div className="mt-1">
								<select
									id="salutation"
									name="salutation"
									defaultValue="Frau"
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									onChange={(e) => handleAddress('customers_gender', e.target.value)}
								>
									<option value="f">Frau</option>
									<option value="m">Herr</option>
									<option value="c">Firma</option>
								</select>
							</div>
						</div>
						
						<div className="sm:col-span-1">
							<label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
								Vorname
							</label>
							<div className="mt-1">
								<input
									id="firstname"
									name="lastname"
									type="text"
									autoComplete="given-name"
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									onChange={(e) => handleAddress('customers_firstname', e.target.value)}
								/>
							</div>
						</div>
						
						<div className="sm:col-span-1">
							<label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
								Nachname
							</label>
							<div className="mt-1">
								<input
									id="lastname"
									name="lastname"
									type="text"
									autoComplete="family-name"
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									onChange={(e) => handleAddress('customers_lastname', e.target.value)}
								/>
							</div>
						</div>
						
						<div className="sm:col-span-2">
							<label htmlFor="address" className="block text-sm font-medium text-gray-700">
								Straße und Hausnummer
							</label>
							<div className="mt-1">
								<input
									id="address"
									name="address"
									type="text"
									autoComplete="street-address"
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									onChange={(e) => handleAddress('customers_street_address', e.target.value)}
								/>
							</div>
						</div>
						
						<div className="sm:col-span-1">
							<label htmlFor="zip" className="block text-sm font-medium text-gray-700">
								Postleiztzahl
							</label>
							<div className="mt-1">
								<input
									id="zip"
									name="zip"
									type="text"
									autoComplete="postal-code"
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									onChange={(e) => handleAddress('customers_postcode', e.target.value)}
								/>
							</div>
						</div>
						
						<div className="sm:col-span-1">
							<label htmlFor="city" className="block text-sm font-medium text-gray-700">
								Ort
							</label>
							<div className="mt-1">
								<input
									id="city"
									name="city"
									type="text"
									autoComplete="address-level2"
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									onChange={(e) => handleAddress('customers_city', e.target.value)}
								/>
							</div>
						</div>
						
						<div className="sm:col-span-2">
							<label htmlFor="country" className="block text-sm font-medium text-gray-700">
								Land
							</label>
							<div className="mt-1">
								<select
									id="country"
									name="country"
									defaultValue="DE"
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									onChange={(e) => handleAddress('customers_country_code', e.target.value)}
								>
									<option value="DE">Deutschland</option>
									<option value="AT">Österreich</option>
								</select>
							</div>
						</div>
						
						<div className="sm:col-span-1">
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
						
						<div className="sm:col-span-1">
							<label htmlFor="phone" className="block text-sm font-medium text-gray-700">
								Telefonnummer
							</label>
							<div className="mt-1">
								<input
									id="phone"
									name="phone"
									type="text"
									autoComplete="tel"
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									onChange={(e) => handleAddress('customers_phone', e.target.value)}
								/>
							</div>
						</div>
						
						<div className="col-span-2 inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						
						{password.message !== '' &&
							<div role="alert" className="col-span-2">
								<div className="border border-red-400 rounded-b bg-red-100 px-4 py-3 text-sm text-red-700"
								     dangerouslySetInnerHTML={{__html: password.message}}
								>
								</div>
							</div>
						}
						
						<div className="sm:col-span-2">
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								Passwort
							</label>
							<div className="mt-1">
								<input
									id="password"
									name="password"
									type="password"
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									onChange={(e)=>handlePassword('password1', e.target.value)}
								/>
							</div>
						</div>
						
						<div className="sm:col-span-2">
							<label htmlFor="password-repeat" className="block text-sm font-medium text-gray-700">
								Passwort wiederholen
							</label>
							<div className="mt-1">
								<input
									id="password-repeat"
									name="password-repeat"
									type="password"
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
									onChange={(e)=>handlePassword('password2', e.target.value)}
								/>
							</div>
						</div>
						
						<div className="col-span-2 inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						{ /*
						<div className="flex items-center col-span-2">
							<input
								id="newsletter"
								name="newsletter"
								type="checkbox"
								className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">
								Ja, ich möchte den Newsletter erhalten.
							</label>
						</div>
						*/}
						
						<div className="col-span-2">
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
								Neuen Account erstellen
							</button>
						</div>
					</form>
					
				</div>
			</div>
		</div>
	);
};