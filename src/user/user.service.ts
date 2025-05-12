import {
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from 'src/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private User: Model<User>,
    private jwtService: JwtService,
  ) {}

  async SignUp(user: CreateUserDto, res: Response): Promise<any> {
    console.log('new user : ', user);
    if (!user?.username || !user?.password) {
      throw new HttpException('Username and password are required', 400);
    }

    const existingUser = await this.User.findOne({ username: user.username });
    // console.log('existing user : ', existingUser);

    if (existingUser) {
      throw new HttpException('Username already exist', 404);
    }

    let access: string[] = [];

    if (user.role === 'Admin') {
      access = ['Read', 'Write', 'Execute'];
    }

    const saltOrRounds = 10;
    const password = 'random_password';
    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    const newUser = new this.User({
      username: user.username,
      password: hashPassword,
      role: user?.role || 'User',
      extraPermissions: user?.extraPermissions || null,
      denyPermissions: user?.denyPermissions || null,
      access,
    });
    // console.log('new user : ', newUser);
    try {
      await newUser.save();

      const payload = {
        sub: newUser._id,
        username: newUser.username,
        role: newUser.role,
        extraPermissions: newUser.extraPermissions,
        denyPermissions: newUser.denyPermissions,
      };

      const access_token = await this.jwtService.signAsync(payload);

      return res.json({ message: 'user created successfully', access_token });
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000 && error.keyPattern?.username) {
        throw new ConflictException(
          `Username '${user.username}' is already taken`,
        );
      }
      throw new HttpException('User creation failed', 500);
    }
  }

  async SignIn(user: CreateUserDto, res: Response) {
    if (!user.username || !user.password) {
      throw new HttpException('fields are missing', 400);
    }

    const existingUser = await this.User.findOne({ username: user.username });

    if (!existingUser) {
      throw new HttpException('User not found', 404);
    }

    const isMatch = await bcrypt.compare(user.password, existingUser.password);

    if (isMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: existingUser._id,
      username: existingUser.username,
      role: existingUser.role,
      extraPermissions: existingUser.extraPermissions,
      denyPermissions: existingUser.denyPermissions,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return res.json({ message: 'user login successfully', access_token });
  }

  async AccessProvider(id: string, access: string[], res: Response) {
    if (!id || !access) {
      throw new HttpException('User id and access required', 400);
    }

    const properCase = access.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1),
    );

    // console.log(properCase); // ['Read', 'Write']

    properCase.forEach((p) => {
      if (!['Read', 'Write', 'Execute'].includes(p)) {
        throw new HttpException('Unknown access is found', 400);
      }
    });

    const existingUser = await this.User.findByIdAndUpdate(id, {
      access: properCase,
    });
    // console.log('existing user : ', existingUser);

    if (!existingUser) {
      throw new HttpException('User not found', 404);
    }

    return res.json({ message: 'Access modified successfully' });
  }
}
