import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "@prisma/client";
import { UsersService } from "../../users.service";
import { CreateUserCommand } from "../create-user.command";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly usersService: UsersService) {}

  execute(command: CreateUserCommand): Promise<User> {
    return this.usersService.createUser(
      command.name,
      command.email,
      command.passwordHash,
    );
  }
}
