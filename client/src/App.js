import React, { useEffect, useContext } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom';

// Admin Page:
import ListTransaction from "./pages/Admin/ListTransaction";
import AddBook from "./pages/Admin/AddBook";

// User Page:
import LandingPage from "./pages/LandingPage";
import DetailBook from "./pages/User/DetailBook";
import Cart from "./pages/User/Cart";
import Profile from "./pages/User/Profile";

import { UserContext } from './context/userContext';
import { API, setAuthToken } from './config/api';
import ComplainUser from "./pages/User/ComplainUser";
import ComplainAdmin from "./pages/Admin/ComplainAdmin";

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  let navigate = useNavigate()
  // Init user context
  const [state, dispatch] = useContext(UserContext)
  // console.clear()
  // console.log(state)

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    // Redirect Auth
    if (state.isLogin === false) {
      navigate('/')
    } else {
      if (state.user.role === 'admin') {
        navigate('/list-transaction')
      } else if (state.user.role === 'customer') {
        navigate('/')
      }
    }
  }, [state])

  const checkAuth = async () => {
    try {
      const response = await API.get('/check-auth')
      // console.log('response:', response);

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        })
      }
      // Get user data
      let payload = response.data.data.user
      // console.log('payload:', payload);
      // Get token from local storage
      payload.token = localStorage.token

      // Send data to useContext
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (localStorage.token) {
      checkAuth()
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/detail-book/:id" element={<DetailBook />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/list-transaction" element={<ListTransaction />} />
      <Route path="/add-book" element={<AddBook />} />
      <Route path="/complain-user" element={<ComplainUser />} />
      <Route path="/complain-admin" element={<ComplainAdmin />} />
    </Routes>
  );
}

export default App;
