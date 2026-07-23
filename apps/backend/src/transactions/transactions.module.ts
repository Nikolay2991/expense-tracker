import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TransactionsController } from "./transactions.controller";
import { TransactionsRepository } from "./transactions.repository";
import { TransactionsService } from "./transactions.service";
import {
  TransactionCommandHandlers,
  TransactionQueryHandlers,
} from "./handlers";

@Module({
  imports: [CqrsModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionsRepository,
    ...TransactionCommandHandlers,
    ...TransactionQueryHandlers,
  ],
})
export class TransactionsModule {}
