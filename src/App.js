// import logo from './logo.svg';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, getDocs } from "firebase/firestore";
import { createContext, useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

// NORMAL IMPORTS
import Home from './pages/home';
// import Landing from './pages/landing';
// import Login from './pages/login';

// import { BrowserRouter, Routes, Route, UNSAFE_RouteContext } from "react-router-dom";
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
export const db = getFirestore(app);

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


export const ColourContext = createContext();

export const EventConverter = {
  toFirestore(event) {
    return {
      name: event.name, 
      category: event.category, 
      start: event.start, 
      end: event.end
    };
  },

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      name: data.name, 
      category: data.category, 
      start: data.start, 
      end: data.end
    };
  }
}

const colours = ["fc9f9f", "9ed9d8", "e8c07c", "c38d9e", "41b3a3", "8282b9", "f4d1d1", "e27d60", "bee09d"];

let initPlanEvents = new Map();
let initLifeEvents = new Map();
// [[category name, colour index]]
let initCategories = new Map();

let fetched = false;


async function fetchData(setInitCount) {
  const countSnapshot = await getDoc(doc(collection(db, 'info'), 'count'));

  if (countSnapshot.exists()) {
    // User has used app before, load events and categories (if any)
    setInitCount(countSnapshot.data().count);

    const categorySnapshot = await getDocs(collection(db, 'categories'));
    categorySnapshot.forEach((doc) => {
      initCategories.set(doc.id, doc.data().colour);
      console.log(`category ${doc.id} added`);
    })

    const planSnapshot = await getDocs(collection(db, 'plan').withConverter(EventConverter));
    planSnapshot.forEach((e) => {
      initPlanEvents.set(e.id, e.data());
      console.log(`plan event ${e.id} added`);
    })

    const lifeSnapshot = await getDocs(collection(db, 'life').withConverter(EventConverter));
    lifeSnapshot.forEach((e) => {
      initLifeEvents.set(e.id, e.data());
      console.log(`life event ${e.id} added`);
    })
  }
  else {
    await setDoc(doc(collection(db, 'info'), 'count'), {count: 0});
  }
}


function App() {
  const [initCount, setInitCount] = useState(0);

  // Runs once when page starts, pulls data from firebase
  useEffect(() => {
    if (!fetched) {
      fetchData(setInitCount).catch(console.error);
      fetched = true;
    }
}, []);

  return (
    <ColourContext.Provider value={colours}>
      <Home 
        initCount={initCount}
        initPlanEvents={initPlanEvents}
        initLifeEvents={initLifeEvents}
        initCategories={initCategories}
      />
    </ColourContext.Provider>
  );
}

export default App;
