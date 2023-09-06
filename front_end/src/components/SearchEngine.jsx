import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterPosts, updateSearchKey } from "../states/postStates";
import Mark from "mark.js";
import { nanoid } from '@reduxjs/toolkit';
import Card from 'react-bootstrap/Card';


const SearchEngine = () => {

    const dispatch = useDispatch();
    const [searchKey, setSearchKey] = useState("");
    const allPosts = useSelector((state) => state.posts.allPosts);

    const searchAssets = (input) => {
        const searchValue = searchKey.split(" ");
        if (searchValue.length <= 1) {
            return input.title.toLowerCase().includes(searchKey.toLowerCase()) || input.subtitle.toLowerCase().includes(searchKey.toLowerCase())
        } else {
            return searchValue.every((r) => input.title.toLowerCase().includes(r.toLowerCase()) || input.text.toLowerCase().includes(r.toLowerCase()))
        }
    };

    const handleSearch = (e) => {
        setSearchKey(e.target.value);
        console.log(allPosts);
        const filteredPosts = allPosts.filter((item) => searchAssets(item));
        console.log(filteredPosts);
        return dispatch(filterPosts(filteredPosts));
    };

    return (
        <div className='my-4'>
            <div className='w-100'>
                <input className='w-100 rounded-5 px-3 py-1 border' placeholder='search...' type="text" onChange={(e) => { handleSearch(e); dispatch(updateSearchKey(e.target.value)) }} />
            </div>
        </div >
    )
}

export default SearchEngine