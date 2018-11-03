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
import './App.css';
import Auth from './Auth.js';

class App extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    // auth part

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    componentDidMount() {
        Auth.onLoad();
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
                    <main className="container">
                        <div className="row">
                            <div className="col-md">
                                <p id="statusNotAuth" title="Status" ref="statusNotAuth">
                                    Sign-In to Continue
                                </p>
                                <p id="statusAuth" title="Status" ref="statusAuth">
                                    You have Signed-In
                                </p>
                                <div className="tabsWell">
                                    <div id="startButtons">
                                        <div className="button">
                                            <a className="nav-tabs" id="signInButton" href="javascript:void(0)"
                                               title="Sign in">Sign
                                                In</a>
                                        </div>
                                    </div>
                                    <div className="tab-content">
                                        <div className="tab-pane" id="userdetails">
                                            <p className="text-icon" title="Minimize" id="tabIcon"
                                               onClick={Auth.toggleTab.bind(this)}>_</p>
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
                                <Route path="/callback" component={Auth.Signin}/>
                                <Route path="/signout" component={Auth.Signout}/>
                            </div>
                        </div>
                    </main>
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
