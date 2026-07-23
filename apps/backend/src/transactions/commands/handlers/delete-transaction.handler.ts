import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TransactionsService } from "../../transactions.service";
import { DeleteTransactionCommand } from "../delete-transaction.command";

@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionHandler
  implements ICommandHandler<DeleteTransactionCommand>
{
  constructor(private readonly transactionsService: TransactionsService) {}

  execute(command: DeleteTransactionCommand): Promise<void> {
    return this.transactionsService.remove(command.id, command.userId);
  }
}
