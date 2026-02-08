// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(

//     <App />

// )


// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import "./index.css";
// import { GoogleOAuthProvider } from "@react-oauth/google";


// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );


// <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
//   <App />
// </GoogleOAuthProvider>


// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App";
// import "./index.css";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//       <App />
//     </GoogleOAuthProvider>
//   </StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log("🔥 GOOGLE CLIENT ID:", clientId);

ReactDOM.createRoot(document.getElementById("root")).render(

    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>

);

// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import "./index.css";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// console.log("🔥 GOOGLE CLIENT ID:", clientId);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <GoogleOAuthProvider clientId={clientId}>
//       <App />
//     </GoogleOAuthProvider>
//   </React.StrictMode>
// );


