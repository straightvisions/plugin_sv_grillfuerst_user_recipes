import React from "react";
import { createRoot } from 'react-dom/client';
import {BrowserRouter as Router} from "react-router-dom";
import App from "./app.js";
import tailwindCSS from '!!raw-loader!!!postcss-loader!./tailwind.css';
import styleCSS from '!!raw-loader!!!postcss-loader!./style.css';
import './fonts.css';

// get our shadow HOST
const host = document.getElementById('sv-grillfuerst-user-recipes-app');
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