import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import Spinner from 'react-bootstrap/esm/Spinner';

const Success = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    const saveToken = () => {
        if (token) { localStorage.setItem("loginData", token) }
    };
    const redirectToHome = () => {
        setTimeout(()=>{window.location.replace('http://localhost:3000/')}, 1500)
    }
    useEffect(() => {
        redirectToHome();
        if (token) { saveToken() }
    }, [token])

    return (
        <div className='d-flex justify-content-center mt-3'>
            {token ? <div className='text-success mt-2'><i className="bi bi-patch-check-fill"> succesfully login!</i><Spinner animation="border" size="sm" /></div>:
            <div className='text-danger mt-2'><i className="bi bi-exclamation-triangle-fill"> login failed!</i></div>}
        </div>
    )
}

export default Success