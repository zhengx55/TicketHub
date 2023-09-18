import { requireAuth, validateRequest } from "@zhengx-test/tickethub-common";
import { Request, Router, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = Router();
router.get("/api/order", async (req: Request, res: Response) => {});
router.get("/api/order/:ticketId", async (req: Request, res: Response) => {});
router.delete(
  "/api/order/:ticketId",
  requireAuth,
  async (req: Request, res: Response) => {}
);
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
  async (req: Request, res: Response) => {}
);

export { router as OrderRouter };
