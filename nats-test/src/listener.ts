import { randomBytes } from "crypto";
import nats, { Message } from "node-nats-streaming";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.subscriptionOptions().setManualAckMode(true);

stan.on("connect", () => {
  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });
  const options = stan.subscriptionOptions().setManualAckMode(true);

  console.log("Listener connected to NAS");
  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data === "string") {
      const seq = msg.getSequence();
    }
    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGQUIT", () => stan.close());
