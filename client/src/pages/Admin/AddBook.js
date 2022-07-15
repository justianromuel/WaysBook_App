import React, { useContext, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate, } from 'react-router-dom';
import { useMutation } from 'react-query'

import bgLeft from "../../assets/image/BgLeft.png";
import bgRight from "../../assets/image/BgRight.png";
import Navbars from '../../components/navbar/Navbars';
import IconAttachFile from "../../assets/image/IconAttachFile.png";
import IconAddBookWhite from "../../assets/image/IconAddBookWhite.png";
import IconChecklist from "../../assets/image/IconChecklist.png";
import { UserContext } from '../../context/userContext';
import { API } from '../../config/api';

function AddBook() {
    let navigate = useNavigate()

    const [preview, setPreview] = useState(null);
    const [cekPdf, setCekPdf] = useState(false);
    const [state, dispacth] = useContext(UserContext)
    const [addBook, setAddBook] = useState({
        title: "",
        year: "",
        pages: "",
        author: "",
        ISBN: "",
        price: "",
        desc: "",
        bookImg: "",
        bookPdf: ""
    })

    const handleChange = (e) => {
        setAddBook({
            ...addBook,
            [e.target.name]:
                e.target.type === "file" ? e.target.files : e.target.value,
        })

        if (e.target.type === "file") {
            let url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()
            console.log(addBook)

            const config = {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            }

            const formData = new FormData();
            formData.set("bookPdf", addBook.bookPdf[0], addBook.bookPdf[0].name);
            formData.set("bookImg", addBook.bookImg[0], addBook.bookImg[0].name);
            formData.set("title", addBook.title);
            formData.set("ISBN", addBook.ISBN);
            formData.set("year", addBook.year);
            formData.set("author", addBook.author);
            formData.set("pages", addBook.pages);
            formData.set("price", addBook.price);
            formData.set("desc", addBook.desc);


            const response = await API.post("/book", formData, config)
            console.log(response);
            navigate('/list-transaction')
        } catch (error) {
            console.log(error);
        }


    })

    const handleChangePdf = (e) => {
        setAddBook({
            ...addBook,
            [e.target.name]:
                e.target.type === "file" ? e.target.files : e.target.value,
        });
        setCekPdf(true);
    };

    return (
        <>
            {/* background image */}
            <img src={bgLeft} className="bgImage" alt="" />
            <img src={bgRight} className="bgImageR" alt="" />

            <Navbars />

            <Container className="py-3" >
                <h1>Add Book</h1>
                <form onSubmit={(e) => handleSubmit.mutate(e)}>
                    <Row>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            className='inputAddBook'
                            onChange={handleChange}
                        />
                    </Row>
                    <Row>
                        <input
                            type="date"
                            name="year"
                            placeholder="Publication Date (Format: DD-MM-YYYY)"
                            className='inputAddBook'
                            onChange={handleChange}
                        />
                    </Row>
                    <Row>
                        <input
                            type="text"
                            name="author"
                            placeholder="Author Name"
                            className='inputAddBook'
                            onChange={handleChange}
                        />
                    </Row>
                    <Row>
                        <input
                            type="number"
                            name="pages"
                            placeholder="Pages"
                            className='inputAddBook'
                            onChange={handleChange}
                        />
                    </Row>
                    <Row>
                        <input
                            type="number"
                            name="ISBN"
                            placeholder="ISBN"
                            className='inputAddBook'
                            onChange={handleChange}
                        />
                    </Row>
                    <Row>
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            className='inputAddBook'
                            onChange={handleChange}
                        />
                    </Row>
                    <Row>
                        <textarea
                            name="desc"
                            placeholder="About This Book"
                            rows="5"
                            className='inputAddBook'
                            onChange={handleChange}
                        />
                    </Row>

                    <Row
                        className='rowAddBook'
                        style={{
                            display: "flex",
                            alignItems: "center",
                            zIndex: 99
                        }}
                    >
                        <Col sm={2} className='mb-1'>
                            <label htmlFor="bookPdf">
                                <div className='btnAttach'>
                                    Attach File {" "}<span className='ms-3'><img className='ms-4' src={IconAttachFile} alt="IconAttachFile" style={{ width: '15px', height: '25px' }} /></span>
                                </div>
                            </label>
                            <input
                                type="file"
                                name="bookPdf"
                                id="bookPdf"
                                accept="application/pdf"
                                onChange={handleChangePdf}
                                hidden
                            />
                        </Col>
                        <Col>
                            {cekPdf ? (
                                <img style={{ width: '50px', height: '37px' }} src={IconChecklist} alt="Check" />
                            ) : (
                                <p>No PDF Uploaded</p>
                            )}
                        </Col>
                    </Row>
                    <Row
                        className='rowAddBook'
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Col sm={2} className='mb-1'>
                            <label htmlFor="bookImg">
                                <div className='btnAttach'>
                                    Attach Image {" "}<span className='ms-1'><img className='ms-4' src={IconAttachFile} alt="IconAttachFile" style={{ width: '15px', height: '25px' }} /></span>
                                </div>
                            </label>
                            <input
                                type="file"
                                name="bookImg"
                                id="bookImg"
                                accept='image/*'
                                onChange={handleChange}
                                hidden
                            />
                        </Col>
                        <div>
                            <img
                                src={preview}
                                style={{
                                    marginLeft: '10px',
                                    marginTop: '20px',
                                    width: "100px",
                                    height: "150px",
                                }}
                                alt=""
                            />
                        </div>
                    </Row>
                    <Row className='d-flex justify-content-end'>
                        <Button className='btnAddBook justify-content-end' type="submit" style={{ backgroundColor: "blue" }}>
                            Add Book {" "}<span className='ms-1'><img src={IconAddBookWhite} alt="IconAddBookWhite" /></span>
                        </Button>
                    </Row>
                </form>
            </Container>
        </>
    )
}

export default AddBook