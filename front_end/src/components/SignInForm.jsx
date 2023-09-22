import React, { useRef, useState } from 'react';
import "../App.css";
import bgImg2 from "../assets/bg-login2.jpg";
import githubIconWhite from "../assets/github-mark-white.png";
import googleIcon from "../assets/googleIcon.png";
import fbIcon from "../assets/facebook-icon.png";
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
import { saveFirstAccessData } from '../states/authorState';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'

const SignInForm = () => {

    const [emailSign, setEmailSign] = useState("");
    const [psswSign, setPsswSign] = useState("");
    const [nameSign, setNameSign] = useState("");
    const [surnameSign, setSurnameSign] = useState("");
    const [dobSign, setDobSign] = useState("");
    const [imgSign, setImgSign] = useState("");
    const [avatarSign, setAvatarSign] = useState("");
    const [statusCode, setStatusCode] = useState(null);
    const [areEmptyFields, setAreEmptyFields] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitSign = async () => {
        const payload = {
            name: nameSign,
            surname: surnameSign,
            email: emailSign,
            password: psswSign,
            avatar: avatarSign,
            dob: dobSign,
            authorImg: imgSign
        };
        const emptyField = !payload.name && !payload.surname && !payload.email && !payload.password && !payload.avatar && !payload.dob && !payload.authorImg;
        if (!emptyField) {
            setStatusCode(100);
            setAreEmptyFields(false);
            try {
                const response = await fetch("http://localhost:5050/authors", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();

                setStatusCode(data.statusCode);
                const redirectionSuccess = () => {
                    setTimeout(() => { navigate('/logIn') }, 1000)
                };
                if (data.statusCode === 201) {
                    dispatch(saveFirstAccessData({email: emailSign, pssw: psswSign}));
                    setEmailSign("");
                    setPsswSign("");
                    setNameSign("");
                    setSurnameSign("");
                    setDobSign("");
                    setImgSign("");
                    setAvatarSign("");
                    redirectionSuccess();
                } else {
                    return
                };
                
                return data

            } catch (error) {
                console.log(error);
            }
        } else {
            setAreEmptyFields(true)
        }

    };

    const sendWelcomeMail = async () => {
        const userEmail = {
            email: emailSign,
        };
        const emptyField = !emailSign && !psswSign && !nameSign && !surnameSign && !dobSign && !imgSign && !avatarSign;
        if (!emptyField) {

            console.log(userEmail);
            try {
                const response = await fetch("http://localhost:5050/mailer/welcomeMail", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userEmail)
                });
                const res = await response.json();
                return res
            } catch (error) {
                console.log("invio email fallito!!!");
            }
        }
    };

    return (
        <div className='mySignInForm d-flex justify-content-center align-items-center' style={{ background: `url(${bgImg2})` }}>
            <div className='d-flex justify-content-center align-items-center shadow my-3 py-5'>
                <section className='text-center'>
                    <h3 className='fw-light'>Sign In</h3>
                    <div>
                        <input type="text" value={nameSign} onChange={(e) => setNameSign(e.target.value)} placeholder='name' />
                    </div>
                    <div>
                        <input type="text" value={surnameSign} onChange={(e) => setSurnameSign(e.target.value)} placeholder='surname' />
                    </div>
                    <div>
                        <input type="text" value={avatarSign} onChange={(e) => setAvatarSign(e.target.value)} placeholder='avatar' required />
                    </div>
                    <div>
                        <input type="date" value={dobSign} onChange={(e) => setDobSign(e.target.value)} placeholder='date of birth' />
                    </div>
                    <div>
                        <i className="bi bi-person-bounding-box"> <input type="text" value={imgSign} onChange={(e) => setImgSign(e.target.value)} placeholder='insert an image url' /></i>
                    </div>
                    <div>
                        <input type="text" value={emailSign} onChange={(e) => setEmailSign(e.target.value)} placeholder='email' />
                    </div>
                    <div>
                        <input type="password" value={psswSign} onChange={(e) => setPsswSign(e.target.value)} placeholder='password' />
                    </div>
                    <Button className='mt-3 shadow' variant="primary" onClick={() => { submitSign(); sendWelcomeMail() }}><i className="bi bi-person-check-fill text-light"></i>create</Button>

                    {
                        statusCode === 200 ?
                            <div>
                                <div className='text-warning mt-2 myFailedLogin'><i className="bi bi-exclamation-triangle-fill"> email already exists!</i></div>
                                <Link to="/login" className='text-secondary' style={{ textDecoration: "none" }}>
                                    <div className='mt-2 text-primary'><i className='text-dark'><a href="">login</a> with this email!</i></div>
                                </Link>
                            </div>
                            : statusCode === 500 ? <div className='text-danger mt-2'><i className="bi bi-database-slash"> server error!</i></div>
                                : statusCode === 100 ? <div className='text-primary mt-2'><Spinner animation="border" size="sm" /></div>
                                    : null
                    }
                    {areEmptyFields ? <div className='text-danger mt-2'><i className="bi bi-exclamation-triangle"> fill in all fields!</i></div> : null}

                    <hr />
                    {/*  <div className='d-flex justify-content-center'>
                        <Button className='d-flex align-items-center rounded-1 shadow' variant="dark" > <img className='githubImg me-2' src={githubIconWhite} alt="img" /> login with GitHub</Button>
                    </div> */}
                    <div className='d-flex justify-content-center'>
                        <Button className='d-flex align-items-center mt-2 rounded-1 shadow' variant="light" > <img className='githubImg me-2' src={googleIcon} alt="img" /> login with Google</Button>
                    </div>
                    {/* <div className='d-flex justify-content-center'>
                        <Button className='d-flex align-items-center mt-2 rounded-1 shadow' variant="primary" > <img className='githubImg me-2' src={fbIcon} alt="img" /> login with Facebook</Button>
                    </div> */}

                </section>
            </div>
        </div>
    )
}

export default SignInForm