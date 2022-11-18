import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./app.js";
import './tailwind.css';
import './style.css';

const container = document.getElementById('sv-grillfuerst-user-recipes-app');
const root = createRoot(container);
root.render(<App />);
