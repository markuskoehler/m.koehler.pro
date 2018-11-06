import React, {Component} from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import appconfig from './config.js';

class Auth extends Component {
    Login() {
        return (
            <Form>
                <FormGroup>
                    <Label for="exampleEmail">Email</Label>
                    <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
                </FormGroup>
                <FormGroup>
                    <Label for="examplePassword">Password</Label>
                    <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
                </FormGroup>
                <FormGroup check>
                    <Label check>
                        <Input type="checkbox" />{' '}
                        Remember Me
                    </Label>
                </FormGroup><br/>
                <Button onClick={() => alert('hallo')}>Login</Button>
            </Form>
        );
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

//const auth = new Auth();
export default (new Auth());
//export default Auth;
