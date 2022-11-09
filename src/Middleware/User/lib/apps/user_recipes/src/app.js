import React, { useState } from "react";
import Header from './components/header';
import Recipes from './components/recipes';
import Form from './components/form';

const App = () => {
	const [view, setView] = useState("recipes");
	
	// check view component
	let Section = (props) => {
		if(props.view === 'form'){
			return <Form/>;
		}else{
			return <Recipes/>;
		}
	}
	
	return (
		<div className="mx-auto max-w-7xl">
			<Header view={view} onChange={setView}  />
			<Section view={view} />
		</div>

	);
};

export default App;