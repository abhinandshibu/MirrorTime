import Navbar from 'react-bootstrap/Navbar'
import { Nav, Container } from 'react-bootstrap';
import { auth } from '../../App'

function NavBar(props) {

    return (
        <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand href="/">TimeTracker</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                {props.isLoggedIn ? 
                (<Nav.Link href="/home">Home</Nav.Link>):<></>} 
                {!props.isLoggedIn ? 
                (<Nav.Link href="/login">Login</Nav.Link>) : 
                (<Nav.Link href="/" onClick={() => auth.signOut()}>Logout</Nav.Link>)} 
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}

export default NavBar;