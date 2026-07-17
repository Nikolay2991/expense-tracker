import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: number): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  createUser(name: string, email: string, passwordHash: string): Promise<User> {
    return this.usersRepository.create({ name, email, passwordHash });
  }
}
