import logo from './logo.svg';
import './App.css';
import { initializeApp } from "firebase/app";

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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div id="firebaseui-auth-container"></div>
        <div id="loader">Loading...</div>
        <p>hello world</p>
      </header>
    </div>
  );
}

export default App;
