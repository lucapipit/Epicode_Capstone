import React from 'react';
import AddPostForm from '../components/AddPostForm';
import MainLayout from '../layouts/MainLayout';

const AddPost = () => {
    return (
        <>
            <MainLayout>
                <AddPostForm />
            </MainLayout>
        </>
    )
}

export default AddPost