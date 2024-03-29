const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const mongoose = require('mongoose');
const response = require('../helpers/response');
const Wallet = require('../models/wallet');

class WalletController {
    static async getUserWallet(req, res) {
        try {
            // const user = await User.findById(req.params.id);
            const wallet = await Wallet.findById(req.params.id);

            if (!wallet) {
                res.status(500).send(response('No wallet find', {}, false));
            }

            res.send(response('Fetched wallet successfully', wallet));
        } catch (err) {
            console.log(err.message);
        }
    }

    static async sendToken(req, res) {
        const user = await User.findById(req.params.email).select(
            '-passwordHash'
        );

        if (!user) {
            return res.status(500).send(response('user not found', {}, false));
        }

        res.status(200).send(response('Fetched users successfully', user));
    }

    // static async createAdminUser(req, res) {
    //     try {
    //         const userExist = await User.findOne({ email: req.body.email });

    //         if (userExist) {
    //             return res
    //                 .status(400)
    //                 .send(response('email already exist', {}, false));
    //         }

    //         let user = new User({
    //             firstName: req.body.firstName,
    //             lastName: req.body.lastName,
    //             email: req.body.email,
    //             passwordHash: bcrypt.hashSync(req.body.password, 10),
    //             phone: req.body.phone,
    //             role: req.body.role,
    //         });
    //         user = await user.save();

    //         if (!user)
    //             return res
    //                 .status(500)
    //                 .send(response('The user can not be created', {}, false));

    //         res.send(response('User was created successfully', user));

    //         const userId = await user._id;

    //         let wallet = new Wallet({
    //             user: userId,
    //         });
    //         wallet = await wallet.save();
    //     } catch (error) {
    //         res.send(response(error.message, {}, false));
    //     }
    // }

    // static async updateUserById(req, res) {
    //     if (!mongoose.isValidObjectId(req.params.id)) {
    //         res.status(400).send(response('invalid User id', {}, false));
    //     }

    //     const update = {
    //         ...req.body,
    //     };
    //     const filter = { _id: req.params.id };

    //     try {
    //         const user = await User.findOneAndUpdate(filter, update, {
    //             new: true,
    //         }).select('-passwordHash');

    //         if (!user)
    //             return res
    //                 .status(500)
    //                 .send(response('The user can not be updated', {}, false));

    //         return res
    //             .status(200)
    //             .send(response('User was successfullly updated', user));
    //     } catch (error) {
    //         res.status(409).send(response(error.message, {}, false));
    //         console.log(error.message);
    //     }
    // }

    // static async loginUser(req, res) {
    //     const user = await User.findOne({ email: req.body.email });

    //     if (!user) {
    //         return res.status(400).send(response('user not found', {}, false));
    //     }

    //     if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    //         const token = jwt.sign(
    //             {
    //                 userId: user.id,
    //                 role: user.role,
    //             },
    //             secret,
    //             { expiresIn: '1d' }
    //         );

    //         return res.status(200).send(
    //             response('Login successful', {
    //                 user: user.email,
    //                 token: token,
    //             })
    //         );
    //     } else {
    //         res.status(400).send(response('password is wrong!', {}, false));
    //     }
    // }

    // static async registerNewUser(req, res) {
    //     const userExist = await User.findOne({ email: req.body.email });

    //     if (userExist) {
    //         return res
    //             .status(400)
    //             .send(response('email already exist', {}, false));
    //     }

    //     try {
    //         let user = new User({
    //             firstName: req.body.firstName,
    //             lastName: req.body.lastName,
    //             email: req.body.email,
    //             passwordHash: bcrypt.hashSync(req.body.password, 10),
    //             phone: req.body.phone,
    //         });
    //         user = await user.save();

    //         if (!user)
    //             return res
    //                 .status(404)
    //                 .send(response('The user can not be created', {}, false));

    //         res.send(response('User created successfully', user));

    //         const userId = await user._id;

    //         let wallet = new Wallet({
    //             user: userId,
    //         });
    //         wallet = await wallet.save();
    //     } catch (error) {
    //         res.send(response(error.message, {}, false));
    //     }
    // }

    // static async getTotalAmountOfAllUsers(req, res) {
    //     const userCount = await User.countDocuments((count) => count);

    //     if (!userCount) {
    //         return res
    //             .status(500)
    //             .send(response('Users count unsuccessful', {}, false));
    //     }

    //     res.send(response('Users count successful', userCount));
    // }

    // static deleteUserById(req, res) {
    //     User.findByIdAndDelete(req.params.id)
    //         .then((user) => {
    //             if (user) {
    //                 return res
    //                     .status(200)
    //                     .send(response('User was successful deleted ', {}));
    //             } else {
    //                 return res
    //                     .status(404)
    //                     .send(response('User not found', {}, false));
    //             }
    //         })
    //         .catch((error) => {
    //             return res.status(400).send(response(error.message, {}, false));
    //         });
    // }

    // static deleteMyAccount(req, res) {
    //     User.findByIdAndDelete(req.params.id)
    //         .then((user) => {
    //             if (user) {
    //                 return res
    //                     .status(200)
    //                     .send(response('Account was successful deleted ', {}));
    //             } else {
    //                 return res
    //                     .status(404)
    //                     .send(response('Account not found', {}, false));
    //             }
    //         })
    //         .catch((error) => {
    //             return res.status(400).send(response(error.message, {}, false));
    //         });
    // }
}

module.exports = WalletController;
