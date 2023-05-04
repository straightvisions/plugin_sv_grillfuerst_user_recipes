import React, {useState, useEffect} from "react";
import Header from './components/header';
import Recipes from './components/recipes';
import Form from './components/form';
import user from './modules/user';
import Spinner from './components/spinner';
import Login from './components/login';
import Register from './components/register';
import Reset from './components/reset';
import { Routes, Route } from "react-router-dom";
import routes from './models/routes';

const App = () => {
	// initiate user first - this also checks if user is loggedIn
	// if not, we redirect to the given login url
	const [userInited, setUserInited] = useState(user.initialised);
	
	useEffect(()=>{
		const initUser = async()=> {
			await user.init();
			setUserInited(true);
		}
		
		initUser();
	}, []);
	
	// loading state
	if(userInited === false){
		return (<Spinner />);
	}
	
	// not logged-in state and not in root
	if(user.isLoggedIn === false && !routes.isAppRoot() && !routes.isRegister() && !routes.isReset()){
		window.location.href = routes.config.appURL;
		return (<Spinner />);
	}
	
	// not logged-in state
	if(user.isLoggedIn === false){
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
						path="/"
						element={<Login />}
					/>
				</Routes>
			</div>
		);
	}
	
	// logged-in state
	if(user.isLoggedIn === true) {
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