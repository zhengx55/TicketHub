import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from "@zhengx-test/tickethub-common";
import { Message } from "node-nats-streaming";
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    msg.ack();
  }
  queueGroupName: string = "payments-service";
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
