import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await checkUserEmail(email);
            if (user) {
                // compare password
                let checkPassword = await bcrypt.compareSync(
                    password,
                    user.password
                );
                if (checkPassword) {
                    const { password, ...data } = user;
                    resolve({
                        errorCode: 0,
                        message: "Ok",
                        data: data
                    });
                } else {
                    resolve({
                        errorCode: 1,
                        message: "Wrong password",
                        data: {}
                    });
                }
            } else {
                resolve({
                    errorCode: 2,
                    message: "Your's email isn't exist in your system. Please try other email!",
                    data: {}
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
                raw: true
            });
            if (user) {
                resolve(user);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "ALL") {
                users = db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                    raw: true,
                });
            }
            if (userId && userId !== "ALL") {
                users = db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password"],
                    },
                    raw: true,
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check user email is exist
            let user = await checkUserEmail(data.email);
            if (user) {
                resolve({
                    errorCode: 1,
                    message: "Email is existed in system",
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(
                    data.password
                );
                await db.User.create({
                    ...data,
                    password: hashPasswordFromBcrypt,
                });
                resolve({
                    errorCode: 0,
                    message: "OK",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errorCode: 2,
                    message: "Missing required parameter",
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phonenumber = data.phonenumber;

                await user.save();

                resolve({
                    errorCode: 0,
                    message: "Update the user success",
                });
            } else {
                resolve({
                    errorCode: 1,
                    message: "User is not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // find user and delete user by sequelize
            let user = await db.User.findOne({
                where: { id: userId },
            });
            if (!user) {
                resolve({
                    errorCode: 2,
                    message: "User is not existed!",
                });
            }

            await user.destroy();
            // destroy user by id in database
            // await db.User.destroy({
            //     where: { id: userId }
            // })

            resolve({
                errorCode: 0,
                message: "The user is deleted!",
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getAllCodeService = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!type) {
                resolve({
                    errorCode: 1,
                    message: "Missing required parameters",
                });
            } else {
                let res = {};
                let allCode = await db.Allcode.findAll({
                    where: { type: type },
                });
                res.errorCode = 0;
                res.data = allCode;

                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    updateUserData: updateUserData,
    deleteUser: deleteUser,
    getAllCodeService: getAllCodeService,
};
