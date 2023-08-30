import React, { useRef, useState } from 'react';
import "../App.css";
import bgImg from "../assets/bg-login.jpg";
import bgImg2 from "../assets/bg-login2.jpg";
import githubIconWhite from "../assets/github-mark-white.png";
import googleIcon from "../assets/googleIcon.png";
import fbIcon from "../assets/facebook-icon.png";
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const SignInForm = () => {

    const emailSign = useRef("");
    const psswSign = useRef("");
    const nameSign = useRef("");
    const surnameSign = useRef("");
    const dobSign = useRef("");
    const imgSign = useRef("");
    const avatarSign = useRef("");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);

    const submitSign = async () => {
        const payload = {
            name: nameSign.current.value,
            surname: surnameSign.current.value,
            email: emailSign.current.value,
            password: psswSign.current.value,
            avatar: avatarSign.current.value,
            dob: dobSign.current.value,
            authorImg: imgSign.current.value
        }
        try {
            const response = await fetch("http://localhost:5050/authors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            const data = response.json();
            console.log(data);
            return data

        } catch (error) {
            console.log(error);
        }
        
}

return (
    <div className='mySignInForm d-flex justify-content-center align-items-center' style={{ background: `url(${bgImg2})` }}>
        <div className='d-flex justify-content-center align-items-center shadow my-3 py-5'>
            <section className='text-center'>
                <h3 className='fw-light'>Sign In</h3>
                <div>
                    <input type="text" ref={nameSign} placeholder='name' />
                </div>
                <div>
                    <input type="text" ref={surnameSign} placeholder='surname' />
                </div>
                <div>
                    <input type="text" ref={avatarSign} placeholder='avatar' />
                </div>
                <div>
                    <input type="date" ref={dobSign} placeholder='date of birth' />
                </div>
                <div>
                    <i class="bi bi-person-bounding-box"> <input type="text" ref={imgSign} placeholder='insert an image url' /></i>

                </div>
                <div>
                    <input type="text" ref={emailSign} placeholder='email' />
                </div>
                <div>
                    <input type="password" ref={psswSign} placeholder='password' />
                </div>
                <Button className='mt-3 shadow' variant="primary" onClick={() => submitSign()}><i class="bi bi-person-check-fill text-light"></i>create</Button>
                {loginSuccess ? <div className='text-success mt-2'><i class="bi bi-patch-check-fill"> succesfully login!</i><Spinner animation="border" size="sm" /></div> : null}
                {loginFailed ? <div className='text-danger mt-2'><i class="bi bi-exclamation-triangle-fill"> login failed!</i></div> : null}
                <hr />
                <div className='d-flex justify-content-center'>
                    <Button className='d-flex align-items-center rounded-1 shadow' variant="dark" > <img className='githubImg me-2' src={githubIconWhite} alt="img" /> login with GitHub</Button>
                </div>
                <div className='d-flex justify-content-center'>
                    <Button className='d-flex align-items-center mt-2 rounded-1 shadow' variant="light" > <img className='githubImg me-2' src={googleIcon} alt="img" /> login with Google</Button>
                </div>
                <div className='d-flex justify-content-center'>
                    <Button className='d-flex align-items-center mt-2 rounded-1 shadow' variant="primary" > <img className='githubImg me-2' src={fbIcon} alt="img" /> login with Facebook</Button>
                </div>
            </section>
        </div>
    </div>
)
}

export default SignInForm