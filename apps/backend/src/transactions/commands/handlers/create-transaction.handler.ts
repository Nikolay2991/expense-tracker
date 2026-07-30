import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import type { Transaction } from "@expense-tracker/shared";
import { TransactionsService } from "../../transactions.service";
import { CreateTransactionCommand } from "../create-transaction.command";

/**
 * CQRS-обёртка над созданием транзакции: делегирует в {@link TransactionsService}.
 */
@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * @param command - Команда с `userId` и данными новой транзакции.
   * @returns Созданная транзакция в формате shared-DTO.
   * @throws {BadRequestException} Если категория не принадлежит пользователю.
   */
  execute(command: CreateTransactionCommand): Promise<Transaction> {
    return this.transactionsService.create(command.userId, command.dto);
  }
}
