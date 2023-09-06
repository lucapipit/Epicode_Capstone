import React, { useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { filterPosts } from "../states/postStates";
import Mark from "mark.js"; 


const PostCard = ({ id, title, img, category, subtitle, authorName, authorSurname, authorImg }) => {
    const apiUrl = process.env.REACT_APP_SERVERBASE_URL;
      

    const categoryIcons = {
        cardiology: 'activity',
        immunology: 'shield-fill-exclamation',
        pediatrics: 'bandaid-fill',
        radiology: 'radioactive',
        biotechnology: 'fingerprint',
        dietology: 'basket2-fill'
    };

    const markSearchKey = useSelector((state) => state.posts.markSearchKey);
    const markInstance = new Mark(document.querySelector("#search-node"));

    const markSearch = (input) => {
        markInstance.unmark({
            done: () => {
                markInstance.mark(input);
            }
        });
        return
    };

    useEffect(()=>{
        
        markSearch(markSearchKey); 
    
    }, [markSearchKey])
    
    return (
        <>
            <Link className='myLink' to={`SinglePost/${id}`}>
                <Card className='myPostCard m-2'>
                    <div className='myBgImage' style={{ background: `url("${process.env.REACT_APP_SERVERBASE_URL}/uploads/${img}")` }} />
                    <Card.Body >
                        <span className='myCategorySymbol'>
                            {category.map((el) => {
                                return <i key={nanoid()} className={`bi bi-${categoryIcons[el]}`}></i>
                            })}
                        </span>
                        <Card.Text className='myPostTitle' >
                            {title}
                        </Card.Text>
                        <hr />
                        <div className='mySubtitle'>
                            <i >
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