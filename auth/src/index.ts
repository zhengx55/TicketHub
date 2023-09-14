import mongoose from "mongoose";

import { app } from "./app";

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
