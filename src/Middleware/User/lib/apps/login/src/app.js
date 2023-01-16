import React, {useState} from 'react';
import Register from './components/register';
import Reset from './components/reset';
import Login from './components/login';

import {
	Routes,
	Route, useNavigate
} from "react-router-dom";

export default function App(){
	
	return (
		<div className="mx-auto max-w-7xl">
				<Routes>
					<Route
						path="/register"
						element={<Register />}
					/>
					<Route
						path="/reset"
						element={<Reset />}
					/>
					<Route
						path="/login"
						element={<Login />}
					/>
				</Routes>
		</div>
	);
};