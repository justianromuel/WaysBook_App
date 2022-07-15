const express = require('express')
const router = express.Router()

// Controller:
const { register, login, checkAuth } = require('../controllers/auth')
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/user')
const { getProfile, updateProfile } = require('../controllers/profile')
const { addBooks, getBooks, getBook, updateBooks, deleteBook, promoBooks } = require('../controllers/book')
const { addCart, getCart, deleteCart } = require('../controllers/cart')
const { getTransactions, addTransaction, notification } = require('../controllers/transaction')
const { getPurchased, getOnePurchased } = require('../controllers/purchased')

// Middleware:
// Authentication
const { auth } = require('../middlewares/auth')
// Upload Avatar
const { uploadFile } = require('../middlewares/uploadFile')
// Upload bookPdf & bookImg
const { uploadFiles } = require('../middlewares/uploadFiles')

// Route:
// Auth
router.post('/register', register)
router.post('/login', login)
router.get('/check-auth', auth, checkAuth)

// User
router.get('/users', getUsers)
router.get('/user/:id', getUser)
router.patch('/user/:id', auth, updateUser)
router.delete('/user/:id', auth, deleteUser)

// Profile
router.get('/profile', auth, getProfile);
router.patch('/profile', auth, uploadFile('avatar'), updateProfile);

// Book
router.post('/book', auth, uploadFiles('bookPdf', 'bookImg'), addBooks)
router.get('/books', getBooks)
router.get('/book/:id', auth, getBook)
router.patch('/book/:id', auth, uploadFiles('bookPdf', 'bookImg'), updateBooks)
router.delete('/book/:id', auth, deleteBook)
router.get('/promo-books', promoBooks)

// Cart
router.post('/cart', auth, addCart)
router.get('/carts', auth, getCart)
router.delete('/cart/:id', auth, deleteCart)

// Transaction
router.get('/transactions', auth, getTransactions)
router.post('/transaction', auth, addTransaction)
router.post('/notification', notification)

// Purchased
router.get('/purchased-books', auth, getPurchased)
router.get('/purchased-book/:id', auth, getOnePurchased)

module.exports = router