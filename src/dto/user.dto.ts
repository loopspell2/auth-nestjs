import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsIn(['Admin', 'User'])
  role?: string;

  @IsOptional()
  @IsArray()
  @IsIn(['Read', 'Write', 'Execute'], { each: true })
  access?: string[];

  @IsOptional()
  @IsArray()
  extraPermissions?: string[];

  @IsOptional()
  @IsArray()
  denyPermissions?: string[];
}
