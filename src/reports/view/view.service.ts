import { Injectable } from '@nestjs/common';

@Injectable()
export class ViewService {
  getReport(): string {
    return 'you can see the report!';
  }
}
