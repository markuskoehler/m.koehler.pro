import React, {Component} from 'react';
import Auth from "./Auth";
import Nav from './Nav.js';
import {BrowserRouter as BRouter, Route, Link} from "react-router-dom";
import axios from 'axios';

class Router extends Component {
    render() {
        return (
            <BRouter>
                <div className="App">
                    <Nav signedIn={this.props.signedIn}/>
                    <main className="container">
                        <div className="row">
                            <div className="col-md">
                                <div className="tabsWell">
                                    <div className="tab-content">
                                        <div className="tab-pane" id="userdetails">
                                            <p className="text-icon" title="Minimize" id="tabIcon"
                                               onClick={Auth.toggleTab.bind(this)}>_</p>
                                            <br/>
                                            <h2 id="usertabtitle">You are:</h2>
                                            <div className="user-form" id="usertab">
                                                <pre id="idtoken"> ... </pre>
                                                <pre id="acctoken"> ... </pre>
                                                <pre id="reftoken"> ... </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Route exact path="/" component={Home}/>
                                <Route path="/about" component={About}/>
                                <Route path="/topics" component={Topics}/>
                                <Route path="/callback" component={Auth.Signin}/>
                                <Route path="/signout" component={Auth.Signout}/>
                            </div>
                        </div>
                    </main>
                </div>
            </BRouter>
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
    oauth2request();
    return (
        <div>
            <h2>About</h2>
            <div id="apidata"></div>
        </div>
    );
}

function oauth2request() {
    const USER_GRANT_TYPE = 'client_credentials';
    const CLIENT_ID = '1';
    const CLIENT_SECRET = '1nYqkBmdSPNWzmpdh054nzZ1JGRzbhhmr14lyCGQ';
    // https://qa.m-api.koehler.pro/auth/callback
    const TOKEN_URL = 'https://qa.m-api.koehler.pro/oauth/token';
    let USER_TOKEN = '';
    let URL = 'https://qa.m-api.koehler.pro/api/user';

    const data = {
        grant_type: USER_GRANT_TYPE,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    };

    const bodyFormData = new FormData();
    bodyFormData.set('grant_type', USER_GRANT_TYPE);
    bodyFormData.set('client_id', CLIENT_ID);
    bodyFormData.set('client_secret', CLIENT_SECRET);

    if (!sessionStorage.getItem("accessToken")) {
        axios.post(TOKEN_URL, bodyFormData, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response => {
                console.log(response.data);
                USER_TOKEN = response.data.access_token;
                sessionStorage.setItem('accessToken', USER_TOKEN);
                //window.sessionStorage.accessToken = USER_TOKEN;
                //console.log('userresponse ' + response.data.access_token);
            })
            .catch((error) => {
                console.log('error ' + error);
            });
    } else {
        USER_TOKEN = sessionStorage.getItem("accessToken");
    }

    const AuthStr = 'Bearer ' + USER_TOKEN;
    axios.get(URL, { headers: { 'Authorization': AuthStr } })
        .then(response => {
            // If request is good...
            console.log(response.data);
            document.getElementById('apidata').innerHTML = response.data;
        })
        .catch((error) => {
            console.log('error ' + error);
        });
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

export default Router;
