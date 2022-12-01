import React from "react";
import { render } from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from "./app.js";
import tailwindCSS from '!!raw-loader!!!postcss-loader!./tailwind.css';
import styleCSS from '!!raw-loader!!!postcss-loader!./style.css';

import {
	BrowserRouter as Router
} from "react-router-dom";

// get our shadow HOST
const host = document.getElementById('sv-grillfuerst-user-recipes-admin-app');
// new render block for shadow dom
const shadow = host.attachShadow({ mode: 'open' });
const bodyNode = document.createElement('body');
const styleNode = document.createElement('style');
const renderIn = document.createElement('div');
styleNode.innerHTML = `${tailwindCSS}${styleCSS}`;
bodyNode.appendChild(styleNode);
bodyNode.appendChild(renderIn);
shadow.appendChild(bodyNode);

const root = createRoot(renderIn);
root.render(<Router basename={window.location.pathname}><App /></Router>);