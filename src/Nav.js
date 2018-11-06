import React, {Component} from 'react';
import {NavLink as RouterNavLink} from "react-router-dom";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    NavItem,
    Nav as RSNav,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";

class Nav extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand tag={RouterNavLink} to="/">React App</NavbarBrand>
                <NavbarToggler onClick={this.toggle}/>
                <Collapse isOpen={this.state.isOpen} navbar>
                    <UserStateMenu signedIn={this.props.signedIn} />
                </Collapse>
            </Navbar>
        );
    }
}

function UserStateMenu(props) {
    const isSignedIn = props.signedIn;
    if(isSignedIn) {
        return <Authenticated auth={props.signedIn}/>;
    }
    return <Unauthenticated/>;
}

function Unauthenticated(props) {
    return (
        <RSNav className="ml-auto" navbar>
        <NavItem>
            <NavLink tag={RouterNavLink} to="/login">Login</NavLink>
        </NavItem>
        </RSNav>
    );
}

function Authenticated(props) {
    return (
        <RSNav className="ml-auto" navbar>
        <NavItem>
            <NavLink tag={RouterNavLink} to="/">Home</NavLink>
        </NavItem>
        <NavItem>
        <NavLink tag={RouterNavLink} to="/about">About</NavLink>
        </NavItem>
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                {props.auth.username}
            </DropdownToggle>
            <DropdownMenu right>
                <DropdownItem tag={RouterNavLink} to="/topics">Topics</DropdownItem>
                <DropdownItem divider/>
                <DropdownItem onClick={_ => props.auth.signOut()}>Logout</DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
        </RSNav>
    );
}

export default Nav;
