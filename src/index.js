import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignInConfirm from './pages/SignInConfirm';
import Chat from './components/Chat';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
    {
    path: "/",
     element: <App/>,
     errorElement: <ErrorPage/>,
     children: [
        {
            path: "/",
            element: <Chat/>
        },
        {
            path: "confirm",
            element: <SignInConfirm/>
        },
    ]
}
])


ReactDOM.render(
    <RouterProvider router={router} />
,
  document.getElementById("root")
);
    

