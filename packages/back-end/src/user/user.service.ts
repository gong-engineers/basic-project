import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      this.logger.warn(
        `Attempt to create a user with an existing email: ${createUserDto.email}`,
      );
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
    });

    this.logger.log(`Creating a new user with email: ${createUserDto.email}`);
    return this.userRepository.save(newUser);
  }

  async findAll() {
    this.logger.log('Retrieving all users');
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    this.logger.log(`Retrieving user with ID: ${id}`);
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`Retrieving user with email: ${email}`);
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      this.logger.warn(`Attempt to update non-existing user with ID: ${id}`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);

    this.logger.log(`Updating user with ID: ${id}`);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Deleting user with ID: ${id}`);
    await this.userRepository.delete(id);
  }
}
