import React, {useState} from "react";
import NavigationBar from './components/navigation_bar';

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
					
					</Routes>
				</div>
				
		</div>
	);
};

export default App;