import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './spa/App';
import './app/globals.css';

const rootElement = document.getElementById('app');

if (!rootElement) {
    throw new Error('Root element #app is missing');
}

createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
