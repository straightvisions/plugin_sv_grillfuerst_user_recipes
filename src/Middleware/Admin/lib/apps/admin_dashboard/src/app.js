import React, {useState} from "react";
import NavigationBar from './components/navigation_bar';
import Recipes from './components/recipes';
import Review from './components/review';

import {
	Routes,
	Route, useNavigate
} from "react-router-dom";

const App = () => {
	const [user, setUser] = useState({});
	
	const navigate = useNavigate();
	
	return (
		<div className="min-h-full bg-gray-100">
				<NavigationBar user={user} />
				<div className="py-10">
					<Routes>
						<Route
							path="/edit/:uuid"
							element={<Review />}
						/>
						<Route
							path="/"
							element={<Recipes />}
						/>
					</Routes>
				</div>
		</div>
	);
};

export default App;