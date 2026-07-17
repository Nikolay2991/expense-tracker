import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserCommandHandlers, UserQueryHandlers } from "./handlers";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

@Module({
  imports: [CqrsModule],
  providers: [
    UsersService,
    UsersRepository,
    ...UserCommandHandlers,
    ...UserQueryHandlers,
  ],
})
export class UsersModule {}
