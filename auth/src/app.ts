import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import "dotenv/config";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler } from "@zhengx-test/tickethub-common";

const app = express();
app.use(json());
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signOutRouter);
app.use(signupRouter);
app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export default app;
