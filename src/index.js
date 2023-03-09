import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignInConfirm from './pages/SignInConfirm';
import Home, { homeLoader } from './pages/Home';

const router = createBrowserRouter([
    {
    path: "/",
     element: <App/>,
    //  errorElement: <ErrorPage/>,
     children: [
        {
            path: "/",
            // loader:homeLoader,
            element: <Home/>
        },
        {
            path: "confirm",
            element: <SignInConfirm/>
        },
        // {
        //     path: "/contact/:id",
        //     element: <ContactDetails/>
        // },
    ]
}
])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);
