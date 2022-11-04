import React from "react";
import Hero from './components/hero'

const App = () => {
	
	// https://reactjs.org/docs/handling-events.html
	function handleSubmit(e) {
		e.preventDefault();
		alert('You clicked submit.');
	}
	
	return (<Hero/>);
};

export default App;