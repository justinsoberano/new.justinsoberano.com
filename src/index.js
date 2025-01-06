import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div style={{ width: "100svw", height: "100svh"}}>
			<App/>
		</div>
  </React.StrictMode>
);