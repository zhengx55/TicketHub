import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnauthorizedError,
  requireAuth,
  validateRequest,
} from "@zhengx-test/tickethub-common";
import { Request, Router, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../model/ticket";
import { Order } from "../model";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = Router();
/**
 
 */
router.get("/api/order", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser?.id,
  }).populate("ticket");
  if (orders.length === 0) {
    throw new NotFoundError();
  }
  res.status(200).send(orders);
});
/**
 * @ngdoc method
 */
router.get(
  "/api/order/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }
    res.status(200).send(order);
  }
);
/**
 *
 */
router.patch(
  "/api/order/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    res.status(204).send({ msg: "Delete order successfully" });
  }
);

/**
 *
 */
router.post(
  "/api/order",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // fetch the ticket from the database
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // ticket is not already reserved, forbidden to purchase at the same time

    if (await ticket.isReserved()) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // calculate an expriation date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save to db
    const order = Order.build({
      ticket: ticket,
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
    });
    await order.save();
    // publish an order-created event to nats-service

    res.status(201).send(order);
  }
);

export { router as OrderRouter };
