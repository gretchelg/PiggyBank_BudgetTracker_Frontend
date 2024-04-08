import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { BrowserRouter } from 'react-router-dom'
import AuthContextProvider from "./context/AuthContext";
import DataContextProvider from "./context/DataContext";
import ThemeContextProvider from "./context/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <DataContextProvider>
        <ThemeContextProvider>
        
          <BrowserRouter>
            <App />
          </BrowserRouter>

        </ThemeContextProvider>
      </DataContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();