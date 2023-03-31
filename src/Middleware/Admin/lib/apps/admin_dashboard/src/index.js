import React from "react";
import { createRoot } from 'react-dom/client';
import {BrowserRouter as Router} from "react-router-dom";
import App from "./app.js";
import tailwindCSS from '!!raw-loader!!!postcss-loader!./tailwind.css';
import styleCSS from '!!raw-loader!!!postcss-loader!./style.css';

const host = document.getElementById('sv-grillfuerst-user-recipes-admin-app');
const shadow = host.attachShadow({ mode: 'open' });
const bodyNode = document.createElement('body');
const styleNode = document.createElement('style');
const renderIn = document.createElement('div');
styleNode.innerHTML = `${tailwindCSS}${styleCSS}`;
bodyNode.appendChild(styleNode);
bodyNode.appendChild(renderIn);
shadow.appendChild(bodyNode);

const root = createRoot(renderIn);
root.render(<Router basename={svgf_root_path}><App /></Router>);

/*
	for localhost:
	1. login into /wp-admin
	2. navigate to /community-rezepte/admin
	3. search for sv_grillfuerst_admin_dashboard_app_token in the source code
	4. copy the FULL token to index.html (sv_grillfuerst_admin_dashboard_app_token)
 */

