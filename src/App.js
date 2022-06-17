// import logo from './logo.svg';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, deleteDoc, getDoc, getDocs } from "firebase/firestore";
import { createContext, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

// NORMAL IMPORTS
import Home from './pages/home';
import Landing from './pages/landing';
import Login from './pages/login';

import { BrowserRouter, Routes, Route, UNSAFE_RouteContext } from "react-router-dom";
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
      index: event.index,
      name: event.name, 
      category: event.category, 
      start: event.start, 
      end: event.end
    };
  },

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      index: data.index,
      name: data.name, 
      category: data.category, 
      start: data.start, 
      end: data.end
    };
  }
}

function App() {
  const colours = ["fc9f9f", "9ed9d8", "e8c07c", "c38d9e", "41b3a3", "8282b9", "f4d1d1", "e27d60", "bee09d"];

  let initCount = 0;
  let initPlanEvents = [];
  let initLifeEvents = [];

  // Runs once when page starts, pulls data from firebase
  useEffect(() => {
    const count = doc(collection(db, 'info'), 'count');

    const checkDatabase = async () => {
      const countSnap = await getDoc(count);

      if (countSnap.exists()) { // User has used app before, load events (if any)
        initCount = countSnap.data().count;
        console.log(initCount);

        const planSnap = await getDocs(collection(db, 'plan').withConverter(EventConverter));
        planSnap.forEach((e) => {
          initPlanEvents.push(e.data());
          console.log(`event ${e.data().index} added`);
        })
        console.log(initPlanEvents);

        const lifeSnap = await getDocs(collection(db, 'life').withConverter(EventConverter));
        lifeSnap.forEach((e) => {
          initLifeEvents.push(e.data());
          console.log(`event ${e.data().index} added`);
        })
        console.log(initLifeEvents);

      } else {
        await setDoc(count, {count: 0});
      }
    }
    
    checkDatabase().catch(console.error);
  }, []);

  return (
    <ColourContext.Provider value={colours}>
      <Home 
        initCount={initCount}
        initPlanEvents={initPlanEvents}
        initLifeEvents={initLifeEvents}
      />
    </ColourContext.Provider>
  );
}

export default App;
