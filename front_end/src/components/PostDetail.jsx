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

    const categoryIcons = {
        cardiology: 'activity',
        immunology: 'shield-fill-exclamation',
        pediatrics: 'bandaid-fill',
        radiology: 'radioactive',
        biotechnology: 'fingerprint',
        dietology: 'basket2-fill'
    };

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