import { User } from 'src/user/entities/user.entity';
import { DeepPartial } from 'typeorm';

export const USERS_DATA: DeepPartial<User>[] = [
  {
    id: 1,
    email: 'test.user.1@example.com',
    password: 'password123',
  },
  {
    id: 2,
    email: 'test.user.2@example.com',
    password: 'password456',
  },
  {
    id: 3,
    email: 'admin@example.com',
    password: 'adminPassword',
    role: 'ADMIN',
  },
];
