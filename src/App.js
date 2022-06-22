import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

// NORMAL IMPORTS
import Home from './pages/home/home';
import Landing from './pages/landing/landing';
import Login from './pages/login/login';
// END OF NORMAL IMPORTS

// FIREBASE AND AUTH SETUP

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from "./components/navbar/navbar";

const firebaseConfig = {
  apiKey: "AIzaSyAdsFECf-w0-CGJG3U7rKRkEWYUfTQ-Q0w",
  authDomain: "timetracker2-4137b.firebaseapp.com",
  projectId: "timetracker2-4137b",
  storageBucket: "timetracker2-4137b.appspot.com",
  messagingSenderId: "1076991918940",
  appId: "1:1076991918940:web:c9e7f0b0cb53487e5a3799"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);

// END OF FIREBASE AND AUTH SETUP

export const ColourContext = createContext();
const colours = ["fc9f9f", "9ed9d8", "e8c07c", "c38d9e", "41b3a3", "8282b9", "f4d1d1", "e27d60", "bee09d"];

export const toYmd = (date) => {
  return {year: date.getFullYear(), month: date.getMonth(), date: date.getDate()};
};

export const months = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];

function App() {
  // Runs once when the page starts, links up the authentication to the isLoggedIn variable
  useEffect(() => {
    console.log("AUTH")
    console.log(auth);

    return () => onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(user);
    });
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn}/>

      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route exact path="/login">
          <Login setIsLoggedIn={setIsLoggedIn}/>
        </Route>
        <Route exact path="/home">
          <ColourContext.Provider value={colours}>
            <Home />
          </ColourContext.Provider>
        </Route>
        
      </Switch>
    </Router>
  );
}

export default App;
