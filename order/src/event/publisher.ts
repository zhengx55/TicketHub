import {
  Publisher,
  Subjects,
  OrderCreatedEvent,
  OrderCancelledEvent,
} from "@zhengx-test/tickethub-common";

export class OrderCratedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
