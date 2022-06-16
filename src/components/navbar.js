import Navbar from 'react-bootstrap/Navbar'
import { NavDropdown, Nav, Container } from 'react-bootstrap';

function NavBar() {
    const isLoggedIn = false;

    var contents;

    if (isLoggedIn) {
        contents = (
            <>
                <Nav.Link href="/logout">Logout</Nav.Link>
            </>   
        )
    } else {
        contents = (
            <>
                <Nav.Link href="/login">Login</Nav.Link>
            </>   
        )
    }

    return (
        <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand href="/">TimeTracker</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                {contents}
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}

export default NavBar;