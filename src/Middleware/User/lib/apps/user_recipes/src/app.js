import React, { useState } from "react";
import Header from './components/header';
import Footer from './components/footer';
import Recipes from './components/recipes';
import Form from './components/form';
import User from './models/user';

const App = () => {
	const [view, setView] = useState("recipes");
	const [user, setUser] = useState(User);
	
	// check view component
	let Section = (props) => {
		if(props.view === 'form'){
			return <Form />;
		}else{
			////return <Form />;
			return <Recipes user={user} />;
		}
	}
	
	return (
		<div className="mx-auto max-w-7xl">
			<Header user={user} view={view} onChange={setView} />
			<Section  user={user} view={view} />
			<Footer />
		</div>
	);
};

export default App;