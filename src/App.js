import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { doc, collection, setDoc, getDoc, getDocs } from "firebase/firestore";

import 'bootstrap/dist/css/bootstrap.min.css';

// NORMAL IMPORTS
import Home from './pages/home/home';
import Landing from './pages/landing/landing';
import Login from './pages/login/login';
import Analytics from './pages/analytics/analytics'
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

// FUNCTION FOR FETCHING DATA

let fetched = false;

async function fetchData(setCount, setCategories, setPlanEvents, setLifeEvents) {
  const countSnapshot = await getDoc(doc(db, 'info', 'count'));

  if (countSnapshot.exists()) {
    // User has used app before, set current event index and load events (if any)
    setCount(countSnapshot.data().count);

    const planSnapshot = await getDocs(collection(db, 'plan'));
    planSnapshot.forEach((e) => {
      setPlanEvents( map => new Map ( map.set( e.id, e.data() ) ) );
    })

    const lifeSnapshot = await getDocs(collection(db, 'life'));
    lifeSnapshot.forEach((e) => {
      setLifeEvents( map => new Map ( map.set( e.id, e.data() ) ) );
    })
  }
  else {
    await setDoc(doc(db, 'info', 'count'), {count: 0});
  }

  const categorySnapshot = await getDocs(collection(db, 'categories'));
    categorySnapshot.forEach((doc) => {
      setCategories( map => new Map( map.set( doc.id, doc.data().colour ) ) );
    })
}

// END OF FUNCTION FOR FETCHING DATA


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Runs once when the page starts, links up the authentication to the isLoggedIn variable
  useEffect(() => {
    console.log("AUTH")
    console.log(auth);

    return () => onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(user);
    });
  }, []);
   
  const [categories, setCategories] = useState(new Map());
  const [planEvents, setPlanEvents] = useState(new Map());
  const [lifeEvents, setLifeEvents] = useState(new Map());
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!fetched) {
      fetchData(setCount, setCategories, setPlanEvents, setLifeEvents).catch(console.error);
      fetched = true;
    }
  }, []);

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
            {/* <Home /> */}
            <Home categories={categories} setCategories={setCategories} 
              planEvents={planEvents} setPlanEvents={setPlanEvents}
              lifeEvents={lifeEvents} setLifeEvents={setLifeEvents}/>
          </ColourContext.Provider>
        </Route>
        <Route exact path="/analytics">
          <ColourContext.Provider value={colours}>
            <Analytics categories={categories} setCategories={setCategories} 
              planEvents={planEvents} setPlanEvents={setPlanEvents}
              lifeEvents={lifeEvents} setLifeEvents={setLifeEvents}
              count={count} setCount={setCount}/>
          </ColourContext.Provider>
        </Route>
        
      </Switch>
    </Router>
  );
}

export default App;
