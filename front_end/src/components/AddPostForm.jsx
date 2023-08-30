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
        }, 2000)

    }

    useEffect(() => {
        console.log(author_id);
    }, [])

    return (
        <Container className='py-4'>
            <form encType='multipart/form-data'>
                <InputGroup >
                    <InputGroup.Text id="inputGroup-sizing-default">Title</InputGroup.Text>
                    <Form.Control maxLength={150} onChange={(e) => setTitle(e.target.value)} />
                </InputGroup>
                <div className='mb-3 charCounter d-flex align-items-center'>
                    <i class="bi bi-fonts"></i>
                    <i>{title.length + "/150 characters"}</i>
                </div>
                <InputGroup >
                    <InputGroup.Text id="inputGroup-sizing-default">Subtitle</InputGroup.Text>
                    <Form.Control maxLength={500} onChange={(e) => setSubtitle(e.target.value)} />
                </InputGroup>
                <div className='mb-3 charCounter d-flex align-items-center'>
                    <i class="bi bi-fonts"></i>
                    <i>{subtitle.length + "/500 characters"}</i>
                </div>
                <div className='d-flex align-items-center mb-3'>
                    <DropdownButton align="start" title="Category" id="dropdown-menu-align-end" variant="info">
                        <Dropdown.Item eventKey="1" onClick={() => dispatch(addCategory("cardiology"))}><i class="bi bi-activity"></i>Cardiology</Dropdown.Item>
                        <Dropdown.Item eventKey="2" onClick={() => dispatch(addCategory("immunology"))}><i class="bi bi-shield-fill-exclamation"></i>Immunology</Dropdown.Item>
                        <Dropdown.Item eventKey="3" onClick={() => dispatch(addCategory("pediatrics"))}><i class="bi bi-bandaid-fill"></i>Pediatrics</Dropdown.Item>
                        <Dropdown.Item eventKey="4" onClick={() => dispatch(addCategory("radiology"))}><i class="bi bi-radioactive"></i>Radiology</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="5" onClick={() => dispatch(addCategory("biotechnology"))}><i class="bi bi-fingerprint"></i>Biotechnology</Dropdown.Item>
                        <Dropdown.Item eventKey="6" onClick={() => dispatch(addCategory("dietology"))}><i class="bi bi-basket2-fill"></i>Dietology</Dropdown.Item>
                    </DropdownButton>
                    <div className='d-flex ms-3'>
                        {categories.map((el) => {
                            switch (el) {
                                case "cardiology": return <i key={nanoid()} class="bi bi-activity"></i>;
                                case "immunology": return <i key={nanoid()} class="bi bi-shield-fill-exclamation"></i>;
                                case "pediatrics": return <i key={nanoid()} class="bi bi-bandaid-fill"></i>;
                                case "radiology": return <i key={nanoid()} class="bi bi-radioactive"></i>;
                                case "biotechnology": return <i key={nanoid()} class="bi bi-fingerprint"></i>;
                                case "dietology": return <i key={nanoid()} class="bi bi-basket2-fill"></i>;
                            }
                        })}
                        {
                            categories.length > 0 ? <i class="bi bi-x-circle text-danger" onClick={() => dispatch(clearCategories())}> clear</i> : null
                        }
                    </div>
                </div>

                <input className='mb-3' type='file' onChange={(e) => setFile(e.target.files[0])} />{/* accept, required */}
                <InputGroup >
                    <InputGroup.Text id="inputGroup-sizing-default">Text</InputGroup.Text>
                    <Form.Control maxLength={6000} as="textarea" rows={5} onChange={(e) => setText(e.target.value)} />
                </InputGroup>
                <div className='mb-3 charCounter d-flex align-items-center'>
                    <i class="bi bi-fonts"></i>
                    <i>{text.length + "/6000 characters"}</i>
                </div>
                <div className=' d-flex justify-content-center mb-5'>
                    {isSending ?
                        <Button variant="primary" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> Loading... </Button>
                        : <Button onClick={(e) => { submitForm(e); resetForm(); console.log("FUZIONOOO"); }}><i class="bi bi-send-fill me-2"></i>Publish</Button>}
                </div>
            </form>

        </Container>
    )
}

export default AddPostForm