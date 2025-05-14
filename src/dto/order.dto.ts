import { IsString, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  item: string;

  @IsNumber()
  price: number;

  @IsString()
  category: string;
}
