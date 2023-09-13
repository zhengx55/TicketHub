import express from 'express'
import { json } from 'body-parser'
import 'express-async-errors';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import mongoose from 'mongoose';


const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signOutRouter);
app.use(signupRouter);
app.all('*', async () => {
    throw new NotFoundError()
})
app.use(errorHandler);
const bootstrap = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
        console.log('mongod connection established');
    } catch (error) {

    }
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })
}

bootstrap();
