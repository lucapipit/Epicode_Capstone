import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveAuthor_id } from "../states/authorState";
import Logo from "../assets/logo.png"

const NavigationBar = () => {

    const dispatch = useDispatch();
    //aside menu
    const [isOpen, setIsopen] = useState(false);

    //aside menu
    const [menuOpen, setMenuOpen] = useState(false);

    //user name & surname
    const [userFullName, setUserFullName] = useState(null);
    const getUserData = () => {
        const token = localStorage.getItem("loginData");
        if (token) {
            try {
                const userData = jwtDecode(token, process.env.JWT_SECRET);
                setUserFullName(userData);
                dispatch(saveAuthor_id(userData));
            } catch (error) {
                console.log(error);
            }
        }
        return
    };

    useEffect(() => {
        getUserData();
    }, [])

    return (

        <>
            <nav expand="lg" className="myNav bg-body-tertiary shadow-sm position-fixed w-100 top-0">
                <Container className="myNav d-flex justify-content-between align-items-center">
                    {/* <Navbar.Brand href="#home">
                        <Link to="/" className='text-decoration-none'>
                            <Navbar.Brand ><i class="bi bi-house me-1"></i>MedicalBlog</Navbar.Brand>
                        </Link>
                    </Navbar.Brand> */}
                    <div>
                        <a href="http://localhost:3000/">
                            <img src={Logo} alt="logo" height={"70px"} />
                        </a>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            {
                                userFullName ?
                                    <div className="d-flex align-items-center">
                                        <i>{userFullName.displayName ? userFullName.displayName : userFullName.name + " " + userFullName.surname}</i>
                                        <div className='myAuthorImg-sm' style={{ backgroundImage: `url(${userFullName.authorImg})` }} onClick={() => { setIsopen(!isOpen); setMenuOpen(false) }}></div>
                                    </div> :
                                    <div className="d-flex align-items-center">
                                        <i>account</i>
                                        <div className='myAuthorImg-sm' style={{ backgroundImage: `url(https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg)` }} onClick={() => setIsopen(!isOpen)}></div>
                                    </div>
                            }
                        </div>
                        <div>
                            <i class="bi bi-grid-fill ms-3" onClick={() => { setIsopen(false); setMenuOpen(!menuOpen) }}></i>
                        </div>
                    </div>
                    {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto d-flex align-items-center">
                            <div className='d-flex align-items-center'>
                                {
                                    userFullName ?
                                        <>
                                            <div className='myAuthorImg-sm mx-2' style={{ backgroundImage: `url(${userFullName.authorImg})` }}></div>
                                            <i>{userFullName.displayName ? userFullName.displayName : userFullName.name + " " + userFullName.surname}</i>
                                        </> :
                                        <div>
                                            <Nav.Link >
                                                <Link to="/logIn" className='text-secondary' style={{ textDecoration: "none" }}>
                                                    <a ><i class="bi bi-person-fill"></i>Log in</a>
                                                </Link>
                                            </Nav.Link>
                                            <Nav.Link >
                                                <Link to="/signin" className='text-secondary' style={{ textDecoration: "none" }}>
                                                    <a><i class="bi bi-person-fill-add"></i>Sign In</a>
                                                </Link>
                                            </Nav.Link>
                                        </div>
                                }
                            </div>
                        </Nav>
                    </Navbar.Collapse> */}
                </Container>
            </nav>
            <div className='myNavSpacer'></div>


            {
                isOpen ?
                    <div className='myAsideMenu position-fixed top-0 end-0'>
                        {
                            !userFullName ?
                                <div className='d-flex flex-column gap-2'>
                                    <Link to="/logIn" className='text-secondary' style={{ textDecoration: "none" }}>
                                        <a ><i class="bi bi-person-fill"></i>Log in</a>
                                    </Link>
                                    <Link to="/signin" className='text-secondary' style={{ textDecoration: "none" }}>
                                        <a><i class="bi bi-person-fill-add"></i>Sign In</a>
                                    </Link>
                                    <hr />
                                    <Link to="/" className='text-secondary' style={{ textDecoration: "none" }}>
                                        <a><i class="bi bi-info-circle-fill"></i>About Us</a>
                                    </Link>
                                    <Link to="/" className='text-secondary' style={{ textDecoration: "none" }}>
                                        <a><i class="bi bi-person-lines-fill"></i>Contacts</a>
                                    </Link>
                                </div> :
                                null
                        }
                    </div> :
                    null
            }


            {
                menuOpen && !isOpen ?
                    <div className='myMainMenu position-fixed top-0'>
                        {
                            !userFullName ?
                                <div className='gap-2'>
                                    <div className='d-flex justify-content-center flex-wrap gap-2'>
                                        <Link to="/logIn" className='text-secondary' style={{ textDecoration: "none" }}>
                                            <div className='singleBox'><a ><i class="bi bi-person-fill"></i>Log in</a></div>
                                        </Link>
                                        <Link to="/signin" className='text-secondary' style={{ textDecoration: "none" }}>
                                            <div className='singleBox'><a><i class="bi bi-person-fill-add"></i>Sign In</a></div>
                                        </Link>
                                    </div>
                                    <hr />
                                    <div className='d-flex justify-content-center flex-wrap gap-2'>
                                        <Link to="/" className='text-secondary' style={{ textDecoration: "none" }}>
                                            <div className='singleBox'><a><i class="bi bi-info-circle-fill"></i>About Us</a></div>
                                        </Link>
                                        <Link to="/" className='text-secondary' style={{ textDecoration: "none" }}>
                                            <div className='singleBox'><a><i class="bi bi-person-lines-fill"></i>Contacts</a></div>
                                        </Link>
                                    </div>
                                </div> :
                                null
                        }
                    </div> :
                    null
            }

        </>
    )
}

export default NavigationBar