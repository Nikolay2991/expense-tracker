import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { Transaction } from "@expense-tracker/shared";
import { TransactionsService } from "../../transactions.service";
import { GetTransactionByIdQuery } from "../get-transaction-by-id.query";

@QueryHandler(GetTransactionByIdQuery)
export class GetTransactionByIdHandler
  implements IQueryHandler<GetTransactionByIdQuery>
{
  constructor(private readonly transactionsService: TransactionsService) {}

  execute(query: GetTransactionByIdQuery): Promise<Transaction> {
    return this.transactionsService.findOne(query.id, query.userId);
  }
}
