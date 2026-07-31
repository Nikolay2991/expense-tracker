import { Test, type TestingModule } from "@nestjs/testing";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import type { Category } from "@expense-tracker/shared";
import { CategoriesController } from "./categories.controller";
import { CreateCategoryCommand } from "./commands/create-category.command";
import { DeleteCategoryCommand } from "./commands/delete-category.command";
import { UpdateCategoryCommand } from "./commands/update-category.command";
import type { CreateCategoryDto } from "./dto/create-category.dto";
import type { UpdateCategoryDto } from "./dto/update-category.dto";
import { GetCategoriesQuery } from "./queries/get-categories.query";
import type { JwtUser } from "../auth/decorators/current-user.decorator";

describe("CategoriesController", () => {
  let controller: CategoriesController;
  let commandBus: { execute: jest.Mock };
  let queryBus: { execute: jest.Mock };

  const user: JwtUser = { id: 1, email: "user@example.com" };

  const category: Category = {
    id: 10,
    userId: user.id,
    name: "Продукты",
    color: "#ff0000",
    icon: "cart",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };

  beforeEach(async () => {
    commandBus = { execute: jest.fn() };
    queryBus = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    controller = module.get(CategoriesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("dispatches CreateCategoryCommand with userId and dto", async () => {
      const dto: CreateCategoryDto = { name: "Продукты", color: "#ff0000" };
      commandBus.execute.mockResolvedValue(category);

      const result = await controller.create(user, dto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateCategoryCommand(user.id, dto),
      );
      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(category);
    });

    it("propagates errors thrown by CommandBus", async () => {
      const dto: CreateCategoryDto = { name: "Продукты" };
      const error = new Error("Категория с таким именем уже существует");
      commandBus.execute.mockRejectedValue(error);

      await expect(controller.create(user, dto)).rejects.toThrow(error);
    });
  });

  describe("findAll", () => {
    it("dispatches GetCategoriesQuery with userId", async () => {
      queryBus.execute.mockResolvedValue([category]);

      const result = await controller.findAll(user);

      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCategoriesQuery(user.id),
      );
      expect(queryBus.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual([category]);
    });
  });

  describe("update", () => {
    it("dispatches UpdateCategoryCommand with id, userId and dto", async () => {
      const dto: UpdateCategoryDto = { name: "Транспорт" };
      const updated = { ...category, name: "Транспорт" };
      commandBus.execute.mockResolvedValue(updated);

      const result = await controller.update(category.id, user, dto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateCategoryCommand(category.id, user.id, dto),
      );
      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(updated);
    });

    it("propagates NotFoundException for a category owned by another user", async () => {
      const dto: UpdateCategoryDto = { name: "Транспорт" };
      const error = new Error("Категория не найдена");
      commandBus.execute.mockRejectedValue(error);

      await expect(controller.update(999, user, dto)).rejects.toThrow(error);
    });
  });

  describe("remove", () => {
    it("dispatches DeleteCategoryCommand with id and userId", async () => {
      commandBus.execute.mockResolvedValue(undefined);

      const result = await controller.remove(category.id, user);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new DeleteCategoryCommand(category.id, user.id),
      );
      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it("propagates errors thrown by CommandBus", async () => {
      const error = new Error("Категория не найдена");
      commandBus.execute.mockRejectedValue(error);

      await expect(controller.remove(999, user)).rejects.toThrow(error);
    });
  });
});