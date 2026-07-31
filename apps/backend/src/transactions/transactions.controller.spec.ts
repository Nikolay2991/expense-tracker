import { Test, type TestingModule } from "@nestjs/testing";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { TransactionType } from "@prisma/client";
import type {
  Transaction,
  TransactionsListResponse,
} from "@expense-tracker/shared";
import { TransactionsController } from "./transactions.controller";
import { CreateTransactionCommand } from "./commands/create-transaction.command";
import { DeleteTransactionCommand } from "./commands/delete-transaction.command";
import { UpdateTransactionCommand } from "./commands/update-transaction.command";
import type { CreateTransactionDto } from "./dto/create-transaction.dto";
import type { QueryTransactionsDto } from "./dto/query-transactions.dto";
import type { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { GetTransactionByIdQuery } from "./queries/get-transaction-by-id.query";
import { GetTransactionsQuery } from "./queries/get-transactions.query";
import type { JwtUser } from "../auth/decorators/current-user.decorator";

describe("TransactionsController", () => {
  let controller: TransactionsController;
  let commandBus: { execute: jest.Mock };
  let queryBus: { execute: jest.Mock };

  const user: JwtUser = { id: 1, email: "user@example.com" };

  const transaction: Transaction = {
    id: 10,
    userId: user.id,
    amount: 1500.5,
    type: TransactionType.expense,
    description: "Обед в кафе",
    date: new Date("2026-07-30T00:00:00.000Z"),
    categoryId: 1,
    paymentMethodId: 1,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };

  beforeEach(async () => {
    commandBus = { execute: jest.fn() };
    queryBus = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    controller = module.get(TransactionsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("dispatches CreateTransactionCommand with userId and dto", async () => {
      const dto: CreateTransactionDto = {
        amount: 1500.5,
        type: TransactionType.expense,
        categoryId: 1,
      };
      commandBus.execute.mockResolvedValue(transaction);

      const result = await controller.create(user, dto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateTransactionCommand(user.id, dto),
      );
      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(transaction);
    });

    it("propagates BadRequestException when category is not owned by the user", async () => {
      const dto: CreateTransactionDto = {
        amount: 1500.5,
        type: TransactionType.expense,
        categoryId: 999,
      };
      const error = new Error("Категория не принадлежит пользователю");
      commandBus.execute.mockRejectedValue(error);

      await expect(controller.create(user, dto)).rejects.toThrow(error);
    });
  });

  describe("findAll", () => {
    it("dispatches GetTransactionsQuery with userId and filter", async () => {
      const query: QueryTransactionsDto = { month: 7, year: 2026, page: 1, limit: 10 };
      const response: TransactionsListResponse = {
        transactions: [transaction],
        summary: { income: 0, expense: 1500.5, balance: -1500.5 },
        page: 1,
        limit: 10,
        total: 1,
      };
      queryBus.execute.mockResolvedValue(response);

      const result = await controller.findAll(user, query);

      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetTransactionsQuery(user.id, query),
      );
      expect(queryBus.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(response);
    });
  });

  describe("findOne", () => {
    it("dispatches GetTransactionByIdQuery with id and userId", async () => {
      queryBus.execute.mockResolvedValue(transaction);

      const result = await controller.findOne(transaction.id, user);

      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetTransactionByIdQuery(transaction.id, user.id),
      );
      expect(queryBus.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(transaction);
    });

    it("propagates NotFoundException for a transaction owned by another user", async () => {
      const error = new Error("Транзакция не найдена");
      queryBus.execute.mockRejectedValue(error);

      await expect(controller.findOne(999, user)).rejects.toThrow(error);
    });
  });

  describe("update", () => {
    it("dispatches UpdateTransactionCommand with id, userId and dto", async () => {
      const dto: UpdateTransactionDto = { amount: 2000 };
      const updated = { ...transaction, amount: 2000 };
      commandBus.execute.mockResolvedValue(updated);

      const result = await controller.update(transaction.id, user, dto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateTransactionCommand(transaction.id, user.id, dto),
      );
      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(updated);
    });

    it("propagates NotFoundException for a transaction owned by another user", async () => {
      const dto: UpdateTransactionDto = { amount: 2000 };
      const error = new Error("Транзакция не найдена");
      commandBus.execute.mockRejectedValue(error);

      await expect(controller.update(999, user, dto)).rejects.toThrow(error);
    });
  });

  describe("remove", () => {
    it("dispatches DeleteTransactionCommand with id and userId", async () => {
      commandBus.execute.mockResolvedValue(undefined);

      const result = await controller.remove(transaction.id, user);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new DeleteTransactionCommand(transaction.id, user.id),
      );
      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it("propagates errors thrown by CommandBus", async () => {
      const error = new Error("Транзакция не найдена");
      commandBus.execute.mockRejectedValue(error);

      await expect(controller.remove(999, user)).rejects.toThrow(error);
    });
  });
});