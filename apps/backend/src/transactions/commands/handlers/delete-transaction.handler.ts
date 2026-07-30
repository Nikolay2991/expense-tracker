import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TransactionsService } from "../../transactions.service";
import { DeleteTransactionCommand } from "../delete-transaction.command";

/**
 * CQRS-обёртка над удалением транзакции: делегирует в {@link TransactionsService}.
 */
@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionHandler
  implements ICommandHandler<DeleteTransactionCommand>
{
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * @param command - Команда с `id` и `userId`.
   * @returns Ничего (`void`) при успешном удалении.
   * @throws {NotFoundException} Если транзакция не найдена или принадлежит другому пользователю.
   */
  execute(command: DeleteTransactionCommand): Promise<void> {
    return this.transactionsService.remove(command.id, command.userId);
  }
}
