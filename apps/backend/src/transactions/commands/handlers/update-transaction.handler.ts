import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import type { Transaction } from "@expense-tracker/shared";
import { TransactionsService } from "../../transactions.service";
import { UpdateTransactionCommand } from "../update-transaction.command";

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  constructor(private readonly transactionsService: TransactionsService) {}

  execute(command: UpdateTransactionCommand): Promise<Transaction> {
    return this.transactionsService.update(
      command.id,
      command.userId,
      command.dto,
    );
  }
}
