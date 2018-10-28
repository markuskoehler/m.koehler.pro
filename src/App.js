import React, {Component} from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import {BrowserRouter as Router, Route, Link, NavLink as RouterNavLink} from "react-router-dom";
import {CognitoAuth} from 'amazon-cognito-auth-js';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    onLoad() {
        var react = this;
        var i, items, tabs;
        items = document.getElementsByClassName("tab-pane");
        for (i = 0; i < items.length; i++) {
            items[i].style.display = 'none';
        }
        document.getElementById("statusNotAuth").style.display = 'block';
        document.getElementById("statusAuth").style.display = 'none';
        // Initiatlize CognitoAuth object
        var auth = this.initCognitoSDK();
        document.getElementById("signInButton").addEventListener("click", function() {
            react.userButton(auth);//.bind(this);
        });
        var curUrl = window.location.href;
        var test = auth.parseCognitoWebResponse(curUrl);
        //console.log(auth);
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
        if (this.usertab.current.style.display == 'none') {
            this.usertab.current.style.display = 'block';
            document.getElementById("tabIcon").innerHTML = '_';
        } else {
            this.usertab.current.style.display = 'none';
            document.getElementById("tabIcon").innerHTML = '+';
        }
    }
    // Operations when showing message.
    showMessage(msgTitle, msgText, msgDetail) {
        var msgTab = document.getElementById('message');
        document.getElementById('messageTitle').innerHTML = msgTitle;
        document.getElementById('messageText').innerHTML = msgText;
        document.getElementById('messageDetail').innerHTML = msgDetail;
        msgTab.style.display = "block";
    }
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
                //var formatted = JSON.stringify(tokenobj, undefined, 2);
                document.getElementById('idtoken').innerHTML = tokenobj.email;
            }
            /*var accToken = session.getAccessToken().getJwtToken();
            if (accToken) {
                var payload = accToken.split('.')[1];
                var tokenobj = JSON.parse(atob(payload));
                var formatted = JSON.stringify(tokenobj, undefined, 2);
                document.getElementById('acctoken').innerHTML = formatted;
            }
            var refToken = session.getRefreshToken().getToken();
            if (refToken) {
                document.getElementById('reftoken').innerHTML = refToken.substring(1, 20);
            }*/
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

// Initialize a cognito auth object.
    initCognitoSDK() {
        var authData = {
            ClientId : '23lcu1n5bct8omott3q40r7bfe', // Your client id here
            AppWebDomain : 'mk.auth.eu-central-1.amazoncognito.com',
            TokenScopesArray : ['email','openid'], // e.g.['phone', 'email', 'profile','openid', 'aws.cognito.signin.user.admin'],
            RedirectUriSignIn : 'https://localhost:3000/callback/',
            RedirectUriSignOut : 'https://localhost:3000/signout/',
            IdentityProvider : 'Facebook', // e.g. 'Facebook',
            UserPoolId : 'eu-central-1_q9VJCoAQt', // Your user pool id here
            AdvancedSecurityDataCollectionFlag : 'false', // e.g. true
        };
        var auth = new CognitoAuth(authData);
        //console.log(authData, auth);
        // You can also set state parameter
        // auth.setState(<state parameter>);
        auth.userhandler = {
            onSuccess: function(result) {
                //alert("Sign in success");
                console.log(result);
                this.showSignedIn(result);
            }.bind(this),
            onFailure: function(err) {
                console.error(err);
                alert("Error!");
            }
        };
        // The default response_type is "token", uncomment the next line will make it be "code".
        // auth.useCodeGrantFlow();
        return auth;
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    componentDidMount() {
        this.onLoad();
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <Navbar color="light" light expand="md">
                        <NavbarBrand tag={RouterNavLink} to="/">React App</NavbarBrand>
                        <NavbarToggler onClick={this.toggle}/>
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink tag={RouterNavLink} to="/">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={RouterNavLink} to="/about">About</NavLink>
                                </NavItem>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        Options
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem tag={RouterNavLink} to="/topics">Topics</DropdownItem>
                                        <DropdownItem divider/>
                                        <DropdownItem>Logout</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav>
                        </Collapse>
                    </Navbar>

                    <p id="statusNotAuth" title="Status" ref="statusNotAuth">
                        Sign-In to Continue
                    </p>
                    <p id="statusAuth" title="Status" ref="statusAuth">
                        You have Signed-In
                    </p>
                    <div className="tabsWell">
                        <div id="startButtons">
                            <div className="button">
                                <a className="nav-tabs" id="signInButton" href="javascript:void(0)" title="Sign in">Sign
                                    In</a>
                            </div>
                        </div>
                        <div className="tab-content">
                            <div className="tab-pane" id="userdetails">
                                <p className="text-icon" title="Minimize" id="tabIcon"
                                   onClick={this.toggleTab.bind(this)}>_</p>
                                <br/>
                                <h2 id="usertabtitle">You are:</h2>
                                <div className="user-form" id="usertab">
                                    <pre id="idtoken"> ... </pre>
                                    <pre id="acctoken">  </pre>
                                    <pre id="reftoken">  </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Route exact path="/" component={Home}/>
                    <Route path="/about" component={About}/>
                    <Route path="/topics" component={Topics}/>
                </div>
            </Router>
        );
    }
}

function Home() {
    return (
        <main>
            <header className="App-header">
                <h2>Home</h2>
            </header>
        </main>
    );
}

function About() {
    return (
        <div>
            <h2>About</h2>
        </div>
    );
}

function Topics({match}) {
    return (
        <div>
            <h2>Topics</h2>
            <ul>
                <li>
                    <Link to={`${match.url}/rendering`}>Rendering with React</Link>
                </li>
                <li>
                    <Link to={`${match.url}/components`}>Components</Link>
                </li>
                <li>
                    <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
                </li>
            </ul>

            <Route path={`${match.path}/:topicId`} component={Topic}/>
            <Route
                exact
                path={match.path}
                render={() => <h3>Please select a topic.</h3>}
            />
        </div>
    );
}

function Topic({match}) {
    return (
        <div>
            <h3>{match.params.topicId}</h3>
        </div>
    );
}

export default App;
