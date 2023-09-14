import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import "dotenv/config";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler } from "@zhengx-test/tickethub-common";
import { createTicketRouter } from "./route/create-ticket";

const app = express();
app.use(json());
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(createTicketRouter);
app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
