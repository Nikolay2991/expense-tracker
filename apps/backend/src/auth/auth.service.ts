import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { AuthResponse, UserPublic } from "@expense-tracker/shared";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { CreateUserCommand } from "../users/commands/create-user.command";
import { GetUserByEmailQuery } from "../users/queries/get-user-by-email.query";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.queryBus.execute<GetUserByEmailQuery, User | null>(
      new GetUserByEmailQuery(dto.email),
    );
    if (existing) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.commandBus.execute<CreateUserCommand, User>(
      new CreateUserCommand(dto.name, dto.email, passwordHash),
    );

    return {
      user: this.toPublic(user),
      accessToken: this.sign(user.id, user.email),
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.queryBus.execute<GetUserByEmailQuery, User | null>(
      new GetUserByEmailQuery(dto.email),
    );
    if (!user) {
      throw new UnauthorizedException("Неверный email или пароль");
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("Неверный email или пароль");
    }

    return {
      user: this.toPublic(user),
      accessToken: this.sign(user.id, user.email),
    };
  }

  private sign(userId: number, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }

  private toPublic(user: User): UserPublic {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
