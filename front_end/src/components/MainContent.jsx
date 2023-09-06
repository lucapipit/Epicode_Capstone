import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAuthorsFunc, setCurrentPage, saveAuthor_id } from "../states/authorState";
import { getAllPostsFunc } from '../states/postStates';
import AuthorCard from './AuthorCard';
import Pagination from 'react-bootstrap/Pagination';
import PostCard from './PostCard';
import { Link } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';
import githubIcon from "../assets/github-mark.png";
import googleIcon from "../assets/googleIcon.png";
import SearchEngine from './SearchEngine';


const MainContent = () => {

    const dispatch = useDispatch();

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
    const welcomeTime = () => {
        const timeHours = +Date().split(" ")[4].split(":")[0]; //return hours time
        if (timeHours < 13) { return <i class="bi bi-brightness-high-fill"> Good morning</i> }
        else if (timeHours < 20) { return <i class="bi bi-brightness-alt-high-fill"> Good evening</i> }
        else { return <i class="bi bi-moon-fill"> Good night</i> };
    }

    //logout
    const myLogout = () => {
        localStorage.clear();
        return window.location.replace("http://localhost:3000/")
    }


    //pagination hooks
    const currentPage = useSelector((state) => state.authors.currentPage);
    const [active, setActive] = useState(1);
    const [pages, setPages] = useState(null);

    const myFilter = useSelector((state) => state.posts.filteredPosts);
    
    const allAuthors = useSelector((state) => state.authors.allAuthors);
    

    const pagination = () => {
        let items = [];
        for (let number = 1; number <= 5; number++) {
            items.push(
                <Pagination.Item key={number} active={number === active} onClick={() => {
                    setActive(number);
                    dispatch(setCurrentPage(number));
                    dispatch(getAllAuthorsFunc(currentPage))
                }}>
                    {number}
                </Pagination.Item>,
            );
        }
        setPages(items);
    }

    useEffect(() => {
        
        getUserData();
        dispatch(getAllAuthorsFunc());
        dispatch(getAllPostsFunc());
        pagination()
    }, [active]);

    return (
        <div className='container' style={{ minHeight: "80vh" }}>

            {userFullName ? <div className='detailUserBar pb-1 pt-1 shadow-sm d-flex justify-content-between align-items-center' fluid>
                <div>
                    {welcomeTime()}
                    {userFullName.displayName ? userFullName.displayName : userFullName.name + " " + userFullName.surname}
                    {userFullName.provider ? (userFullName.provider === "Google" ? <img className='providerIcon ms-2' src={googleIcon} alt="img" /> : <img className='providerIcon ms-2' src={githubIcon} alt="img" />) : null}
                </div>
                <div>
                    <i className='text-danger logout_bar bi bi-box-arrow-left' onClick={() => myLogout()} > Logout</i>
                </div>
            </div> : null}

            <SearchEngine/>

            <h2 className='mt-3 ps-1 myTitles'>Medical News</h2>

            <div className="contentToolBar py-2 px-3 rounded-5">
                <Link className='myLink rounded-5 py-1 px-2 ' to="AddPost">
                    <i class="bi bi-plus-lg me-2"> Add Post</i>
                </Link>
            </div>
            <div className='row mt-3 justify-content-center' id="search-node">
                {
                        myFilter && myFilter.map((el) => {
                        return <PostCard
                            key={nanoid()}
                            id={el._id}
                            title={el.title}
                            img={el.img}
                            category={el.tags}
                            subtitle={el.subtitle}
                            text={el.text}
                            authorName={el.author.name }
                            authorSurname={el.author.surname }
                            authorImg={el.author.authorImg }
                        />
                    })
                }
            </div>
            <hr />
            {
                allAuthors && allAuthors.map((el) => {
                    return <AuthorCard
                        key={nanoid()}
                        avatar={el.avatar}
                        authorImg={el.authorImg}
                        email={el.email}
                        name={el.name}
                        surname={el.surname}
                        dateOfBirth={el.dob}
                    />
                })
            }
            <div className='d-flex justify-content-center mt-3'>
                <Pagination className='shadow-sm'>{pages}</Pagination>
            </div>
        </div>
    )
}

export default MainContent