import React, { useContext, useState } from 'react'
import { Alert, Button, Modal } from 'react-bootstrap';
import { useMutation } from 'react-query'

import { UserContext } from '../../context/userContext';
import { API } from '../../config/api';
import Login from './Login';

function Register(props) {
    const [state, dispatch] = useContext(UserContext)
    const [message, setMessage] = useState(null)
    const [show, setShow] = useState(props.isOpen)
    const [isClickLogin, setIsClickLogin] = useState(false)

    const handleClose = () => setShow(false)
    const handleClickLogin = () => {
        setShow(false)
        setIsClickLogin(!isClickLogin)
    }

    // Register
    const [formRegister, setFormRegister] = useState({
        name: '',
        email: '',
        password: ''
    })

    const { name, email, password } = formRegister

    const handleChangeRegister = (e) => {
        setFormRegister({
            ...formRegister,
            [e.target.name]: e.target.value
        })
    }
    // console.log(formRegister);
    const handleSubmitRegister = useMutation(async (e) => {
        try {
            e.preventDefault()

            // Configuration Content-type
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }

            // Data Body
            const body = JSON.stringify(formRegister)
            console.log("body", body);
            const response = await API.post('register', body, config)
            console.log("response", response);

            if (response.data.status === "success") {
                const alert = (
                    <Alert variant="success" className="py-1">
                        Register Success
                    </Alert>
                )
                setMessage(alert)
                setFormRegister({
                    name: '',
                    email: '',
                    password: ''
                })
            } else {
                const alert = (
                    <Alert variant='danger' className='py-1'>
                        {response.data.message}
                    </Alert>
                )
                setMessage(alert)
            }
        } catch (error) {
            const alert = (
                <Alert variant='danger' className='py-1'>
                    Register Failed
                </Alert>
            )
            setMessage(alert)
            console.log(error);
        }
    })

    return (
        <>
            <Modal show={show} onHide={handleClose} centered >
                <Modal.Body>
                    <h2 className='textTitle my-4'>Register</h2>
                    <div className='card-auth'>
                        <form onSubmit={(e) => handleSubmitRegister.mutate(e)}>
                            {message && message}
                            <div className='form mb-3'>
                                <input
                                    type="text"
                                    placeholder='Full Name'
                                    name='name'
                                    onChange={handleChangeRegister}
                                    value={name}
                                    required />
                            </div>
                            <div className='form mb-3'>
                                <input
                                    type="email"
                                    placeholder='Email'
                                    name='email'
                                    onChange={handleChangeRegister}
                                    value={email}
                                    required />
                            </div>
                            <div className='form mb-3'>
                                <input
                                    type="password"
                                    placeholder='Password'
                                    name='password'
                                    onChange={handleChangeRegister}
                                    value={password}
                                    required />
                            </div>
                            <div className='d-grid my-4'>
                                <Button className='btnModal' type='submit'>
                                    Register
                                </Button>
                            </div>
                            <div>
                                <p className='text-center'>Already have an account ? Click{" "}
                                    <strong onClick={handleClickLogin} className="pointHover">Here</strong>
                                </p>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
            {/* Modal */}
            {isClickLogin ? <Login isOpen={isClickLogin} /> : null}
        </>
    )
}

export default Register