// user.service.ts

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  private readonly users: User[] = [{
      id: '2',
      username: 'john_doe',
      email: 'john@example.com',
      password: 'secretpassword',
}];

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = {
      id: (this.users.length + 1).toString(),
      ...createUserDto,
    };
    this.users.push(user);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findUserById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;
    const user = await this.findUserByEmail(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
  
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return this.users[userIndex];
  }

  async deleteUser(id: string): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(userIndex, 1);
  }
}