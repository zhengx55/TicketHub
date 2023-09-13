import express, { Response, Request } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.get('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'), body('password').trim().isLength({ min: 4, max: 20 }).withMessage('password must be at least 4 and at least 20 characters')
], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new Error('Invalid email or password')
    }
    const { email, password } = req.body;
    console.log('Creating a User...')
    res.send({ email: email, password: password })


})

export { router as signupRouter };