import { Test, type TestingModule } from "@nestjs/testing";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import type { PaymentMethod } from "@expense-tracker/shared";
import { PaymentMethodsController } from "./payment-methods.controller";
import { CreatePaymentMethodCommand } from "./commands/create-payment-method.command";
import { DeletePaymentMethodCommand } from "./commands/delete-payment-method.command";
import { UpdatePaymentMethodCommand } from "./commands/update-payment-method.command";
import type { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
import type { UpdatePaymentMethodDto } from "./dto/update-payment-method.dto";
import { GetPaymentMethodsQuery } from "./queries/get-payment-methods.query";
import type { JwtUser } from "../auth/decorators/current-user.decorator";

describe("PaymentMethodsController", () => {
  let controller: PaymentMethodsController;
  let commandBus: { execute: jest.Mock };
  let queryBus: { execute: jest.Mock };

  const user: JwtUser = { id: 1, email: "user@example.com" };

  const paymentMethod: PaymentMethod = {
    id: 10,
    userId: user.id,
    name: "Карта",
    color: "#0ea5e9",
    icon: "credit-card",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };

  beforeEach(async () => {
    commandBus = { execute: jest.fn() };
    queryBus = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentMethodsController],
      providers: [
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    controller = module.get(PaymentMethodsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("dispatches CreatePaymentMethodCommand with userId and dto", async () => {
      const dto: CreatePaymentMethodDto = { name: "Карта", color: "#0ea5e9" };
      commandBus.execute.mockResolvedValue(paymentMethod);

      const result = await controller.create(user, dto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreatePaymentMethodCommand(user.id, dto),
      );
      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(paymentMethod);
    });

    it("propagates ConflictException from CommandBus", async () => {
      const dto: CreatePaymentMethodDto = { name: "Карта" };
      const error = new Error("Способ оплаты с таким именем уже существует");
      commandBus.execute.mockRejectedValue(error);

      await expect(controller.create(user, dto)).rejects.toThrow(error);
    });
  });

  describe("findAll", () => {
    it("dispatches GetPaymentMethodsQuery with userId", async () => {
      queryBus.execute.mockResolvedValue([paymentMethod]);

      const result = await controller.findAll(user);

      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetPaymentMethodsQuery(user.id),
      );
      expect(queryBus.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual([paymentMethod]);
    });
  });

  describe("update", () => {
    it("dispatches UpdatePaymentMethodCommand with id, userId and dto", async () => {
      const dto: UpdatePaymentMethodDto = { name: "Наличные" };
      const updated = { ...paymentMethod, name: "Наличные" };
      commandBus.execute.mockResolvedValue(updated);

      const result = await controller.update(paymentMethod.id, user, dto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdatePaymentMethodCommand(paymentMethod.id, user.id, dto),
      );
      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(updated);
    });

    it("propagates NotFoundException for a payment method owned by another user", async () => {
      const dto: UpdatePaymentMethodDto = { name: "Наличные" };
      const error = new Error("Способ оплаты не найден");
      commandBus.execute.mockRejectedValue(error);

      await expect(controller.update(999, user, dto)).rejects.toThrow(error);
    });
  });

  describe("remove", () => {
    it("dispatches DeletePaymentMethodCommand with id and userId", async () => {
      commandBus.execute.mockResolvedValue(undefined);

      const result = await controller.remove(paymentMethod.id, user);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new DeletePaymentMethodCommand(paymentMethod.id, user.id),
      );
      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it("propagates errors thrown by CommandBus", async () => {
      const error = new Error("Способ оплаты не найден");
      commandBus.execute.mockRejectedValue(error);

      await expect(controller.remove(999, user)).rejects.toThrow(error);
    });
  });
});