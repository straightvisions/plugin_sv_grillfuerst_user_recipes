import React, {useState} from "react";
import Header from './components/header';
import Recipes from './components/recipes';
import Form from './components/form';
import Spinner from './components/spinner';
import User from './models/user';
import LocalStorage from './components/local_storage';
import routes from './models/routes';
import Dev from './components/dev';

import {
	BrowserRouter as Router,
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
						element={<Form/>}
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