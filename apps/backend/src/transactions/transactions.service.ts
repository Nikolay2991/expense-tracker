import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, Transaction, TransactionType } from "@prisma/client";
import type {
  Transaction as TransactionDto,
  TransactionsListResponse,
  TransactionsSummary,
} from "@expense-tracker/shared";
import { TransactionsRepository } from "./transactions.repository";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { QueryTransactionsDto } from "./dto/query-transactions.dto";

@Injectable()
export class TransactionsService {
  constructor(private readonly repo: TransactionsRepository) {}

  async create(
    userId: number,
    dto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    await this.assertCategoryOwned(dto.categoryId, userId);

    const transaction = await this.repo.create({
      userId,
      amount: new Prisma.Decimal(dto.amount),
      type: dto.type,
      description: dto.description,
      date: dto.date,
      categoryId: dto.categoryId,
    });

    return this.toDto(transaction);
  }

  async findAll(
    userId: number,
    query: QueryTransactionsDto,
  ): Promise<TransactionsListResponse> {
    const dateRange = this.buildDateRange(query);

    const [transactions, incomeSum, expenseSum] = await Promise.all([
      this.repo.findManyByUser(userId, dateRange),
      this.repo.sumByType(userId, TransactionType.income, dateRange),
      this.repo.sumByType(userId, TransactionType.expense, dateRange),
    ]);

    const income = incomeSum?.toNumber() ?? 0;
    const expense = expenseSum?.toNumber() ?? 0;
    const summary: TransactionsSummary = {
      income,
      expense,
      balance: income - expense,
    };

    return { transactions: transactions.map((t) => this.toDto(t)), summary };
  }

  async findOne(id: number, userId: number): Promise<TransactionDto> {
    const transaction = await this.getOwned(id, userId);
    return this.toDto(transaction);
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    await this.getOwned(id, userId);

    if (dto.categoryId !== undefined) {
      await this.assertCategoryOwned(dto.categoryId, userId);
    }

    const transaction = await this.repo.update(id, {
      ...(dto.amount !== undefined
        ? { amount: new Prisma.Decimal(dto.amount) }
        : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
      ...(dto.date !== undefined ? { date: dto.date } : {}),
      ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
    });

    return this.toDto(transaction);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.getOwned(id, userId);
    await this.repo.delete(id);
  }

  private async getOwned(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.repo.findByIdAndUser(id, userId);
    if (!transaction) {
      throw new NotFoundException(`Транзакция #${id} не найдена`);
    }
    return transaction;
  }

  private async assertCategoryOwned(
    categoryId: number,
    userId: number,
  ): Promise<void> {
    const exists = await this.repo.categoryExistsForUser(categoryId, userId);
    if (!exists) {
      throw new BadRequestException(`Категория #${categoryId} не найдена`);
    }
  }

  private buildDateRange(
    query: QueryTransactionsDto,
  ): { gte: Date; lt: Date } | undefined {
    const { month, year } = query;
    if (year === undefined && month === undefined) return undefined;

    const now = new Date();
    const targetYear = year ?? now.getUTCFullYear();

    if (month === undefined) {
      return {
        gte: new Date(Date.UTC(targetYear, 0, 1)),
        lt: new Date(Date.UTC(targetYear + 1, 0, 1)),
      };
    }

    return {
      gte: new Date(Date.UTC(targetYear, month - 1, 1)),
      lt: new Date(Date.UTC(targetYear, month, 1)),
    };
  }

  private toDto(transaction: Transaction): TransactionDto {
    return {
      ...transaction,
      amount: transaction.amount.toNumber(),
    };
  }
}
