import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from '../../../common/build/interface/nats-event';
import { Listener, Subjects } from "@zhengx-test/tickethub-common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = 'orders-service';
    onMessage(data: TicketCreatedEvent['data'], msg: Message){
    
    }
}