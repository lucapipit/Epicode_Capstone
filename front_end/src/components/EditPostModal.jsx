import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, clearCategories } from '../states/postStates';
import { getPostByIdFunc, toogleOpenModal } from "../states/postStates";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/esm/Button';
import { Spinner } from "react-bootstrap";
import { nanoid } from '@reduxjs/toolkit';


const EditPostModal = ({ id }) => {

    //redux
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.posts.categories);
    const singlePost = useSelector((state) => state.posts.singlePost);

    const [file, setFile] = useState(null);
    const [isSending, setIsSending] = useState(false);/* da verificare se si può eliminare */

    /* input form values */
    const img = singlePost.singlePost.img;
    const [title, setTitle] = useState(singlePost.singlePost.title);
    const [subtitle, setSubtitle] = useState(singlePost.singlePost.subtitle);
    const [text, setText] = useState(singlePost.singlePost.text);

    //category variable obj
    const categoryIcons = {
        cardiology: 'activity',
        immunology: 'shield-fill-exclamation',
        pediatrics: 'bandaid-fill',
        radiology: 'radioactive',
        biotechnology: 'fingerprint',
        dietology: 'basket2-fill'
    };

    /* base64 image preview*/
    const [base64Img, setBase64Img] = useState("");
    const uploadBase64 = async (e) => {
        const myFile = e.target.files[0];
        const base64 = await convertBase64(myFile);
        setBase64Img(base64);
    };
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    /* multer settings */
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
        e.preventDefault();
        try {
            const uploadedFile = await uploadFile(file);
            console.log(uploadFile);

            const myPayload = {
                "title": title,
                "subtitle": subtitle,
                "img": uploadedFile.img,
                "text": text,
                "tags": categories
            };

            console.log(myPayload);
            const apiUrl = `${process.env.REACT_APP_SERVERBASE_URL}/posts/${id}`;

            const response = await fetch(apiUrl, {
                method: "PATCH",
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

    useEffect(() => {
        singlePost.tags?.map((el) => { dispatch(addCategory(el)) })
    }, [])

    return (
        <div className='d-flex justify-content-center' >
            <div className='myEditModal position-fixed p-4 pt-0 bg-light rounded-2'>

                <div className='pe-2 pb-2 position-fixed'>
                    <i className="bi bi-x-lg position-relative text-danger" onClick={() => { dispatch(toogleOpenModal(false)); dispatch(clearCategories()); }}></i>
                </div>
                <form className='mt-4 pt-1' encType='multipart/form-data'>
                    <div className='mainImage mt-3'>
                        <img className='mb-3 me-3 rounded-2 img-fluid' src={base64Img ? base64Img : `${process.env.REACT_APP_SERVERBASE_URL}/uploads/${img}`} alt="img" />
                        <input className='mb-2' type='file' onChange={(e) => { setFile(e.target.files[0]); uploadBase64(e); console.log(e.target.files[0]); }} />{/* accept, required */}
                    </div>
                    <hr />
                    <InputGroup>
                        <InputGroup.Text id="inputGroup-sizing-default">Title</InputGroup.Text>
                        <Form.Control maxLength={150} value={title} onChange={(e) => { setTitle(e.target.value) }} />
                    </InputGroup>
                    <div className='mb-3 charCounter d-flex align-items-center'>
                        <i className="bi bi-fonts"></i>
                        <i>{title.length + "/150 characters"}</i>
                    </div>
                    <InputGroup>
                        <InputGroup.Text id="inputGroup-sizing-default">Subtitle</InputGroup.Text>
                        <Form.Control maxLength={1000} value={subtitle} onChange={(e) => { setSubtitle(e.target.value) }} />
                    </InputGroup>
                    <div className='mb-3 charCounter d-flex align-items-center'>
                        <i className="bi bi-fonts"></i>
                        <i>{subtitle.length + "/1000 characters"}</i>
                    </div>
                    <div className='d-flex align-items-center mb-3'>
                        <DropdownButton align="start" title="Category" id="dropdown-menu-align-end" variant="info">
                            <Dropdown.Item eventKey="1" onClick={() => dispatch(addCategory("cardiology"))}><i className="bi bi-activity"></i>Cardiology</Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={() => dispatch(addCategory("immunology"))}><i className="bi bi-shield-fill-exclamation"></i>Immunology</Dropdown.Item>
                            <Dropdown.Item eventKey="3" onClick={() => dispatch(addCategory("pediatrics"))}><i className="bi bi-bandaid-fill"></i>Pediatrics</Dropdown.Item>
                            <Dropdown.Item eventKey="4" onClick={() => dispatch(addCategory("radiology"))}><i className="bi bi-radioactive"></i>Radiology</Dropdown.Item>
                            {/* <Dropdown.Divider /> */}
                            <Dropdown.Item eventKey="5" onClick={() => dispatch(addCategory("biotechnology"))}><i className="bi bi-fingerprint"></i>Biotechnology</Dropdown.Item>
                            <Dropdown.Item eventKey="6" onClick={() => dispatch(addCategory("dietology"))}><i className="bi bi-basket2-fill"></i>Dietology</Dropdown.Item>
                        </DropdownButton>
                        <div className='d-flex ms-3'>
                            {categories && categories.map((el) => {
                                return <i key={nanoid()} className={`bi bi-${categoryIcons[el]}`}></i>
                            })}
                            {
                                categories.length > 0 ? <i className="bi bi-x-circle text-danger" onClick={() => dispatch(clearCategories())}> clear</i> : null
                            }
                        </div>
                    </div>
                    <InputGroup >
                        <InputGroup.Text id="inputGroup-sizing-default">Text</InputGroup.Text>
                        <Form.Control maxLength={6000} as="textarea" rows={20} value={text} onChange={(e) => { setText(e.target.value) }} />
                    </InputGroup>
                    <div className='mb-3 charCounter d-flex align-items-center'>
                        <i className="bi bi-fonts"></i>
                        <i>{text.length + "/6000 characters"}</i>
                    </div>
                    <div className='mb-4 d-flex justify-content-center'>
                        {isSending ?
                            <Button variant="primary" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> Loading... </Button>
                            : <Button onClick={(e) => { submitForm(e); dispatch(clearCategories()); dispatch(toogleOpenModal(false)); window.location.reload() }}><i className="bi bi-check-circle-fill me-2"></i>Update</Button>}
                    </div>
                </form>


            </div>
        </div>
    )
}

export default EditPostModal