import React, {Component} from 'react';

import './App.css';
import Auth from './Auth.js';
import Router from './Router.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {signedIn: false};

        this.handleSignedInChange = this.handleSignedInChange.bind(this);
    }

    handleSignedInChange(signedInState) {
        this.setState({ signedIn: signedInState });
    }

    componentDidMount() {

    }

    render() {
        return (
            <Router signedIn={this.state.signedIn}/>
        );
    }
}

export default App;
