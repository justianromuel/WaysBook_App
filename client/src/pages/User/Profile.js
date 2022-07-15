import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useQuery } from "react-query"

import bgLeft from "../../assets/image/BgLeft.png";
import bgRight from "../../assets/image/BgRight.png";
import Navbars from '../../components/navbar/Navbars';
import IconEmail from "../../assets/image/IconEmail.png";
import IconPhone from "../../assets/image/IconPhone.png";
import IconGender from "../../assets/image/IconGender.png";
import IconAddress from "../../assets/image/IconAddress.png";
import Profiles from '../../components/modal/Profiles'
import { UserContext } from '../../context/userContext';
import { API } from '../../config/api';

function Profile() {
    let navigate = useNavigate()

    const [state, dispatch] = useContext(UserContext)

    const [modalShow, setModalShow] = useState(false)
    const handleShow = () => setModalShow(!modalShow)

    // const [detailProfile, setDetailProfile] = useState({})
    // const [preview, setPreview] = useState(null)
    // const [detailBook, setDetailBook] = useState([])
    // const [form, setForm] = useState({
    //     gender: "",
    //     phone: "",
    //     address: "",
    //     avatar: ""
    // })

    let { data: profile } = useQuery('profileCache', async () => {
        const response = await API.get('/profile');
        console.log(response.data.data);
        return response.data.data;
    })

    // const handleChange = (e) => {
    //     setForm({
    //         ...form,
    //         [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value
    //     })

    //     if (e.target.type === "file") {
    //         let url = URL.createObjectURL(e.target.files[0])
    //         setPreview()
    //     }
    // }

    useEffect(() => {
        API.get("/profile")
    })

    return (
        <>
            {/* background image */}
            <img src={bgLeft} className="bgImage" alt="" />
            <img src={bgRight} className="bgImageR" alt="" />

            <Navbars />

            <Container className="mt-3" >
                <Row>
                    <Col>
                        <h2 className='textTitle'>Profile</h2>
                        <Container style={{ padding: "0 15px" }} className='containerProfile' >
                            <Row>
                                <Col>
                                    <div className='profileDetailLeft'>
                                        <div>
                                            <img src={IconEmail} alt="" />
                                        </div>
                                        <div>
                                            <h4 className='textTitle'>{profile?.user.email}</h4>
                                            <h6 className='text-secondary'>Email</h6>
                                        </div>
                                    </div>
                                    <div className='profileDetailLeft'>
                                        <div>
                                            <img src={IconGender} alt="" />
                                        </div>
                                        <div>
                                            <h4 className='textTitle'>{profile?.gender}</h4>
                                            <h6 className='text-secondary'>Gender</h6>
                                        </div>
                                    </div>
                                    <div className='profileDetailLeft'>
                                        <div>
                                            <img src={IconPhone} alt="" />
                                        </div>
                                        <div>
                                            <h4 className='textTitle'>{profile?.phone}</h4>
                                            <h6 className='text-secondary'>Mobile Phone</h6>
                                        </div>
                                    </div>
                                    <div className='profileDetailLeft'>
                                        <div>
                                            <img src={IconAddress} alt="IconAddress" />
                                        </div>
                                        <div>
                                            <h4 className='textTitle'>{profile?.address}</h4>
                                            <h6 className='text-secondary'>Address</h6>
                                        </div>
                                    </div>
                                </Col>
                                <Col>
                                    <div>
                                        <div className='profileDetailRight'>
                                            <img style={{ width: "250px", height: "300px", borderRadius: "5px" }} src={profile?.avatar} alt="" />
                                            <Button className='mt-3 btn-danger btnEditProfile' onClick={handleShow}>Edit Profile</Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>

                {/* My Books */}
                <Row className='py-5'>
                    <Col>
                        <h2 className='textTitle'>My Books</h2>
                    </Col>
                </Row>
                <Row className='pb-5 rowMyBooks'>
                    <Col md="2" className='mb-4'>
                        <img
                            className="imgListBook"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sebuah-seni-untuk-bersikap-bodoh-amat.jpg/330px-Sebuah-seni-untuk-bersikap-bodoh-amat.jpg" alt="" />
                        <h3 style={{ textAlign: "justify" }}>Title Book</h3>
                        <h6 style={{ textAlign: "justify", color: "grey" }}>By: Author</h6>
                        <Button className='btnDownload'>Download</Button>
                    </Col>
                </Row>

            </Container>
            {/* Modal */}
            {modalShow ? <Profiles isOpen={modalShow} /> : null}
        </>
    )
}

export default Profile