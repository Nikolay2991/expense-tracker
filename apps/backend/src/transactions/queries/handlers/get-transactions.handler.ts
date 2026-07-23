import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { TransactionsListResponse } from "@expense-tracker/shared";
import { TransactionsService } from "../../transactions.service";
import { GetTransactionsQuery } from "../get-transactions.query";

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsHandler
  implements IQueryHandler<GetTransactionsQuery>
{
  constructor(private readonly transactionsService: TransactionsService) {}

  execute(query: GetTransactionsQuery): Promise<TransactionsListResponse> {
    return this.transactionsService.findAll(query.userId, query.filter);
  }
}
