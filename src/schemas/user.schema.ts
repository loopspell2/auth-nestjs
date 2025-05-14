import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum AccessType {
  Read = 'Read',
  Write = 'Write',
  Execute = 'Execute',
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['Admin', 'User'] })
  role?: string;

  @Prop({
    type: [String],
    enum: AccessType,
    default: [],
  })
  access?: AccessType[];

  @Prop()
  extraPermissions?: string[];

  @Prop()
  denyPermissions?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
