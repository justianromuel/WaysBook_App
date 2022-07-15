import React, { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap';
import rupiahFormat from 'rupiah-format';
import { useMutation } from 'react-query'

import Navbars from '../../components/navbar/Navbars'
import bgLeft from "../../assets/image/BgLeft.png";
import bgRight from "../../assets/image/BgRight.png";
import IconDelete from "../../assets/image/IconDelete.png";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { API } from '../../config/api';

function Cart() {
    let navigate = useNavigate()

    const [carts, setCarts] = useState([]);
    const [alerts, setAlerts] = useState(false);
    const [trigger, setTrigger] = useState(false);

    function handleClose() {
        setAlerts(false);
    }

    const getCarts = async () => {
        try {
            const response = await API.get('/carts')
            console.log(response.data.getCart)
            setCarts(response.data.getCart)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCarts()
    }, [trigger])

    const handleDelete = async (id) => {
        try {
            const response = await API.delete('/cart/' + id)
            console.log(response.data.getCart)
        } catch (error) {
            console.log(error)
        }
        setTrigger(true)
    }

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
        //change this according to your client-key
        const myMidtransClientKey = 'SB-Mid-client-vHbZt8xIeGsE87F0';

        let scriptTag = document.createElement('script');
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute('data-client-key', myMidtransClientKey);

        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);

    const handlePay = useMutation(async (e) => {
        try {
            e.preventDefault();

            const response = await API.post('/transaction');
            // console.log("response", response);
            const token = response.data.payment.token;
            // console.log("ini cek token:", token);

            window.snap.pay(token, {
                onSuccess: function (result) {
                    /* You may add your own implementation here */
                    setAlerts(true)
                    console.log(result);
                    navigate("/profile");
                },
                onPending: function (result) {
                    /* You may add your own implementation here */
                    setAlerts(true)
                    console.log(result);
                    navigate("/profile");
                },
                onError: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                },
                onClose: function () {
                    /* You may add your own implementation here */
                    alert("you closed the popup without finishing the payment");
                },
            });
        } catch (error) {
            console.log(error);
        }

    })

    return (
        <>
            {/* background image */}
            <img src={bgLeft} className="bgImage" alt="" />
            <img src={bgRight} className="bgImageR" alt="" />

            <Navbars />

            <Container className="mt-5 pt-5" >
                <h1>My Cart</h1>
                <h4 style={{ fontWeight: "400" }}>Review Your Order</h4>
                <Row>
                    <Col md={8}>
                        <hr />
                        {carts?.map((item, index) => (
                            <Row
                                style={{ margin: "45px 0px 45px 0px" }}
                                key={index}
                            >
                                <Col md={3}>
                                    <img
                                        style={{ boxShadow: "1px 1px 10px black", width: "130px", height: "175px" }}
                                        src={item.bookImg}
                                        className='imgCart'
                                        alt='CoverBook'
                                    />
                                </Col>
                                <Col md={8}>
                                    <h3>{item.book.title}</h3>
                                    <h6 style={{ color: "grey" }}>By: {item.book.author}</h6>
                                    <h5 className='text-success'>{rupiahFormat.convert(item.book.price)}</h5>
                                </Col>
                                <Col md={1}>
                                    <img onClick={() => handleDelete(item.id)} src={IconDelete} alt="IconDelete" style={{ cursor: "pointer" }} />
                                </Col>
                            </Row>
                        ))}
                        <hr />
                    </Col>
                    <Col md={4}>
                        <hr />
                        <Row>
                            <Col>
                                <p>Subtotal</p>
                            </Col>
                            <Col>
                                <p>
                                    {rupiahFormat.convert(
                                        carts
                                            .map((item) => {
                                                return item.total;
                                            })
                                            .reduce((a, b) => a + b, 0)
                                    )}
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p>Qty</p>
                            </Col>
                            <Col>
                                <p>
                                    {carts
                                        .map((item) => {
                                            return item.qty;
                                        })
                                        .reduce((a, b) => a + b, 0)}
                                </p>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>
                                <p className='text-success'>Total</p>
                            </Col>
                            <Col>
                                <p className='text-success'>
                                    {rupiahFormat.convert(
                                        carts
                                            .map((item) => {
                                                return item.total;
                                            })
                                            .reduce((a, b) => a + b, 0)
                                    )}
                                </p>
                            </Col>
                        </Row>
                        <div className='d-flex justify-content-center'>
                            <Button className='btnPay d-flex align-items-end justify-content-center' onClick={(e) => handlePay.mutate(e)}>Pay</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Cart