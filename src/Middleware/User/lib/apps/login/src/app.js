import React, {useState, useEffect} from 'react';
import Register from './components/register';
import Reset from './components/reset';
import Login from './components/login';
import Spinner from './components/spinner';

import {
	Routes,
	Route, useNavigate
} from "react-router-dom";
import storage from "./components/storage";

export default function App(){
	const routeLoggedIn = 'https://relaunch-magazin.grillfuerst.de/wp-json/sv-grillfuerst-user-recipes/v1/users/login/check';
	//@todo check token + validation if still logged in
	const [loadingState,setLoadingState] = useState(true);
	
	useEffect(() => {
		fetch(routeLoggedIn)
			.then(response => response.json())
			.then(res => {
				console.log(res);
				// check if user is already logged-in
				if(res.loggedIn){
					storage.set('userId', res.userId);
					window.location.href = res.url + '&ref=https%3A%2F%2Frelaunch-magazin.grillfuerst.de%2Fnutzerrezepte';
				}
				
				setLoadingState(false);
			});
		
	}, []);
	
	if(loadingState){
		return(
			<div className="mx-auto max-w-7xl">
				<Spinner />
			</div>
		);
	}
	
	return (
		<div className="mx-auto max-w-7xl">
				<Routes>
					<Route
						path="/register"
						element={<Register />}
					/>
					<Route
						path="/reset"
						element={<Reset />}
					/>
					<Route
						path="/login"
						element={<Login />}
					/>
					<Route
						path="/"
						element={<Login />}
					/>
				</Routes>
		</div>
	);
};