import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import rupiahFormat from 'rupiah-format';
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom';

import Navbars from '../../components/navbar/Navbars'
import bgLeft from "../../assets/image/BgLeft.png";
import bgRight from "../../assets/image/BgRight.png";
import IconCartWhite from "../../assets/image/IconCartWhite.png";
import { API } from '../../config/api';

function DetailBook() {
    let { id } = useParams()

    const [isBuy, setIsBuy] = useState(false);
    const [alerts, setAlerts] = useState(false);
    const [dtlBook, setDtlBook] = useState({});

    let { data: book } = useQuery('bookCache', async () => {
        const response = await API.get('/book/' + id);
        // console.log(response);
        return response.data.data.book;
    });
    // console.log(book);

    const setAddCart = () => {
        try {

            // Configuration Content-type
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const response = API.post('/cart', { idProduct: id }, config)
            console.log(response);
            setAlerts(true);

        } catch (error) {
            console.log(error);
        }
    };

    const getPurchased = async () => {
        try {
            const response = await API.get('/purchased/' + id)
            // console.log(response);
            if (response.data.purBook) {
                setIsBuy(true)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setDtlBook(book)
        getPurchased()
    }, []);

    return (
        <>
            {/* background image */}
            <img src={bgLeft} className="bgImage" alt="" />
            <img src={bgRight} className="bgImageR" alt="" />

            <Navbars />

            <Container style={{ maxWidth: "1100px" }} className="mt-5 pt-5" >
                <Row>
                    <Col md={4}>
                        <img
                            src={book?.bookImg}
                            className='imgDetailBook'
                            alt='CoverBook'
                        />
                    </Col>
                    <Col md={8}>
                        <h1>{book?.title}</h1>
                        <h6 style={{ color: "grey" }}>By: {book?.author}</h6>
                        <div>
                            <h5>Publication Date</h5>
                            <p style={{ color: "grey" }}>{book?.year}</p>
                        </div>
                        <div>
                            <h5>Pages</h5>
                            <p style={{ color: "grey" }}>{book?.pages}</p>
                        </div>
                        <div>
                            <h5 className='text-danger'>ISBN</h5>
                            <p style={{ color: "grey" }}>{book?.ISBN}</p>
                        </div>
                        <div>
                            <h5>Price</h5>
                            <p className='text-success'>{rupiahFormat.convert(book?.price)}</p>
                        </div>
                    </Col>
                </Row>
                <Row className='mt-5 py-5'>
                    <Col>
                        <h2>About This Book</h2>
                        <p style={{ textAlign: "justify", color: "grey" }}>
                            {book?.desc}
                        </p>
                        {isBuy ? (
                            <div>
                                {/* <button onClick={() => setAddCart()} style={{ backgroundColor: 'red', border: 'none' }}>
                                    <span>Add Cart</span> <img alt="" src={IconCartWhite} />
                                </button> */}

                                <a
                                    style={{
                                        marginLeft: "30px",
                                    }}
                                    href={dtlBook.bookPdf}
                                    target="_blank"
                                >
                                    <div className='d-flex justify-content-end '>

                                        <Button className='btnCart d-flex align-items-end' >Download</Button>
                                    </div>
                                    {/* <span
                                        style={{
                                            margin: "auto",
                                        }}
                                    >
                                        Download
                                    </span> */}
                                </a>
                            </div>
                        ) : (
                            <div className='d-flex justify-content-end'>
                                <Button onClick={() => setAddCart()} className='btnCart d-flex align-items-end' >Add Cart {" "}<img src={IconCartWhite} alt="IconCart" style={{ marginLeft: "10px", width: "25px", height: "25px" }} /></Button>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
            <Modal
                style={{
                    top: "250px",
                }}
                show={alerts}
                onHide={() => setAlerts(false)}
            >
                <Modal.Body
                    style={{
                        textAlign: "center",
                        color: "#469F74",
                        fontSize: "24px",
                    }}
                >
                    The product is successfully added to the cart
                </Modal.Body>
            </Modal>
        </>
    )
}

export default DetailBook