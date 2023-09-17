import nats from "node-nats-streaming";

// kubectl port-forward nats-depl-/%%/  4222:4222

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost::4222",
});

const option = stan.subscriptionOptions();
 
stan.on("connect", () => {
  console.log("Publisher connected to NATS");
});
