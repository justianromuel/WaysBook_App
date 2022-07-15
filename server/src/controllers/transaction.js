const { user, cart, book, transaction, purchasedBook, profile } = require('../../models')

const midtransClient = require('midtrans-client')

exports.getTransactions = async (req, res) => {
    try {
        let transactions = await transaction.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        res.send({
            status: "Success",
            transactions,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.addTransaction = async (req, res) => {
    try {
        let dataUser = req.user;

        let getUser = await user.findOne({
            where: {
                id: dataUser.id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password'],
            },
        })

        let listCart = await cart.findAll({
            where: {
                idUser: dataUser.id,
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

        if (listCart.length == 0) {
            return res.send({
                message: "Cart is Empty!",
            });
        }

        let listProducts = listCart.map((item) => {
            return item.book.title;
        });

        let prices = listCart
            .map((item) => {
                return item.total;
            })
            .reduce((a, b) => a + b, 0);

        let data = {
            id: parseInt(Math.random().toString().slice(3, 8)),
            nameBuyer: getUser.name,
            products: listProducts.join(", "),
            total: prices,
            status: "pending",
            idUser: dataUser.id,
        };

        let pushTransaction = await transaction.create(data);

        const buyerData = await user.findOne({
            include: [
                {
                    model: profile,
                    as: 'profile',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'idUser'],
                    },
                },
            ],
            where: {
                id: pushTransaction.idUser,
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password'],
            },
        });

        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
        });

        let parameter = {
            transaction_details: {
                order_id: pushTransaction.id,
                gross_amount: pushTransaction.total,
            },
            credit_card: {
                secure: true,
            },
            customer_details: {
                full_name: buyerData?.name,
                email: buyerData?.email,
                phone: buyerData?.profile?.phone,
            },
        };

        const payment = await snap.createTransaction(parameter);

        let purBookData = listCart.map((item) => {
            return {
                idUser: dataUser.id,
                idBook: item.book.id
            }
        })

        await purchasedBook.create(purBookData)

        await cart.destroy({
            where: {
                idUser: dataUser.id,
            },
        });

        res.send({
            status: 'pending',
            message: 'Pending transaction payment gateway',
            payment,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

const core = new midtransClient.CoreApi();

core.apiConfig.set({
    isProduction: false,
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY,
});

/**
 *  Handle update transaction status after notification
 * from midtrans webhook
 * @param {string} status
 * @param {transactionId} transactionId
 */

// Create function for handle https notification / WebHooks of payment status here ...
exports.notification = async (req, res) => {
    try {
        const statusResponse = await core.transaction.notification(req.body);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(statusResponse);

        if (transactionStatus == "capture") {
            if (fraudStatus == "challenge") {
                // TODO set transaction status on your database to 'challenge'
                // and response with 200 OK
                updateTransaction("pending", orderId);
                res.status(200);
            } else if (fraudStatus == "accept") {
                // TODO set transaction status on your database to 'success'
                // and response with 200 OK
                updateProduct(orderId);
                updateTransaction("success", orderId);
                res.status(200);
            }
        } else if (transactionStatus == "settlement") {
            // TODO set transaction status on your database to 'success'
            // and response with 200 OK
            updateProduct(orderId);
            updateTransaction("success", orderId);
            res.status(200);
        } else if (
            transactionStatus == "cancel" ||
            transactionStatus == "deny" ||
            transactionStatus == "expire"
        ) {
            // TODO set transaction status on your database to 'failure'
            // and response with 200 OK
            updateTransaction("failed", orderId);
            res.status(200);
        } else if (transactionStatus == "pending") {
            // TODO set transaction status on your database to 'pending' / waiting payment
            // and response with 200 OK
            updateTransaction("pending", orderId);
            res.status(200);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Server Error'
        });
    }
};

const updateTransaction = async (status, transactionId) => {
    await transaction.update(
        {
            status,
        },
        {
            where: {
                id: transactionId,
            },
        }
    );
};

const updateProduct = async (orderId) => {
    try {
        let dataUser = await transaction.findOne({
            where: {
                id: orderId,
            },
        });

        let listCart = await cart.findAll({
            where: {
                idUser: dataUser.idUser,
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

        //Kalau Midtrans sudah Jadi pindahkan ke Notif sampai Cart Destroy
        let purBookData = listCart.map((item) => {
            return {
                idUser: dataUser.id,
                idBook: item.book.id
            }
        })

        await purchasedBook.create(purBookData)

        await cart.destroy({
            where: {
                idUser: dataUser.idUser,
            },
        });
    } catch (error) {
        console.log(error);
    }
};