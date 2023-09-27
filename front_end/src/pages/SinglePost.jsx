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
        console.log(singlePost);
        dispatch(getPostByIdFunc(id))
    }, []);
    return (
        <>
            <MainLayout>
                {singlePost && <PostDetail
                    key={nanoid()}
                    id={id}
                    title={singlePost.singlePost.title}
                    subtitle={singlePost.singlePost.subtitle}
                    text={singlePost.singlePost.text}
                    img={singlePost.singlePost.img}
                    authorObj={singlePost.singlePost.author}
                    createdAt={singlePost.singlePost.createdAt}
                    updatedAt={singlePost.singlePost.updatedAt}
                    category={singlePost.singlePost.tags}
                    reviews={singlePost.reviews}
                />}
            </MainLayout>
        </>
    )
}

export default SinglePost