import db from "../models/index";

const productService = {
    handleUserLogin: (email, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await authService.checkUserEmail(email);
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
                            data: data,
                        });
                    } else {
                        resolve({
                            errorCode: 1,
                            message: "Wrong password",
                            data: {},
                        });
                    }
                } else {
                    resolve({
                        errorCode: 2,
                        message:
                            "Your's email isn't exist in your system. Please try other email!",
                        data: {},
                    });
                }
            } catch (e) {
                reject(e);
            }
        });
    },

    checkUserEmail: (userEmail) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.User.findOne({
                    where: { email: userEmail },
                    raw: true,
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
    },

    handleGetAllProductService: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const products = await db.Product.findAll({
                    raw: true,
                });
                resolve(products);
            } catch (e) {
                reject(e);
            }
        });
    }
};

module.exports = productService;
