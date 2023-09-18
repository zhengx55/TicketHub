import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "../../../common/build/interface/nats-event";
import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@zhengx-test/tickethub-common";
import { Ticket } from "../model/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = "orders-service";
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = "orders-service";
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.id);
    if(!ticket){
        throw new NotFoundError();
    }
    const {title, price} = data;
    ticket.set({
        title, price
    })
    await ticket.save();
  }
}
