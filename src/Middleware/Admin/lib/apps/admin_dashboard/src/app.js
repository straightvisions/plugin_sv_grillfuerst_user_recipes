import React, {useState, useEffect} from "react";
import NavigationBar from './components/navigation_bar';
import Recipes from './components/recipes';
import Review from './components/review';
import user from './modules/user';
import Spinner from './components/spinner';

import {
	Routes,
	Route, useNavigate
} from "react-router-dom";

const App = () => {
	const [userInited, setUserInited] = useState(false);
	
	useEffect(()=>{
		const initUser = async()=> {
			await user.init();
			setUserInited(true);
		}
		
		initUser();
	}, []);
	
	if(userInited === false){
		return (<Spinner />);
	}else {
		return (
			<div className="min-h-full bg-gray-100">
				<NavigationBar user={user}/>
				<div className="p-10">
					<Routes>
						<Route
							path="/edit/:uuid"
							element={<Review/>}
						/>
						<Route
							path="/"
							element={<Recipes/>}
						/>
					</Routes>
				</div>
			</div>
		);
	}
};

export default App;