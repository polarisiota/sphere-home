import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  async retrieve(id: number): Promise<User> {
    throw 'not implemented';
  }

  async retrieveByEmail(email: string): Promise<User> {
    throw 'not implemented';
  }
}
