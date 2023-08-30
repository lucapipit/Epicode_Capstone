import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';


const PostCard = ({ id, title, img, category, subtitle, authorName, authorSurname, authorImg }) => {
    const apiUrl = process.env.REACT_APP_SERVERBASE_URL;
    return (
        <>
            <Link className='myLink' to={`SinglePost/${id}`}>
                <Card className='myPostCard m-2'>
                    <div className='myBgImage' style={{ background: `url("${process.env.REACT_APP_SERVERBASE_URL}/uploads/${img}")` }} />
                    <Card.Body>
                        <span className='myCategorySymbol'>
                            {category.map((el) => {
                                switch (el) {
                                    case "cardiology": return <i key={nanoid()} class="bi bi-activity"></i>;
                                    case "immunology": return <i key={nanoid()} class="bi bi-shield-fill-exclamation"></i>;
                                    case "pediatrics": return <i key={nanoid()} class="bi bi-bandaid-fill"></i>;
                                    case "radiology": return <i key={nanoid()} class="bi bi-radioactive"></i>;
                                    case "biotechnology": return <i key={nanoid()} class="bi bi-fingerprint"></i>;
                                    case "dietology": return <i key={nanoid()} class="bi bi-basket2-fill"></i>
                                    default: return null;
                                }
                            })}
                        </span>
                        <Card.Text className='myPostTitle'>
                            {title}
                        </Card.Text>
                        <hr />
                        <div className='mySubtitle'>
                            <i>
                                {subtitle}
                            </i>
                        </div>
                        <hr />
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center'>
                                <i>di:</i>
                                <div className='myAuthorImg-sm mx-2' style={{ backgroundImage: `url(${authorImg})` }}></div>
                                <i className='text-primary'>{authorName} {authorSurname}</i>
                            </div>
                        
                        </div>
                    </Card.Body>
                </Card>
            </Link>
        </>
    )
}

export default PostCard