import { OrderStatus } from "@zhengx-test/tickethub-common";
import { Document, Model, Schema, model } from "mongoose";
import { TicketDoc } from "./ticket";

interface OrderAttrs {
  status: string;
  expiresAt: Date;
  userId: string;
  ticket: TicketDoc;
}

interface OrderDoc extends Document {
  status: string;
  expiresAt: Date;
  userId: string;
  ticket: TicketDoc;
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      tyoe: Schema.Types.Date,
      require: true,
    },
    userId: {
      type: String,
      required: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = model<OrderDoc, OrderModel>("Order", OrderSchema);

export { Order };
