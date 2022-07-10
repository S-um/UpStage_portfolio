import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './portfolio';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div style={{ "backgroundColor": "black", "color": "white" }}>
    <App />
  </div>
);
