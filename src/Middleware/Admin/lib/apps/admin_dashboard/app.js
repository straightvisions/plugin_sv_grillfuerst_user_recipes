import React, {useState} from "react";
import Header from './components/header';
import Recipes from './components/recipes';
import Form from './components/form';
import User from './models/user';
import Dev from './components/dev';

import {
	Routes,
	Route, useNavigate
} from "react-router-dom";

const App = () => {
	const [user, setUser] = useState(User);
	
	const navigate = useNavigate();
	
	return (
		<div className="mx-auto max-w-7xl">
				<Header user={user} />
				<Routes>
					<Route
						path="/edit/:uuid"
						element={<Form user={user}/>}
					/>
					<Route
						path="/"
						element={<Recipes user={user} />}
					/>
				</Routes>
				<Dev user={user} />
		
		</div>
	);
};

export default App;