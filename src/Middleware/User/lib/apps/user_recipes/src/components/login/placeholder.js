import React from 'react';
import Overlay from "../overlay";
import routes from "../../models/routes";

const LoginPlaceholder = () => {
	return (
		<div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 relative animate-pulse">
			<div className="w-1/4 h-4 bg-gray-300 rounded mb-2"></div>
			<div className="w-full h-8 bg-gray-300 rounded mb-2"></div>
			
			<div className="w-1/4 h-4 bg-gray-300 rounded mb-2"></div>
			<div className="w-full h-8 bg-gray-300 rounded mb-2"></div>
			
			<div className="w-full h-8 bg-gray-300 rounded mb-2"></div>
		</div>
	);
};

export default LoginPlaceholder;
