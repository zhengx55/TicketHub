import express, { Response, Request } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'), body('password').trim().isLength({ min: 4, max: 20 }).withMessage('password must be at least 4 and at least 20 characters')
], async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
    }
    const { email, password } = req.body;
    // 1.check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw new BadRequestError('Email already exists');
    }
    // 2. hash the user password
    const user = User.build({
        email, password
    })
    await user.save();
    res.status(201).send(user);

})

export { router as signupRouter };