import logo from './logo.svg';
import './App.css';
import { initializeApp } from "firebase/app";
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

// NORMAL IMPORTS
import NavBar from './components/navbar';
import Landing from './pages/landing';
import Login from './pages/login';
import SideBar from './components/sidebar';
import Timetable from './components/timetable';
import Create from './components/create';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// END OF NORMAL IMPORTS

// FIREBASE AND AUTH SETUP

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, EmailAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAdsFECf-w0-CGJG3U7rKRkEWYUfTQ-Q0w",
  authDomain: "timetracker2-4137b.firebaseapp.com",
  projectId: "timetracker2-4137b",
  storageBucket: "timetracker2-4137b.appspot.com",
  messagingSenderId: "1076991918940",
  appId: "1:1076991918940:web:c9e7f0b0cb53487e5a3799"
};

const app = initializeApp(firebaseConfig);

var auth = getAuth(app);
var firebaseui = require('firebaseui');
var ui = firebaseui.auth.AuthUI.getInstance();
if (!ui) {
  ui = new firebaseui.auth.AuthUI(auth);
}

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: 'https://www.google.com/', // url-to-redirect-to-on-success
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
  ]
};

ui.start('#firebaseui-auth-container', uiConfig);

// END OF FIREBASE AND AUTH SETUP

function App() {
  const [windowVisibility, setWindowVisibility] = useState(false);

  const initEvent = {name: "", category: "", start: 0, end: 0};
  const [eventList, setEventList] = useState([]);
  const [event, setEvent] = useState(initEvent);

  return (
    <div className="App">
      <NavBar />
      
      <div class="main">
        <SideBar setWindowVisibility={setWindowVisibility} />
        <Timetable eventList={eventList} event={event} />
      </div>

      <Create 
        vis={windowVisibility} setVis={setWindowVisibility}
        eventList={eventList} setEventList={setEventList}
        event={event} setEvent={setEvent}
      />
    </div>
  );
}

export default App;
