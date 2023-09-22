import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import "../App.css";
import { addCategory, clearCategories } from "../states/postStates";
import { nanoid } from '@reduxjs/toolkit';

const AddPostForm = () => {
    const [file, setFile] = useState(null);
    const [isSending, setIsSending] = useState(false);

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [text, setText] = useState("");

    //category variable obj
    const categoryIcons = {
        cardiology: 'activity',
        immunology: 'shield-fill-exclamation',
        pediatrics: 'bandaid-fill',
        radiology: 'radioactive',
        biotechnology: 'fingerprint',
        dietology: 'basket2-fill'
    };

    //redux
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.posts.categories);
    const author_id = useSelector((state) => state.authors.author_id);

    const uploadFile = async (file) => {
        const fileData = new FormData();
        fileData.append("img", file);

        try {
            const apiUrl = `${process.env.REACT_APP_SERVERBASE_URL}/posts/internalUpload`;
            const response = await fetch(apiUrl, {
                method: "POST",
                body: fileData
            });
            return await response.json();
        } catch (error) {
            console.error("file upload errors occured");
        }
    };

    const submitForm = async (e) => {
        /* e.preventDefault(); */

        try {
            const uploadedFile = await uploadFile(file);

            const myPayload = {
                title: title,
                subtitle: subtitle,
                author: author_id,
                img: uploadedFile.img,
                text: text,
                tags: categories
            };
            console.log(myPayload);
            const apiUrl = `${process.env.REACT_APP_SERVERBASE_URL}/posts`;
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("loginData")
                },
                body: JSON.stringify(myPayload)
            });
            return await response.json()

        } catch (error) {
            console.log("la POST non è andata a buon fine");
        }

    };

    //Reset input function
    const resetForm = () => {
        setTimeout(() => {
            setTitle("");
            setSubtitle("");
            setText("");
            dispatch(clearCategories());
            setFile(null)
        }, 500);

        setTimeout(() => {
            window.location.replace('http://localhost:3000/')
        }, 2000);
    }

    useEffect(() => {
        console.log(author_id);
    }, [])

    return (
        <Container className='py-4'>
            <form encType='multipart/form-data'>
                <InputGroup >
                    <InputGroup.Text id="inputGroup-sizing-default">Title</InputGroup.Text>
                    <Form.Control maxLength={150} value={title} onChange={(e) => setTitle(e.target.value)} />
                </InputGroup>
                <div className='mb-3 charCounter d-flex align-items-center'>
                    <i className="bi bi-fonts"></i>
                    <i>{title.length + "/150 characters"}</i>
                </div>
                <InputGroup >
                    <InputGroup.Text id="inputGroup-sizing-default">Subtitle</InputGroup.Text>
                    <Form.Control maxLength={700} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                </InputGroup>
                <div className='mb-3 charCounter d-flex align-items-center'>
                    <i className="bi bi-fonts"></i>
                    <i>{subtitle.length + "/700 characters"}</i>
                </div>
                <div className='d-flex align-items-center mb-3'>
                    <DropdownButton align="start" title="Category" id="dropdown-menu-align-end" variant="info">
                        <Dropdown.Item eventKey="1" onClick={() => dispatch(addCategory("cardiology"))}><i className="bi bi-activity"></i>Cardiology</Dropdown.Item>
                        <Dropdown.Item eventKey="2" onClick={() => dispatch(addCategory("immunology"))}><i className="bi bi-shield-fill-exclamation"></i>Immunology</Dropdown.Item>
                        <Dropdown.Item eventKey="3" onClick={() => dispatch(addCategory("pediatrics"))}><i className="bi bi-bandaid-fill"></i>Pediatrics</Dropdown.Item>
                        <Dropdown.Item eventKey="4" onClick={() => dispatch(addCategory("radiology"))}><i className="bi bi-radioactive"></i>Radiology</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="5" onClick={() => dispatch(addCategory("biotechnology"))}><i className="bi bi-fingerprint"></i>Biotechnology</Dropdown.Item>
                        <Dropdown.Item eventKey="6" onClick={() => dispatch(addCategory("dietology"))}><i className="bi bi-basket2-fill"></i>Dietology</Dropdown.Item>
                    </DropdownButton>
                    <div className='d-flex ms-3'>
                        {categories.map((el) => {
                            return <i key={nanoid()} className={`bi bi-${categoryIcons[el]}`}></i>
                        })}
                        {
                            categories.length > 0 ? <i className="bi bi-x-circle text-danger" onClick={() => dispatch(clearCategories())}> clear</i> : null
                        }
                    </div>
                </div>

                <input className='mb-3' type='file' onChange={(e) => setFile(e.target.files[0])} />{/* accept, required */}
                <InputGroup >
                    <InputGroup.Text id="inputGroup-sizing-default">Text</InputGroup.Text>
                    <Form.Control maxLength={6000} value={text} as="textarea" rows={5} onChange={(e) => setText(e.target.value)} />
                </InputGroup>
                <div className='mb-3 charCounter d-flex align-items-center'>
                    <i className="bi bi-fonts"></i>
                    <i>{text.length + "/6000 characters"}</i>
                </div>
                <div className=' d-flex justify-content-center mb-5'>
                    {isSending ?
                        <Button variant="primary" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> Loading... </Button>
                        : <Button onClick={(e) => { submitForm(e); resetForm() }}><i className="bi bi-send-fill me-2"></i>Publish</Button>}
                </div>
            </form>

        </Container>
    )
}

export default AddPostForm