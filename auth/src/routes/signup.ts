import express, { Response, Request } from "express";
import { body, validationResult } from "express-validator";

import { User } from "../models/user";
import { sign } from "jsonwebtoken";
import { BadRequestError, RequestValidationError, validateRequest } from "@zhengx-test/tickethub-common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must be at least 4 and at least 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    // 1.check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }
    // 2. hash the user password
    const user = User.build({
      email,
      password,
    });
    // 3. create jsonwebtoken
    const userJwt = sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY as string
    );

    req.session = { jwt: userJwt };
    // 4 save the created user
    await user.save();
    res.status(201).send(user);
  }
);

export { router as signupRouter };
