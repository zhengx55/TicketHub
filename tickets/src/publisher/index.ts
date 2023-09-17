import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from "@zhengx-test/tickethub-common";

export class TicketCreatedPubslisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
