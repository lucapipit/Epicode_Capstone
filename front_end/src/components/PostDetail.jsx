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

const PostDetail = ({ id, title, subtitle, img, text, authorObj, createdAt, updatedAt, category }) => {
    const apiUrl = process.env.REACT_APP_SERVERBASE_URL;

    const dispatch = useDispatch();
    const isEditModalOpen = useSelector((state) => state.posts.isModalOpen);
    const userAuthorId = useSelector((state) => state.authors.author_id);


    useEffect(() => {
        console.log(authorObj)
        dispatch(getUserDatafromToken());
        if (isEditModalOpen) { document.body.style.overflow = 'hidden' } else { document.body.style.overflow = 'scroll' };/* to avoid page scrool when the edit modal is opened */
    }, [isEditModalOpen, userAuthorId])
    return (
        <>
            <Container fluid>
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
                                    switch (el) {
                                        case "cardiology": return <i key={nanoid()} class="bi bi-activity"></i>;
                                        case "immunology": return <i key={nanoid()} class="bi bi-shield-fill-exclamation"></i>;
                                        case "pediatrics": return <i key={nanoid()} class="bi bi-bandaid-fill"></i>;
                                        case "radiology": return <i key={nanoid()} class="bi bi-radioactive"></i>;
                                        case "biotechnology": return <i key={nanoid()} class="bi bi-fingerprint"></i>;
                                        case "dietology": return <i key={nanoid()} class="bi bi-basket2-fill"></i>;
                                        default: return null;
                                    }
                                })
                            }
                        </span>}
                    </Col>

                    <Col xs={12}>

                        {
                            authorObj ?
                                (authorObj._id === userAuthorId ?
                                    <span className='modifyPostSymbol mt-1 d-flex justify-content-end'>
                                        <i class="bi bi-pencil-fill text-secondary ms-3" onClick={() => dispatch(toogleOpenModal(true))}></i>
                                        <i class="bi bi-trash-fill text-danger ms-3"></i>
                                    </span>
                                    : <div className='mt-5'></div>)
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
                    </Col>
                </Row>
            </Container>

        </>



    )
}

export default PostDetail