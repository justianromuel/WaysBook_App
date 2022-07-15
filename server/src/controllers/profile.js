const { profile, user } = require('../../models')

exports.getProfile = async (req, res) => {
    try {
        const idUser = req.user.id

        let data = await profile.findOne({
            where: {
                idUser,
            },
            include: [
                {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['id', 'createdAt', 'updatedAt', 'password'],
                    },
                },
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        })

        data = JSON.parse(JSON.stringify(data))

        data = {
            ...data,
            avatar: process.env.FILE_PATH_PROFILE + data?.avatar
        }

        res.send({
            status: 'success',
            data,
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error',
        })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        let id = req.user.id
        const dataExist = await profile.findOne({
            where: { idUser: id }
        })

        if (!dataExist) {
            return res.send({
                message: `Profile with idUser: ${id} not found!`
            })
        }


        let data = {
            phone: req?.body?.phone,
            gender: req?.body?.gender,
            address: req?.body?.address,
            avatar: req?.file?.filename,
        }

        await profile.update(data, {
            where: {
                idUser: id
            },
        })

        res.send({
            status: 'success',
            data: {
                ...data,
                avatar: process.env.FILE_PATH_PROFILE + data.avatar
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error',
        })
    }
}