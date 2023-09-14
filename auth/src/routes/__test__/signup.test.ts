import request from "supertest";
import app from "../../app";

it("returns a 201 status code on a successful response", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});
