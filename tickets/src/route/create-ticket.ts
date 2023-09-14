import express from "express";

const router = express.Router();

router.post("/api/tickets/create", (req, res) => {
  req.session = null;
});

export { router as createTicketRouter };
