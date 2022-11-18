import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./app.js";
import './tailwind.css';
import './style.css';
import {
	BrowserRouter as Router
} from "react-router-dom";


const container = document.getElementById('sv-grillfuerst-user-recipes-app');
const root = createRoot(container);
root.render(<Router><App /></Router>);
