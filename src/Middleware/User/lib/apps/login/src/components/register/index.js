import React from 'react';
import Logo from '../logo';

export default function Register(props){
	return (
		<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<Logo />
				<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Nutzerrezepte</h2>
				<p className="mt-2 text-center text-sm text-gray-600">Mit deinen Daten erstellen wir einen Account im Grillfürst-Shop damit du dort später deine Gutscheine einlösen kannst!</p>
			</div>
			
			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6 grid grid-cols-2 gap-x-4" action="#" method="POST">
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
								/>
							</div>
						</div>
						
						<div className="col-span-2 inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						
						<div className="sm:col-span-2">
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								Passwort
							</label>
							<div className="mt-1">
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
								/>
							</div>
						</div>
						
						<div className="col-span-2 inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						
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