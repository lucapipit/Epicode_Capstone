import React from 'react';
import { Link } from 'react-router-dom';


const MenuAside = ({userFullName}) => {
    return (
        <>
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
            </div>
        </>
    )
}

export default MenuAside