import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { useDispatch, useSelector } from 'react-redux';
import { saveAuthor_id } from "../states/authorState";
import Logo from "../assets/logo.png";
import MenuMain from './MenuMain';
import MenuAside from './MenuAside';

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

                </Container>
            </nav>
            <div className='myNavSpacer'></div>


            {
                isOpen ?
                    <div className='myAsideMenu position-fixed top-0 end-0'>
                        {
                            <MenuAside
                                userFullName={userFullName}
                            />
                        }
                    </div> :
                    null
            }


            {
                menuOpen && !isOpen ?
                    <div className='myMainMenu position-fixed top-0'>
                        {
                            <MenuMain
                                userFullName={userFullName}
                            />
                        }
                    </div> :
                    null
            }

        </>
    )
}

export default NavigationBar