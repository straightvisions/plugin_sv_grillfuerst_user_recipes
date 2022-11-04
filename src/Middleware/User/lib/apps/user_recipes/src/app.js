import React from "react";
const App = () => {
	
	// https://reactjs.org/docs/handling-events.html
	function handleSubmit(e) {
		e.preventDefault();
		alert('You clicked submit.');
	}
	
	return (
		<form onSubmit={handleSubmit}>
			<button type="submit">Submit</button>
		</form>
	);
};

export default App;