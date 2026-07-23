import { CreateTransactionHandler } from "./commands/handlers/create-transaction.handler";
import { DeleteTransactionHandler } from "./commands/handlers/delete-transaction.handler";
import { UpdateTransactionHandler } from "./commands/handlers/update-transaction.handler";
import { GetTransactionByIdHandler } from "./queries/handlers/get-transaction-by-id.handler";
import { GetTransactionsHandler } from "./queries/handlers/get-transactions.handler";

export const TransactionCommandHandlers = [
  CreateTransactionHandler,
  UpdateTransactionHandler,
  DeleteTransactionHandler,
];

export const TransactionQueryHandlers = [
  GetTransactionsHandler,
  GetTransactionByIdHandler,
];
