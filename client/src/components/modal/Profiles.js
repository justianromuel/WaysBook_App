import React, { useContext, useEffect, useState } from 'react'
import { Alert, Button, Modal } from 'react-bootstrap';
import { useMutation, useQuery } from 'react-query'

import { UserContext } from '../../context/userContext';
import { API } from '../../config/api';

function Profiles(props) {
    const [state, dispatch] = useContext(UserContext)
    const [message, setMessage] = useState(null)
    const [show, setShow] = useState(props.isOpen)
    const [preview, setPreview] = useState(null) //For image preview
    const [profile, setProfile] = useState({}) //Store profile data
    const [form, setForm] = useState({
        avatar: '',
        phone: '',
        gender: '',
        address: '',
    }) //Store profile data

    // Fetching profile data from database
    let { data: profileData } = useQuery("profileCache", async () => {
        const response = await API.get("/profile");
        // console.log(response);
        return response.data.data
    })

    useEffect(() => {
        if (profileData) {
            setPreview(profileData.avatar)
            setForm({
                ...form,
                phone: profileData.phone,
                gender: profileData.gender,
                address: profileData.address,
            })
            setProfile(profileData)
        }
    }, [profileData]);

    // Handle change data on form
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === 'file' ? e.target.files : e.target.value,
        })

        // Create image url for preview
        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        }
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            // Configuration
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            }

            // Store data with FormData as object
            const formData = new FormData()
            if (form.avatar) {
                formData.set('avatar', form?.avatar[0], form?.avatar[0]?.name)
            }
            formData.set('gender', form.gender)
            formData.set('phone', form.phone)
            formData.set('address', form.address)
            console.log('isi form:', form);
            // Insert profile data
            const response = await API.patch('/profile', formData, config)
            console.log(response)
            setShow(false)
        } catch (error) {
            console.log(error)
        }
    })

    const handleClose = () => setShow(false)

    return (
        <>
            <Modal show={show} onHide={handleClose} centered >
                <Modal.Body>
                    <h2 className='textTitle my-4'>Edit Profile</h2>
                    <div className='card-auth'>
                        <form onSubmit={(e) => handleSubmit.mutate(e)}>
                            {message && message}
                            {preview && (
                                <div>
                                    <img
                                        src={preview}
                                        style={{
                                            maxWidth: '150px',
                                            maxHeight: '150px',
                                            objectFit: 'cover',
                                            marginBottom: '5px',
                                            borderRadius: '10%'
                                        }}
                                        alt="preview"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                className="form-control bg-transparent border-0 text-white"
                                id="upload"
                                name="avatar"
                                accept='image/*'
                                onChange={handleChange}
                                hidden
                            />
                            <label for="upload" className="labelUploadProfile">
                                Upload File
                            </label>
                            <div className='form mb-3'>
                                <input
                                    type="text"
                                    placeholder='Gender (Male or Female)'
                                    name='gender'
                                    value={form?.gender}
                                    onChange={handleChange}
                                    required />
                            </div>
                            <div className='form mb-3'>
                                <input
                                    type="text"
                                    placeholder='Phone Number'
                                    name='phone'
                                    value={form?.phone}
                                    onChange={handleChange}
                                    required />
                            </div>
                            <div className='form mb-3'>
                                <input
                                    type="textarea"
                                    placeholder='Address'
                                    name='address'
                                    value={form?.address}
                                    onChange={handleChange}
                                    required />
                            </div>
                            <div className='d-grid my-4'>
                                <Button className='btnModal' type='submit'>
                                    Update
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Profiles