const { book } = require('../../models')
const { Op } = require('sequelize')

exports.addBooks = async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            year: req.body.year,
            author: req.body.author,
            pages: req.body.pages,
            ISBN: req.body.ISBN,
            price: req.body.price,
            desc: req.body.desc,
            bookPdf: req.files.bookPdf[0].filename,
            bookImg: req.files.bookImg[0].filename,
        };

        let newBook = await book.create(data);

        let bookData = await book.findOne({
            where: {
                id: newBook.id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        bookData = JSON.parse(JSON.stringify(bookData))

        res.send({
            status: "success",
            data: {
                books: {
                    ...bookData,
                    bookPdf: process.env.FILE_PATH_PDF + bookData.bookPdf,
                    bookImg: process.env.FILE_PATH_IMAGE + bookData.bookImg,
                },
            },
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.getBooks = async (req, res) => {
    try {
        let data = await book.findAll({
            where: {
                price: {
                    [Op.gte]: 10,
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        data = JSON.parse(JSON.stringify(data))
        data = data.map((item) => {
            return {
                ...item,
                bookImg: process.env.FILE_PATH_IMAGE + item.bookImg,
                bookPdf: process.env.FILE_PATH_PDF + item.bookPdf
            }
        })

        res.send({
            status: "success",
            data: {
                books: data,
            },
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.getBook = async (req, res) => {
    try {
        const { id } = req.params;

        let data = await book.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        data = JSON.parse(JSON.stringify(data))
        data = {
            ...data,
            bookImg: process.env.FILE_PATH_IMAGE + data.bookImg,
            bookPdf: process.env.FILE_PATH_PDF + data.bookPdf
        };

        res.send({
            status: "success",
            data: {
                book: data,
            },
        });
    } catch (error) {
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.updateBooks = async (req, res) => {
    try {
        const { id } = req.params;

        let data = {
            price: req.body.price,
        };

        await book.update(data, {
            where: {
                id,
            },
        });

        let bookData = await book.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        res.send({
            status: "success",
            bookData,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        await book.destroy({
            where: {
                id,
            },
        });

        res.send({
            status: "Delete success",
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.promoBooks = async (req, res) => {
    try {
        let data = await book.findAll({
            where: {
                price: {
                    [Op.lte]: 100000,
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        data = data.map((item) => {
            return {
                item,
                bookPdf: process.env.FILE_PATH_PDF + item.bookPdf,
                bookImg: process.env.FILE_PATH_IMAGE + item.bookImg,
            }
        });

        res.send({
            status: "success",
            data: {
                promoBooks: data,
            },
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Error Fetching Promo Books",
        });
    }
};