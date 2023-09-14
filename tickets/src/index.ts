import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app";

const bootstrap = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is required");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongod connection established");
  } catch (error) {}
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

bootstrap();
