import React, { useEffect, useRef, useState } from 'react';
import "../App.css";
import bgImg from "../assets/bg-login.jpg";
import bgImg2 from "../assets/bg-login2.jpg";
import githubIconWhite from "../assets/github-mark-white.png";
import googleIcon from "../assets/googleIcon.png";
import fbIcon from "../assets/facebook-icon.png";
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const LogInForm = () => {

    const [emailLog, setEmailLog] = useState("");
    const [psswLog, setPsswLog] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);

    const firstAccessData = useSelector((state) => state.authors.firstAccessData);

    const submitLog = async () => {
        const payload = {
            email: emailLog,
            password: psswLog
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERBASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const res = await response.json();
            console.log(res.token);
            const redirectionSuccess = () => {//handle success login function: spinner and redirection.
                setLoginSuccess(true);
                setLoginFailed(false);
                setTimeout(() => { window.location.replace('http://localhost:3000/') }, 2000)
            };
            res.token ? redirectionSuccess() : setLoginFailed(true);//if token exists, successFunction is executed, else setLoginFailed is setted on true

            localStorage.setItem("loginData", res.token);
            return res

        } catch (error) {
            localStorage.setItem("loginData", error)
            console.log("login non riuscito");
        }
    };



    const handleLoginGithub = () => {
        window.location.href = "http://localhost:5050/auth/github"
    };
    const handleLoginGoogle = () => {
        window.location.href = "http://localhost:5050/auth/google"
    };
    const handleLoginFacebook = () => {
        window.location.href = "http://localhost:5050/auth/facebook"
    };

    useEffect(() => {
        console.log(firstAccessData);
        setEmailLog(firstAccessData.email);
        setPsswLog(firstAccessData.pssw)
    }, [])


    return (
        <div className='myLogInForm d-flex justify-content-center align-items-center' style={{ background: `url(${bgImg2})` }}>
            <div className='d-flex justify-content-center align-items-center shadow'>
                <section className='text-center'>
                    <h3 className='fw-light'>Login</h3>
                    <div>
                        <input type="text" onChange={(e) => setEmailLog(e.target.value)} value={emailLog} placeholder='email' />
                    </div>
                    <div>
                        <input type="password" onChange={(e) => setPsswLog(e.target.value)} value={psswLog} placeholder='password' />
                    </div>
                    <Button className='mt-3 shadow' variant="primary" onClick={() => submitLog()}><i className="bi bi-fingerprint text-light"></i>login</Button>
                    {loginSuccess ? <div className='text-success mt-2'><i className="bi bi-patch-check-fill"> succesfully login!</i><Spinner animation="border" size="sm" /></div> : null}
                    {loginFailed ? <div className='text-danger mt-2 myFailedLogin'><i className="bi bi-exclamation-triangle"> login failed!</i></div> : null}
                    <Link to="/signin" className='text-secondary' style={{ textDecoration: "none" }}>
                        <div className='mt-2 text-primary'><i className='text-dark'>Don't you have an account?</i><a href="">Sign in</a></div>
                    </Link>
                    <hr />
                    {/* <div className='d-flex justify-content-center'>
                        <Button className='d-flex align-items-center rounded-1 shadow' variant="dark" onClick={() => handleLoginGithub()}> <img className='githubImg me-2' src={githubIconWhite} alt="img" /> login with GitHub</Button>
                    </div> */}
                    <div className='d-flex justify-content-center'>
                        <Button className='d-flex align-items-center mt-2 rounded-1 shadow' variant="light" onClick={() => handleLoginGoogle()}> <img className='githubImg me-2' src={googleIcon} alt="img" /> login with Google</Button>
                    </div>
                    {/* <div className='d-flex justify-content-center'>
                        <Button className='d-flex align-items-center mt-2 rounded-1 shadow' variant="primary" onClick={() => handleLoginFacebook()}> <img className='githubImg me-2' src={fbIcon} alt="img" /> login with Facebook</Button>
                    </div> */}
                </section>
            </div>
        </div>
    )
}

export default LogInForm