import connection from './../../config/connect.js';

const executeQuery = (sql, values) => {
	return new Promise((resolve, reject) => {
		connection.query(sql, values, (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results);
			}
		});
	});
};

const Review = {
	insert: async (data) => {
		const { content, idProduct, idUser } = data;

		const sql = `INSERT INTO review (content, idProduct, idUser) VALUES (?, ?, ?)`;

		const values = [content, idProduct, idUser];

		try {
			const results = await executeQuery(sql, values);
			return results;
		} catch (error) {
			throw error;
		}
	},

	selectAll: async (limit, offset) => {
		const sql = `SELECT * FROM review limit ? offset ?`;

		try {
			const results = await executeQuery(sql, [+limit, +offset]);
			return results;
		} catch (error) {
			throw error;
		}
	},

	selectOne: async (id) => {
		const sql = `SELECT * FROM review WHERE idReview = ?`;

		try {
			const results = await executeQuery(sql, [id]);
			return results;
		} catch (error) {
			throw error;
		}
	},

	delete: async (id) => {
		const sql = `DELETE FROM review WHERE idReview = ?`;

		try {
			const results = await executeQuery(sql, [id]);
			return results;
		} catch (error) {
			throw error;
		}
	},

	update: async (id, { content }) => {
		console.log(id, content);
		const sql = `UPDATE review SET content = ? WHERE idReview = ?`;

		const values = [content, +id];

		try {
			const results = await executeQuery(sql, values);
			return results;
		} catch (error) {
			throw error;
		}
	},

	selectReviewWithProduct: async (idProduct) => {
		const sql =
			'SELECT review.*, books.nameProduct, users.username, books.images, books.sortDescription FROM review JOIN books ON review.idProduct = books.idProduct JOIN users ON review.idUser = users.idUser  WHERE books.idProduct = ?';

		try {
			const results = await executeQuery(sql, [idProduct]);
			return results;
		} catch (error) {
			throw error;
		}
	},
	updateView: async (id) => {
		const sql = `UPDATE review SET view = view + 1 WHERE idReview = ?`;
		try {
			await executeQuery(sql, [+id]);
		} catch (error) {
			throw error;
		}
	},
	countTotal: async () => {
		const sql = `SELECT count(*) as count FROM review `;

		try {
			const results = await executeQuery(sql);
			return results;
		} catch (error) {
			throw error;
		}
	},
};

export default Review;
