import './navbar.css';
import { auth } from '../../../App'

import Navbar from 'react-bootstrap/Navbar'
import { Nav, Container } from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

function NavBar(props) {

    return (
        <Navbar id="navbar" bg="light" expand="lg">
        <Container>
            <Navbar.Brand id="navbar-name" href="/">Mirror</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {props.isLoggedIn ? 
                    (<Nav.Link href="/home">Home</Nav.Link>):<></>} 
                    <Nav.Link href="/analytics">Analytics</Nav.Link>
                    {!props.isLoggedIn ? 
                    (<Nav.Link href="/login">Login</Nav.Link>) : 
                    (<Nav.Link href="/" onClick={() => auth.signOut()}>Logout</Nav.Link>)}
                </Nav>
                <div className="toggle-theme"><BootstrapSwitchButton 
                    onlabel="Dark" offlabel="Light" onstyle="dark" offstyle="secondary" width={100}
                    onChange={props.toggleTheme} checked={props.theme === "dark"}
                /></div>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}

export default NavBar;