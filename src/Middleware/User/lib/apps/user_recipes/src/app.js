import React from "react";
import Header from './components/header';
import Recipes from './components/recipes'
import Form from './components/form'
import {
	BrowserRouter as Router,
	Routes,
	Route
} from "react-router-dom";

const App = () => {
	return (
		[
			<Router>
				<div className="mx-auto max-w-7xl">
				<Header/>
				<Routes>
					<Route path="/" exact element={<Recipes/>} />
					<Route path="/form" exact element={<Form/>} />
				</Routes>
				</div>
			</Router>
		]
	);
};

export default App;