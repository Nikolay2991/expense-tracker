import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import type { Transaction } from "@expense-tracker/shared";
import { TransactionsService } from "../../transactions.service";
import { CreateTransactionCommand } from "../create-transaction.command";

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(private readonly transactionsService: TransactionsService) {}

  execute(command: CreateTransactionCommand): Promise<Transaction> {
    return this.transactionsService.create(command.userId, command.dto);
  }
}
