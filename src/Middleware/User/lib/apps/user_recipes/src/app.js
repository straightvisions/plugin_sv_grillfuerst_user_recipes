import React, {useState, useEffect} from "react";
import Header from './components/header';
import Recipes from './components/recipes';
import Form from './components/form';
import user from './modules/user';
import Spinner from './components/spinner';
import { Routes, Route} from "react-router-dom";

const App = () => {
	
	// initiate user first - this also checks if user is loggedIn
	// if not, we redirect to the given login url
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