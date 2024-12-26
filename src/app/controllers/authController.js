import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

let userArr = [];

const authController = {
	// REGISTER
	register: async (req, res, next) => {
		try {
			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(req.body.password, salt);

			const newUser = {
				username: req.body.username,
				email: req.body.email,
				password: hash,
			};

			await User.insert(newUser);
			res.status(200).json({
				message: 'register success',
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({
				error: 'Registration failed. Please try again later.',
			});
		}
	},
	// GENERATEACCESSTOKEN
	generateAccessToken: (user) => {
		return jwt.sign(
			{ id: user.idUser, isAdmin: user.isAdmin },
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: '1d',
			}
		);
	},
	// GENERATEREFRESHTOKEN
	generateRefreshToken: (user) => {
		return jwt.sign(
			{
				id: user.id,
				isAdmin: user.isAdmin,
			},
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '30d' }
		);
	},
	// LOGIN
	login: async (req, res, next) => {
		try {
			const result = await User.selectOne({
				username: req.body.username,
			});

			const [user] = result;

			if (!user) {
				return res.status(404).json('Incorrect username');
			}
			const isPassword = await bcrypt.compare(req.body.password, user.password);

			if (!isPassword) {
				return res.status(404).json('Incorrect password');
			}

			const accessToken = authController.generateAccessToken(user);
			const refreshToken = authController.generateRefreshToken(user);

			await User.updateRefeshToken(refreshToken, user.idUser);
			const { password, updatedAt, createdAt, ...rest } = user;
			const newUser = {
				...rest,
				refreshToken: refreshToken,
				accessToken: accessToken,
			};

			const data = {
				user: newUser,
				message: 'Login success',
			};

			return res.json(data);
			//
		} catch (error) {
			return next(error);
		}
	},
	// REQUESTREFRESHTOKEN
	requestRefreshToken: async (req, res) => {
		const refreshToken = req.body.refreshToken;
		const idUser = req.body.idUser;
		if (!refreshToken) return res.status(401).json("You're not authenticated");
		const user = await User.selectOne({ idUser: idUser });
		userArr.push(user[0]);
		if (user[0].refreshToken != refreshToken) {
			return res.status(403).json('Refresh token is not valid');
		}

		const newAccessToken = authController.generateAccessToken(user[0]);

		res.status(200).json({
			accessToken: newAccessToken,
		});
	},
	//LOG OUT
	logOut: async (req, res) => {
		await User.updateRefeshToken(userArr.idUser, null);
		res.status(200).json('Log out successfully!');
	},
};

export default authController;
