import React from "react";
import Header from './components/header';
import Recipes from './components/recipes';
import Form from './components/form';
import User from './models/user';
import LocalStorage from './components/local_storage';

const App = () => {
	const [view, setView] = LocalStorage("view");
	const [user, setUser] = LocalStorage("user", User);

	// check view component
	let Section = (props) => {
		if(props.view === 'form'){
			return <Form />;
		}else{
			return <Recipes user={user} />;
		}
	}
	
	return (
		<div className="mx-auto max-w-7xl">
			<Header user={user} view={view} onChange={setView} />
			<Section  user={user} view={view} />
		</div>
	);
};

export default App;