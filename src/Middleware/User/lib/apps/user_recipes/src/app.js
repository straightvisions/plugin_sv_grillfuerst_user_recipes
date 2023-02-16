import React, {useState} from "react";
import Header from './components/header';
import Recipes from './components/recipes';
import Form from './components/form';
import user from './modules/user';
import routes from './models/routes';
import { Routes, Route} from "react-router-dom";

const App = () => {
	if(user.isLoggedIn() === false){
		//window.location.href = routes.login;
	}else{
		return (
			<div className="mx-auto max-w-7xl">
				<Header />
				<Routes>
					<Route
						path="/edit/:uuid"
						element={<Form />}
					/>
					<Route
						path="/"
						element={<Recipes />}
					/>
				</Routes>
			</div>
		);
	}
	
	
};

export default App;