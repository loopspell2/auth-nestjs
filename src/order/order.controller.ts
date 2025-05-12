import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Request } from 'express';
import { CreateOrderDto } from 'src/dto/order.dto';
import { Payload } from 'src/guards/user.guard';
import { Role, RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Controller('order')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  getOrder(@Req() req: Request): any {
    const user = req['user'] as Payload;
    return this.orderService.getOrder(user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  createOrder(@Body() newOrder: CreateOrderDto, @Req() req: Request): any {
    const user = req['user'] as Payload;
    return this.orderService.createOrder(newOrder, user);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Put('/:id')
  updateOrder(@Param('id') id: string, @Body() newOrder: CreateOrderDto): any {
    return this.orderService.updateOrder(id, newOrder);
  }

  @Roles(Role.ADMIN)
  @Delete('/:id')
  deleteOrder(@Param('id') id: string): any {
    return this.orderService.deleteOrder(id);
  }
}
