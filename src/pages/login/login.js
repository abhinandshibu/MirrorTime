import { EmailAuthProvider } from "firebase/auth";
import { auth } from "../../App"
import './login.css';

function Login(props) {
    var firebaseui = require('firebaseui');
    var ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
        ui = new firebaseui.auth.AuthUI(auth);
    }

    var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            console.log("AUTH RESULT: " + authResult);
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
    signInSuccessUrl: '/home', // url-to-redirect-to-on-success
    signInOptions: [
        EmailAuthProvider.PROVIDER_ID,
    ]
    };

    ui.start('#firebaseui-auth-container', uiConfig);
    
    return (
         <div id="login">
            <div id="firebaseui-auth-container"></div>
            <div id="loader">Loading...</div>
        </div>
    )
}

export default Login