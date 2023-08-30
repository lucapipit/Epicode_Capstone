import React, { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import PostDetail from '../components/PostDetail';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { getPostByIdFunc } from '../states/postStates';
import { useParams } from 'react-router';

const SinglePost = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const singlePost = useSelector((state) => state.posts.singlePost);
    useEffect(() => {
        dispatch(getPostByIdFunc(id))
    }, []);
    /* console.log(singlePost); */
    return (
        <>
            <MainLayout>
                {singlePost && <PostDetail
                    key={nanoid()}
                    id={id}
                    title={singlePost.title}
                    subtitle={singlePost.subtitle}
                    text={singlePost.text}
                    img={singlePost.img}
                    authorObj={singlePost.author}
                    createdAt={singlePost.createdAt}
                    updatedAt={singlePost.updatedAt}
                    category={singlePost.tags}
                />}
            </MainLayout>
        </>
    )
}

export default SinglePost