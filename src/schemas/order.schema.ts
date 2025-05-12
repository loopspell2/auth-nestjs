import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Order {
  @Prop()
  item: string;

  @Prop()
  price: number;

  @Prop()
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
