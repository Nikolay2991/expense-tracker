import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import type { Transaction } from "@expense-tracker/shared";
import { TransactionsService } from "../../transactions.service";
import { UpdateTransactionCommand } from "../update-transaction.command";

/**
 * CQRS-обёртка над обновлением транзакции: делегирует в {@link TransactionsService}.
 */
@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * @param command - Команда с `id`, `userId` и изменяемыми полями.
   * @returns Обновлённая транзакция в формате shared-DTO.
   * @throws {NotFoundException} Если транзакция не найдена или принадлежит другому пользователю.
   * @throws {BadRequestException} Если задан `categoryId`, не принадлежащий пользователю.
   */
  execute(command: UpdateTransactionCommand): Promise<Transaction> {
    return this.transactionsService.update(
      command.id,
      command.userId,
      command.dto,
    );
  }
}
