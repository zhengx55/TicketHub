import {
  NotFoundError,
  UnauthorizedError,
  requireAuth,
  validateRequest,
} from "@zhengx-test/tickethub-common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../model/tickets";
import { TicketCreatedPubslisher, TicketUpdatedPublisher } from "../publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({
        gt: 0,
      })
      .withMessage("Price must greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const newTicket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await newTicket.save();
    new TicketCreatedPubslisher(natsWrapper.client).publish({
      id: newTicket.id,
      title: newTicket.title,
      userId: newTicket.userId,
      price: Number(newTicket.price),
    });
    res.status(201).send(newTicket);
  }
);

router.get("api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  res.status(200).send(tickets);
});

router.get("api/tickets/:id", async (req: Request, res: Response) => {
  const ticketId = req.params.id;
  const match = await Ticket.findById(ticketId);
  if (!match) {
    throw new NotFoundError();
  }
  res.status(200).send(match);
});

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      userId: ticket.userId,
      price: Number(ticket.price),
    });

    res.send(ticket);
  }
);

export { router as ticketsRouter };
