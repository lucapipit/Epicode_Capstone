import React, { useEffect, useState } from 'react';
import "../style/detailPost.css";
import { nanoid } from '@reduxjs/toolkit';
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from 'react-bootstrap/esm/Col';
import EditPostModal from './EditPostModal';
import { toogleOpenModal } from "../states/postStates";
import { getUserDatafromToken } from "../states/authorState";
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button } from 'react-bootstrap';
import feather from "../assets/feather.svg";
import { useNavigate } from 'react-router';
import jwtDecode from 'jwt-decode';
import { saveAuthor_id } from '../states/authorState';

const PostDetail = ({ id, title, subtitle, img, text, authorObj, createdAt, updatedAt, category, reviews }) => {//authorObj è l'autore del post

    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const isEditModalOpen = useSelector((state) => state.posts.isModalOpen);
    const userAuthorId = useSelector((state) => state.authors.author_id);//autore loggato
    const [reviewText, setReviewText] = useState("");
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewId, setReviewId] = useState("");

    const categoryIcons = {
        cardiology: 'activity',
        immunology: 'shield-fill-exclamation',
        pediatrics: 'bandaid-fill',
        radiology: 'radioactive',
        biotechnology: 'fingerprint',
        dietology: 'basket2-fill'
    };

    const submitReview = async () => {
        const payload = {
            title: reviewTitle,
            text: reviewText,
            postId: id,
            author: userAuthorId
        };
        const apiUrl = `${process.env.REACT_APP_SERVERBASE_URL}/reviews`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("loginData")
            },
            body: JSON.stringify(payload)
        });
        const res = await response.json();
        setReviewId(res.reviewId);
        console.log(reviewId);
        return res
    };

    const populatePostWithReviews = async (input) => {
        const apiUrl = `${process.env.REACT_APP_SERVERBASE_URL}/posts/review/${input}`;
        const payload = {
            reviews: reviewId
        };
        const response = await fetch(apiUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("loginData")
            },
            body: JSON.stringify(payload)
        });
        return await response.json();
    };

    const resetForm = () => {
        setTimeout(() => {
            setReviewText("");
            setReviewTitle("")
        }, 500);

        setTimeout(() => {
            navigate(0)
        }, 2000);
    }


    useEffect(() => {
        dispatch(getUserDatafromToken());
        if (isEditModalOpen) { document.body.style.overflow = 'hidden' } else { document.body.style.overflow = 'scroll' };/* to avoid page scrool when the edit modal is opened */
    }, [isEditModalOpen, userAuthorId]);

    useEffect(() => {
        if (reviewId) {
            populatePostWithReviews(id)
        }
    }, [reviewId]);

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <>
            <Container fluid="true">
                <Row>
                    <div className='myBgDetailImg' style={{ backgroundImage: `url("${process.env.REACT_APP_SERVERBASE_URL}/uploads/${img}")` }}></div>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col xs={12}>
                        {<span className='categorySymbol'>
                            {//return all category icons
                                category && category.map((el) => {
                                    return <i key={nanoid()} className={`bi bi-${categoryIcons[el]}`}></i>
                                })
                            }
                        </span>}
                    </Col>

                    <Col xs={12}>

                        {
                            authorObj ?
                                (authorObj._id === userAuthorId ?
                                    <span className='modifyPostSymbol mt-1 d-flex justify-content-end'>
                                        <i className="bi bi-pencil-fill text-secondary ms-3" onClick={() => dispatch(toogleOpenModal(true))}></i>
                                        <i className="bi bi-trash-fill text-danger ms-3"></i>
                                    </span>
                                    :
                                    <span className='modifyPostSymbol mt-1 d-flex justify-content-end align-items-center'>
                                        <div className='mb-1 me-3 d-flex align-items-center justify-content-end'><i className='ms-2 text-dark truncate-sm'>{authorObj.name} {authorObj.surname}</i><div className='myAuthorImg-sm' style={{ backgroundImage: `url(${authorObj.authorImg})` }}></div></div>
                                        <a href="#review"><img src={feather} alt="svg" style={{ height: "26px" }} /></a>
                                    </span>)
                                : null
                        }


                        {
                            isEditModalOpen ?
                                <EditPostModal
                                    id={id}
                                /> : null
                        }

                        <h1 className='p-3 mt-1 ms-4'>{title}</h1>
                        <div className="myBody px-4">
                            <p>{subtitle}</p>
                            <hr />
                            <article className='drop-cap mb-4'>{text}</article>
                        </div>

                        <hr />
                        {
                            reviews && reviews.map((el) => {
                                return (
                                    <div>
                                        <div className='mb-1 d-flex align-items-center justify-content-end'><img src={feather} alt="svg" style={{ height: "22px" }} /><i className='ms-2 text-dark'>{el.author.name} {el.author.surname}</i><div className='myAuthorImg-sm' style={{ backgroundImage: `url(${el.author.authorImg})` }}></div></div>
                                        <h1 className='p-3 mt-1 ms-4'>{el.title}</h1>
                                        <div className="myBody px-4">
                                            <p>{el.subtitle}</p>
                                            <article className='mb-4'>{el.text}</article>
                                        </div>
                                        <hr />
                                    </div>

                                )
                            })
                        }

                        {
                            userFullName ?
                                <div>
                                    <h2 className='fw-light mt-5' id='review'><i className='bi bi-blockquote-left text-success'> Submit a review and wait for the author to accept</i></h2>

                                    <InputGroup className='mt-3'>
                                        <InputGroup.Text id="inputGroup-sizing-default">Title</InputGroup.Text>
                                        <Form.Control maxLength={150} value={reviewTitle} onChange={(e) => { setReviewTitle(e.target.value) }} />
                                    </InputGroup>
                                    <InputGroup className='mt-3' >
                                        <InputGroup.Text id="inputGroup-sizing-default">Text</InputGroup.Text>
                                        <Form.Control maxLength={6000} as="textarea" rows={20} value={reviewText} onChange={(e) => { setReviewText(e.target.value) }} />
                                    </InputGroup>
                                    <div className='mb-3 charCounter d-flex align-items-center'>
                                        <i className="bi bi-fonts"></i>
                                        <i>{reviewText.length + "/6000 characters"}</i>
                                    </div>
                                    <Button className='mb-5' onClick={() => { submitReview(); resetForm() }}><i className="bi bi-send-fill me-2"></i>Submit</Button>
                                </div> :
                                null
                        }
                    </Col>
                </Row>
            </Container>

        </>



    )
}

export default PostDetail