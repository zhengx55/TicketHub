import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const bootstrap = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is required");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }
  if (!process.env.NATS_CLUSTER) {
    throw new Error("JWT_KEY is required");
  }
  if (!process.env.NATS_URL) {
    throw new Error("MONGO_URI is required");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("MONGO_URI is required");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongod connection established");
  } catch (error) {}
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

bootstrap();
