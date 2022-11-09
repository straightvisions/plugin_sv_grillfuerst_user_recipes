import React, { useState } from "react";
import Header from './components/header';
import Footer from './components/footer';
import Recipes from './components/recipes';
import Form from './components/form';

const App = () => {
	const [view, setView] = useState("recipes");
	
	// check view component
	let Section = (props) => {
		if(props.view === 'form'){
			return <Form/>;
		}else{
			return <Form/>;
			return <Recipes/>;
		}
	}
	
	return (
		<div className="mx-auto max-w-7xl">
			<Header view={view} onChange={setView} />
			<Section view={view} />
			<Footer />
		</div>
	);
};

export default App;