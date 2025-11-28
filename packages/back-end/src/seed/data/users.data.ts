import { User } from 'src/user/entities/user.entity';
import { DeepPartial } from 'typeorm';

export const USERS_DATA: DeepPartial<User>[] = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'adminPassword',
    role: 'ADMIN',
  },
];
