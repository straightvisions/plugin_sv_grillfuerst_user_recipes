import React, {useState, useEffect} from "react";
import NavigationBar from './components/navigation_bar';
import Recipes from './components/recipes';
import Review from './components/review';
import Export from './components/export';
import user from './modules/user';
import Spinner from './components/spinner';

import {
	Routes,
	Route, useNavigate
} from "react-router-dom";

const App = () => {
	const [userInited, setUserInited] = useState(true);
	
	useEffect(()=>{
		// disabled for now
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
				<NavigationBar />
				<div className="p-10">
					<Routes>
						<Route
							path="/edit/:uuid"
							element={<Review/>}
						/>
						<Route
							path="/"
							element={<Recipes />}
						/>
						<Route
							path="/export"
							element={<Export />}
						/>
					</Routes>
				</div>
			</div>
		);
	}
};

export default App;