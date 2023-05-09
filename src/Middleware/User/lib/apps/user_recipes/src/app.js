import React, {useState, useEffect, useReducer} from "react";
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
import SlideInPanel from "./components/slide_in_panel";
import { GlobalContext } from './modules/context';

const App = () => {
	// initiate user first - this also checks if user is loggedIn
	// if not, we redirect to the given login url
	const [userInited, setUserInited] = useState(user.initialised);
	
	const [globalMessage, setGlobalMessage] = useReducer((state, newState) => {
		return {...state, ...{type:'success', visible:true}, ...newState}
		}, {
			message: '',
			type: 'success',
			visible: false
	});
	
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
			<>
				{panelVisible &&
					<SlideInPanel
						message={panelMessage}
						type={panelType}
						visible={panelVisible}
						onClose={() => setPanelVisible(false)}
					/>
					
				}
				
				<div className="mx-auto max-w-7xl">
					<Routes>
						<Route
							path="/register"
							element={<Register />}
						/>
						{/* TODO: implement when shop server is ready
					<Route
						path="/reset"
						element={<Reset />}
					/>*/}
						<Route
							path="/"
							element={<Login />}
						/>
					</Routes>
				</div>
			</>
			
		);
	}
	
	// logged-in state
	if(user.isLoggedIn === true) {
		return (
			<>
				<GlobalContext.Provider value={{globalMessage, setGlobalMessage}}>
					{globalMessage.visible &&
						<SlideInPanel
							message={globalMessage.message}
							type={globalMessage.type}
							visible={globalMessage.visible}
							onClose={() => setGlobalMessage(false)}
						/>
						
					}
					
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
				</GlobalContext.Provider>
				</>
		);
	}

	
};

export default App;