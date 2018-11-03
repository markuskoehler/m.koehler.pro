import React, {Component} from 'react';
import {CognitoAuth} from "amazon-cognito-auth-js";

class Auth extends Component {
    onLoad() {
        var react = this;
        var i, items;//, tabs;
        items = document.getElementsByClassName("tab-pane");
        for (i = 0; i < items.length; i++) {
            items[i].style.display = 'none';
        }
        document.getElementById("statusNotAuth").style.display = 'block';
        document.getElementById("statusAuth").style.display = 'none';
        // Initiatlize CognitoAuth object
        //console.log(this.props.signedin);
        var auth = this.initCognitoSDK();
        //console.log(this.props.signedin);
        document.getElementById("signInButton").addEventListener("click", function () {
            react.userButton(auth);//.bind(this);
        });
        var curUrl = window.location.href;
        auth.parseCognitoWebResponse(curUrl);
        //console.log(auth);
    }

    // Initialize a cognito auth object.
    initCognitoSDK() {
        const authData = {
            ClientId: '23lcu1n5bct8omott3q40r7bfe', // Your client id here
            AppWebDomain: 'mk.auth.eu-central-1.amazoncognito.com',
            TokenScopesArray: ['email', 'openid'], // e.g.['phone', 'email', 'profile','openid', 'aws.cognito.signin.user.admin'],
            RedirectUriSignIn: 'http://localhost:3000/callback/',
            RedirectUriSignOut: 'http://localhost:3000/signout/',
            IdentityProvider: 'Facebook', // e.g. 'Facebook',
            UserPoolId: 'eu-central-1_q9VJCoAQt', // Your user pool id here
            AdvancedSecurityDataCollectionFlag: 'false', // e.g. true
        };
        var auth = new CognitoAuth(authData);
        //console.log(authData, auth);
        // You can also set state parameter
        //auth.setState('signedin');
        auth.userhandler = {
            onSuccess: function (result) {
                //alert("Sign in success");
                console.log(result);
                this.showSignedIn(result);
            }.bind(this),
            onFailure: function (err) {
                console.error(err);
                alert("Error!");
            }
        };
        // The default response_type is "token", uncomment the next line will make it be "code".
        // auth.useCodeGrantFlow();
        return auth;
    }

    // Operation when tab is closed.
    closeTab(tabName) {
        document.getElementById(tabName).style.display = 'none';
    }

    // Operation when tab is opened.
    openTab(tabName) {
        document.getElementById(tabName).style.display = 'block';
    }

    // Operations about toggle tab.
    toggleTab() {
        console.log(this.usertab.current);
        if (this.usertab.current.style.display === 'none') {
            this.usertab.current.style.display = 'block';
            document.getElementById("tabIcon").innerHTML = '_';
        } else {
            this.usertab.current.style.display = 'none';
            document.getElementById("tabIcon").innerHTML = '+';
        }
    }

    /*// Operations when showing message.
    showMessage(msgTitle, msgText, msgDetail) {
        var msgTab = document.getElementById('message');
        document.getElementById('messageTitle').innerHTML = msgTitle;
        document.getElementById('messageText').innerHTML = msgText;
        document.getElementById('messageDetail').innerHTML = msgDetail;
        msgTab.style.display = "block";
    }*/

    // Perform user operations.
    userButton(auth) {
        var state = document.getElementById('signInButton').innerHTML;
        //alert(state);
        if (state === "Sign Out") {
            document.getElementById("signInButton").innerHTML = "Sign In";
            auth.signOut();
            this.showSignedOut();
        } else {
            var test = auth.getSession();
            console.log(test);
        }
    }

    // Operations when signed in.
    showSignedIn(session) {
        document.getElementById("statusNotAuth").style.display = 'none';
        document.getElementById("statusAuth").style.display = 'block';
        document.getElementById("signInButton").innerHTML = "Sign Out";
        if (session) {
            var idToken = session.getIdToken().getJwtToken();
            if (idToken) {
                var payload = idToken.split('.')[1];
                var tokenobj = JSON.parse(atob(payload));
                var formatted = JSON.stringify(tokenobj, undefined, 2);
                document.getElementById('idtoken').innerHTML = formatted;
            }
            var accToken = session.getAccessToken().getJwtToken();
            if (accToken) {
                var payload = accToken.split('.')[1];
                var tokenobj = JSON.parse(atob(payload));
                var formatted = JSON.stringify(tokenobj, undefined, 2);
                document.getElementById('acctoken').innerHTML = formatted;
            }
            var refToken = session.getRefreshToken().getToken();
            if (refToken) {
                document.getElementById('reftoken').innerHTML = refToken.substring(1, 20);
            }
        }
        this.openTab("userdetails");
    }

    // Operations when signed out.
    showSignedOut() {
        document.getElementById("statusNotAuth").style.display = 'block';
        document.getElementById("statusAuth").style.display = 'none';
        document.getElementById('idtoken').innerHTML = " ... ";
        //document.getElementById('acctoken').innerHTML = " ... ";
        //document.getElementById('reftoken').innerHTML = " ... ";
        this.closeTab("userdetails");
    }

    Signin() {
        return (
            <div>
                <h2>You have signed in</h2>
            </div>
        );
    }

    Signout() {
        return (
            <div>
                <h2>You have signed out</h2>
            </div>
        );
    }
}

const auth = new Auth();
export default auth;