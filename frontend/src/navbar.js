import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import { useEffect, useState } from 'react';
import './navbar.css'
import logo from './logo.png'

function DynamicNavbar({ sections, navbarRef }) {
    // Variable
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [loginInfo, setLoginInfo] = useState({ isValid: false, info: {} })

    // Function
    const moveScrollTo = (hash, isFirst) => {
        setTimeout(() => {
            if (sections[hash]) {
                const offset = sections[hash].current.offsetTop - 100;
                window.scrollTo({
                    top: offset > 0 ? offset : 0,
                    behavior: 'auto',
                });
            }
        }, isFirst ? 100 : 0);
    }
    const controlNavbar = () => {
        if (typeof window !== 'undefined') {
            setShow(window.scrollY <= lastScrollY || window.scrollY < 300);
            setLastScrollY(window.scrollY);
        }
    }
    const moveScrollToByEvent = (event) => { console.log(event); moveScrollTo(event.target.hash) };

    useEffect(() => {
        moveScrollTo(window.location.hash, true)
    }, []);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);

            return () => {
                window.removeEventListener('scroll', controlNavbar);
            }
        }
    });
    useEffect(() => {
        fetch("/self-service/logout/browser").then(async (resp) => {
            switch (resp.status) {
                case 200:
                    setLoginInfo({ isValid: true, info: await resp.json() })
                    break;
                case 401:
                    setLoginInfo({ isValid: false, info: {} })
                    break;
                default:
                    setLoginInfo({ isValid: false, info: {} })
                    break;
            }
        });
    }, []);

    return (
        <Navbar ref={navbarRef} className="dynamicNavbar" style={show ? null : { "transform": "translateY(-100%)" }} collapseOnSelect expand="lg" bg="black" variant="dark" fixed="top">
            <Container>
                <Navbar.Brand><img width="50%" alt="MyeongSuk Yoon" src={logo} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto"></Nav>
                    <Nav>
                        <Nav.Link href="https://github.com/S-um/UpStage_portfolio" target="_blank">SourceCode</Nav.Link>
                        <Nav.Link onClick={moveScrollToByEvent} href="#home">Home</Nav.Link>
                        <Nav.Link onClick={moveScrollToByEvent} href="#jupyternotebook">JupyterNotebook</Nav.Link>
                        <Nav.Link onClick={moveScrollToByEvent} href="#architecture">Architecture</Nav.Link>
                        <NavDropdown title="more" id="collasible-nav-dropdown" menuVariant="dark">
                            <NavDropdown.Item onClick={moveScrollToByEvent} href="#feature">특징</NavDropdown.Item>
                            <NavDropdown.Item onClick={moveScrollToByEvent} href="#skills">Skills</NavDropdown.Item>
                            <NavDropdown.Item onClick={moveScrollToByEvent} href="#review">Portfolio Review</NavDropdown.Item>
                        </NavDropdown>
                        {
                            loginInfo.isValid ? <Nav.Link href={loginInfo.info.logout_url}>Logout</Nav.Link> : <Nav.Link href="https://login.upstage.ga/login">Login</Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
export default DynamicNavbar;