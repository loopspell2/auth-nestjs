import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { CreateOrderDto } from 'src/dto/order.dto';
import { Order } from 'src/schemas/order.schema';
import { Payload } from 'src/guards/user.guard';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private Order: Model<Order>) {}

  async getOrder(user: Payload): Promise<any> {
    const order = await this.Order.find({ userId: user.sub });
    return {
      status: true,
      order,
    };
  }

  async createOrder(order: CreateOrderDto, user: Payload): Promise<any> {
    const userId = String(user.sub);
    const newOrder = new this.Order({
      item: order.item,
      price: order.price,
      category: order.category,
      userId,
    });

    await newOrder.save();

    return {
      message: 'Order created successfully',
      order: newOrder,
    };
  }

  async updateOrder(id: string, newOrder: CreateOrderDto): Promise<any> {
    const order = await this.Order.findByIdAndUpdate(id, {
      item: newOrder.item,
      price: newOrder.price,
      category: newOrder.category,
    });

    if (!order) {
      throw new HttpException('order updated failed', 404);
    }

    return {
      message: 'Order updated successfully',
      order: newOrder,
    };
  }

  async deleteOrder(id: string): Promise<any> {
    const order = await this.Order.findByIdAndDelete(id);

    if (!order) {
      throw new HttpException('order not found', 404);
    }

    return {
      message: 'Order deleted successfully',
    };
  }
}
