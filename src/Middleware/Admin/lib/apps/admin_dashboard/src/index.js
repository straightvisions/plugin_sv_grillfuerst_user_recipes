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

// patch tailwind portals
let r = 0, p = setInterval(function() {
	if(r > 100) clearInterval(patchShadowDom); // prevent endless loop
	const portal = document.getElementById('headlessui-portal-root'); // portal for modals
	const _shadow = host.shadowRoot?.children[0];
	if(_shadow && portal) _shadow.appendChild(portal) & clearInterval(p); // patch dom
	r++;
}, 200);

const root = createRoot(renderIn);
root.render(<Router basename={svgf_root_path}><App /></Router>);

