import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/tickets";
import mongoose from "mongoose";
// jest redirect
jest.mock("../../nats-wrapper");
it("can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  // Unauthenticated error status
  expect(response.statusCode).toEqual(401);
});
it("returns an error if an invalid title is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "", price: 10 })
    .expect(400);
});
it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "wow", price: -10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "wow" })
    .expect(400);
});
it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "wow", price: 2 })
    .expect(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual("wow");
});

it("if the user is signed i", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns a 404 if the ticket is not found", async () => {
  await request(app).get("/api/tickets/test-ticket").send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "Test Ticket";
  const price = 20;

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);

  expect(ticketRes.body.title).toEqual(title);
  expect(ticketRes.body.price).toEqual(price);
});

const createTicket = () => {
  return request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title: "test ticket",
    price: 10,
  });
};

it("can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get("api/tickets").send().expect(200);
  expect(res.body.length).toEqual(4);
});

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "aslkdfj",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "aslkdfj",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "asldkfj",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "alskdjflskjdf",
      price: 1000,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asldkfj",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "alskdfjj",
      price: -10,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asldkfj",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(100);
});
