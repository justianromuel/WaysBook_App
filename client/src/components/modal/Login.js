import React, { useContext, useState } from 'react'
import { Alert, Button, Modal } from 'react-bootstrap';
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../../context/userContext';
import { API } from '../../config/api';
import Register from './Register';

function Login(props) {
    let navigate = useNavigate()

    const [state, dispatch] = useContext(UserContext)
    const [message, setMessage] = useState(null)
    const [show, setShow] = useState(props.isOpen)
    const [isClickRegister, setIsClickRegister] = useState(false)

    const handleClose = () => setShow(false)
    const handleClickRegister = () => {
        setShow(false)
        setIsClickRegister(!isClickRegister)
    }

    // Login
    const [formLogin, setFormLogin] = useState({
        email: '',
        password: ''
    })

    const { email, password } = formLogin

    const handleChangeLogin = (e) => {
        setFormLogin({
            ...formLogin,
            [e.target.name]: e.target.value
        })
    }
    // console.log(formRegister);
    const handleSubmitLogin = useMutation(async (e) => {
        try {
            e.preventDefault()

            // Configuration Content-type
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }

            // Data Body
            const body = JSON.stringify(formLogin)

            const response = await API.post('login', body, config)
            // console.log("response", response);

            if (response?.status === 200) {
                // Send data to useContext
                // console.log('send LOGIN_SUCCESS');
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: response.data.data.user
                })

                if (response.data.data.user.role === 'admin') {
                    navigate('/list-transaction')
                } else {
                    navigate('/')
                }

                const alert = (
                    <Alert variant='success' className='py-1'>
                        Login success
                    </Alert>
                )
                setMessage(alert)
            }
        } catch (error) {
            const alert = (
                <Alert variant='danger' className='py-1'>
                    Login Failed
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
                    <h2 className='textTitle my-4'>Login</h2>
                    <div className='card-auth'>
                        <form onSubmit={(e) => handleSubmitLogin.mutate(e)}>
                            <div className='form mb-3'>
                                <input
                                    type="email"
                                    placeholder='Email'
                                    name='email'
                                    onChange={handleChangeLogin}
                                    value={email}
                                    required
                                />
                            </div>
                            <div className='form mb-3'>
                                <input
                                    type="password"
                                    placeholder='Password'
                                    name='password'
                                    onChange={handleChangeLogin}
                                    value={password}
                                    required
                                />
                            </div>
                            <div className='d-grid my-4'>
                                <Button className='btnModal' type='submit'>
                                    Login
                                </Button>
                            </div>
                            <div>
                                <p className='text-center'>Don't have an account ? Click{" "}
                                    <strong onClick={handleClickRegister} className="pointHover">Here</strong>
                                </p>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
            {/* Modal */}
            {isClickRegister ? <Register isOpen={isClickRegister} /> : null}
        </>
    )
}

export default Login