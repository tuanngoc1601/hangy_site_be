import jwt from "jsonwebtoken";
import authService from "../services/authService";

const authController = {
    handleLogin: async (req, res) => {
        let email = req.body.email;
        let password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({
                errorCode: 1,
                message: "Missing inputs parameter!",
            });
        }

        let message = await authService.handleUserLogin(email, password);
        if (message.errorCode !== 0) {
            return res.status(404).json(message);
        }
        const accessToken = authController.generateAccessToken(message);
        const refreshToken = authController.generateRefreshToken(message);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        });
        return res.status(200).json({ ...message, accessToken });
    },

    generateAccessToken: (message) => {
        return jwt.sign(
            {
                id: message.data.id,
                admin: message.data.is_admin,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "30s" }
        );
    },

    generateRefreshToken: (message) => {
        return jwt.sign(
            {
                id: message.data.id,
                admin: message.data.is_admin,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "365d" }
        )
    },

    handleCreateNewUser: async (req, res) => {
        let message = await authService.handleCreateNewUser(req.body);
        if (message.errorCode === 0) return res.status(200).json(message);
        else return res.status(404).json(message);
    },

    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json({
            message: "You're not authenticated"
        });
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if(err) {
                console.log(err);
            }
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.status(200).json({ accessToken: newAccessToken });
        });
    },

    handleLogout: async (req, res) => {
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "Logout successfully!" });
    }
};

module.exports = authController;
