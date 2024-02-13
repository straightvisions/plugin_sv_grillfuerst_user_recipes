import React, {useState, useEffect, useReducer} from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './components/header';
import Recipes from './components/recipes';
import Form from './components/form';
import user from './modules/user';
import Spinner from './components/spinner';
import Login from './components/login';
import LoginPlaceholder from './components/login/placeholder';
import Register from './components/register';
import {ModalConfirm, Modal} from './components/modals';
import { Routes, Route } from "react-router-dom";
import routes from './models/routes';
import SlideInPanel from "./components/slide_in_panel";
import { GlobalContext } from './modules/context';
import {appMeta} from './modules/app_meta';


// @todo remove this later when caching is stable
const urlSearchParams = new URLSearchParams(location.search);
const logoutParam = urlSearchParams.get('logout');

// add check if url has param ?logout=true then force logout
if(logoutParam === 'true') user.logout();

const getRedirectURL = (path) => {
	return window.location.pathname.replace(/\/+$/, '') + '/' + path;
}

const App = () => {
	const navigate = useNavigate();
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
	
	const [globalModalConfirm, setGlobalModalConfirm] = useReducer((state, newState) =>
		// reset modal completely to prevent side effects
		newState.hasOwnProperty('show') && newState.show === false ? {message:'', onConfirm:null, onCancel:null, show:false} : {...state, ...{show:true}, ...newState}, {message:'', onConfirm:null, onCancel:null, show:false}
	);
	
	const [globalModal, setGlobalModal] = useReducer((state, newState) =>
		// reset modal completely to prevent side effects
		newState.hasOwnProperty('show') && newState.show === false ? {message:'', onConfirm:null, onCancel:null, show:false} : {...state, ...{show:true}, ...newState}, {message:'', onConfirm:null, onCancel:null, show:false}
	);
	
	useEffect(()=>{
		const initUser = async () => {
			await user.init();
			setUserInited(true);
		}
		
		// don't remove this console.log
		console.log('Community App v' + appMeta.appVersion);
		
		initUser();
	}, []);
	
	// loading state
	if(userInited === false){
		return (<LoginPlaceholder />);
	}
	
	// not logged-in state and not in root
	if(user.isLoggedIn === false && !routes.isLogin() && !routes.isRegister() && !routes.isReset()){
		const path = '/login';
		//navigate(path); // correct way for standalone app
		window.location.href = getRedirectURL('login'); // correct way for wordpress
		window.postMessage({ type: 'NAVIGATION', payload: window.location.pathname }, '*');
		return (<LoginPlaceholder />);
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
						path="/login"
						element={<Login />}
					/>
				</Routes>
			</div>
		);
	}
	
	if(user.isLoggedIn === true && (routes.isLogin() || routes.isRegister() || routes.isReset())) {
		window.location.href = routes.config.appURL;
		return (<LoginPlaceholder />);
	}
	
	// logged-in state
	if(user.isLoggedIn === true) {
		return (
			<>
				<GlobalContext.Provider value={{globalMessage, setGlobalMessage, globalModalConfirm, setGlobalModalConfirm, globalModal, setGlobalModal}}>
					{globalMessage.visible &&
						<SlideInPanel
							message={globalMessage.message}
							type={globalMessage.type}
							visible={globalMessage.visible}
							onClose={() => setGlobalMessage(false)}
						/>
						
					}
					
					{globalModalConfirm.show &&
						<ModalConfirm />
					}
					
					{globalModal.show &&
						<Modal />
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