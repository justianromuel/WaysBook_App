const { book, purchasedBook } = require("../../models");

exports.getPurchased = async (req, res) => {
    try {
        let dataUser = req.user;

        let purBook = await purchasedBook.findAll({
            where: {
                idUser: dataUser.id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            include: [
                {
                    model: book,
                    as: "book",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
        });

        purBook = purBook.filter(
            (value, index, self) =>
                index ===
                self.findIndex(
                    (t) => t.idUser === value.idUser && t.idBook === value.idBook
                )
        );

        purBook = JSON.parse(JSON.stringify(purBook))
        purBook = purBook.map((item) => {
            return {
                ...item,
                bookPdf: process.env.FILE_PATH_PDF + item.book.bookPdf,
                bookImg: process.env.FILE_PATH_IMAGE + item.book.bookImg
            };
        });

        res.send({
            status: "Success",
            purBook,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.getOnePurchased = async (req, res) => {
    try {
        let dataUser = req.user;
        let idParams = req.params.id;

        let purBook = await purchasedBook.findOne({
            where: {
                idUser: dataUser.id,
                idBook: idParams,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            include: [
                {
                    model: book,
                    as: "book",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
        });

        res.send({
            status: "Success",
            purBook,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};