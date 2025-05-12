import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  viewUsers(): string {
    return 'you can view users';
  }
}
