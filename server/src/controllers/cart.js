const { user, book, cart } = require('../../models')

exports.addCart = async (req, res) => {
    try {
        let idUser = req.user.id;

        let data = {
            idUser: idUser,
            idProduct: req.body.idProduct,
            total: 0,
            qty: 0,
        };

        let getProduct = await book.findOne({
            where: {
                id: data.idProduct,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        data = {
            ...data,
            total: getProduct.price,
            qty: 1,
        };

        let addCart = await cart.create(data);

        res.send({
            status: "success",
            addCart,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.getCart = async (req, res) => {
    try {
        let idUser = req.user.id;

        let getCart = await cart.findAll({
            where: {
                idUser: idUser,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "password", "updatedAt", "id"],
                    },
                },
                {
                    model: book,
                    as: "book",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
        });

        getCart = JSON.parse(JSON.stringify(getCart))
        getCart = getCart.map((item) => {
            return {
                ...item,
                bookPdf: process.env.FILE_PATH_PDF + item.book.bookPdf,
                bookImg: process.env.FILE_PATH_IMAGE + item.book.bookImg
            };
        });

        res.send({
            status: "Success",
            getCart,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        let { id } = req.params;

        await cart.destroy({
            where: {
                id,
            },
        });

        res.send({
            status: "success",
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};