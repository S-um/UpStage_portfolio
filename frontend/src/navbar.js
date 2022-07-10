import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import { useEffect, useState } from 'react';
import './navbar.css'
import logo from './logo.png'

function DynamicNavbar({ sections, navbarRef }) {
    // Variable
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Function
    const moveScrollTo = (hash) => {
        console.log("move to : ", hash)
        if (sections[hash]) {
            const offset = sections[hash].current.offsetTop - 100;
            window.scrollTo({
                top: offset > 0 ? offset : 0,
                behavior: 'auto',
            });
        }
    }
    const controlNavbar = () => {
        if (typeof window !== 'undefined') {
            setShow(window.scrollY <= lastScrollY || window.scrollY < 300);
            setLastScrollY(window.scrollY);
        }
    }
    const moveScrollToByEvent = (event) => { console.log(event); moveScrollTo(event.target.hash) };

    useEffect(() => {
        moveScrollTo(window.location.hash)
    }, [])
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);

            return () => {
                window.removeEventListener('scroll', controlNavbar);
            }
        }
    })

    return (
        <Navbar ref={navbarRef} className="dynamicNavbar" style={show ? null : { "transform": "translateY(-100%)" }} collapseOnSelect expand="lg" bg="black" variant="dark" fixed="top">
            <Container>
                <Navbar.Brand><img width="50%" alt="MyeongSuk Yoon" src={logo} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto"></Nav>
                    <Nav>
                        <Nav.Link onClick={moveScrollToByEvent} href="#home">Home</Nav.Link>
                        <Nav.Link onClick={moveScrollToByEvent} href="#jupyternotebook">JupyterNotebook</Nav.Link>
                        <Nav.Link onClick={moveScrollToByEvent} href="#architecture">Architecture</Nav.Link>
                        <NavDropdown title="more" id="collasible-nav-dropdown" menuVariant="dark">
                            <NavDropdown.Item onClick={moveScrollToByEvent} href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={moveScrollToByEvent} href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/login">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
export default DynamicNavbar;