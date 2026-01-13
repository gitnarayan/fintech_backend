import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import fileupload from 'express-fileupload';
import httpStatus from 'http-status';
import morgan from './config/morgan.js';
import routes from './routes/index.js';
import passport from 'passport'
import { jwtStrategy } from './config/passport.js';
import { errorConverter, errorHandler } from './middlewares/error.js';
import ApiError from './utils/ApiError.js';
import { fileURLToPath } from 'url';


const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(mongoSanitize());
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}
app.use(fileupload());
// Derive __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api', routes);
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
app.use(errorConverter);
app.use(errorHandler);
export default app;
