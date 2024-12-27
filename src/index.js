import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import YAML from 'yaml';
import connection from './config/connect.js';
import routes from './routers/index.js';
import swaggerUI from 'swagger-ui-express';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// static file
app.use(express.static(path.join(__dirname, 'public')));
//
// update
app.use(
	cors({
		origin: [
			'http://localhost:5173',
			'https://bookstore-frontend-wheat.vercel.app',
		], // Thay bằng URL front-end của bạn
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức được phép
		credentials: true, // Nếu bạn sử dụng cookie
	})
);
//bookstore-backend-lac.vercel.app
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('dev'));

// routes
routes(app);
//

const file = fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8');
const swaggerDocument = YAML.parse(file);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(8080, () => {
	console.log('Nodejs app is running on the port 8080');
	connection.connect((err) => {
		if (err) {
			console.log('Database disconnect', err);
		} else {
			console.log('Database connected');
		}
	});
});
