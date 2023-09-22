import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { getPostByCategoryFunc, selectTags } from "../states/postStates"

const MenuMain = ({ userFullName }) => {

    const dispatch = useDispatch();
    //search by category
    const [tags, setTags] = useState([]);

    const handleCategoryFilter = (el, e) => {
        /* e.currentTarget.classList.add("boxSelected"); */
        const myEl = el.split("_")[0].toLowerCase();
        return !tags.includes(myEl)?setTags([...tags, myEl]):null;
    }
    const updateFun = () => {
        console.log(tags);
    }

    useEffect(() => {
        updateFun();
        if (tags.length > 0) {
            dispatch(getPostByCategoryFunc(tags));
            dispatch(selectTags(tags))
        }

    }, [tags])

    //category variable Arry
    const categoryIcons = [
        'Cardiology_activity',
        'Immunology_shield-fill-exclamation',
        'Pediatrics_bandaid-fill',
        'Radiology_radioactive',
        'Biotechnology_fingerprint',
        'Dietology_basket2-fill'
    ];

    return (
        <>
            <div className='gap-2'>
                <div className='d-flex justify-content-center flex-wrap gap-2'>
                    <Link to="/logIn" className='text-secondary' style={{ textDecoration: "none" }}>
                        <div className='singleBox'><a ><i className="bi bi-person-fill"></i>Log in</a></div>
                    </Link>
                    <Link to="/signin" className='text-secondary' style={{ textDecoration: "none" }}>
                        <div className='singleBox'><a><i className="bi bi-person-fill-add"></i>Sign In</a></div>
                    </Link>
                </div>
                <hr className='mb-1' />
                <p className='text-center fw-semibold'><i>Categories</i></p>
                <div className='d-flex justify-content-center flex-wrap gap-2'>
                    {
                        categoryIcons && categoryIcons.map((el) => {

                            return <Link to="/" className={`text-secondary`} key={nanoid()} style={{ textDecoration: "none" }}>
                                <div className="singleBox" onClick={(e) => {
                                    handleCategoryFilter(el, e);
                                }}>
                                    <a><i className={`bi bi-${el.split("_")[1]}`}></i>{el.split("_")[0]}</a>
                                </div>
                            </Link>
                        })
                    }

                </div>
                <hr />
                <div className='d-flex justify-content-center flex-wrap gap-2'>
                    <Link to="/" className='text-secondary' style={{ textDecoration: "none" }}>
                        <div className='singleBox'><a><i className="bi bi-info-circle-fill"></i>About Us</a></div>
                    </Link>
                    <Link to="/" className='text-secondary' style={{ textDecoration: "none" }}>
                        <div className='singleBox'><a><i className="bi bi-person-lines-fill"></i>Contacts</a></div>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default MenuMain