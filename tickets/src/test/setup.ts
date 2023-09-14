import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import { sign } from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // Faking authentication
  // Build a JWT payload with mock data
  // Build session Object
  // Turn that session into JSON
  // Take JSON and encode it as base64
  // return a string thats the cookie with the encoded data
  const payload = {
    id: "jest-test-user01",
    emial: "test-01@test.com",
  };
  const token = sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const session_json = JSON.stringify(session);
  const base64 = Buffer.from(session_json).toString("base64");
  return [`session=${base64}`];
};
