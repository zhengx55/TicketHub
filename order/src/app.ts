import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import "dotenv/config";
import cookieSession from "cookie-session";
import {
  NotFoundError,
  currentUser,
  errorHandler,
} from "@zhengx-test/tickethub-common";


const app = express();
app.use(json());
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
