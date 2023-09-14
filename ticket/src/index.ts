import express from "express";
import { json } from "body-parser";
import "express-async-errors";

import mongoose from "mongoose";
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

app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);
const bootstrap = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is required");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("mongod connection established");
  } catch (error) {}
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

bootstrap();
