import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CategoriesRepository } from "./categories.repository";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: CategoriesRepository) {}

  async create(userId: number, dto: CreateCategoryDto) {
    try {
      return await this.repo.create(userId, dto);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new ConflictException(
          `Категория с именем "${dto.name}" уже существует`,
        );
      }
      throw err;
    }
  }

  findAll(userId: number) {
    return this.repo.findAllByUser(userId);
  }

  async update(id: number, userId: number, dto: UpdateCategoryDto) {
    const category = await this.repo.findByIdAndUser(id, userId);
    if (!category) throw new NotFoundException(`Категория #${id} не найдена`);

    try {
      return await this.repo.update(id, dto);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new ConflictException(
          `Категория с именем "${dto.name}" уже существует`,
        );
      }
      throw err;
    }
  }

  async remove(id: number, userId: number) {
    const category = await this.repo.findByIdAndUser(id, userId);
    if (!category) throw new NotFoundException(`Категория #${id} не найдена`);

    return this.repo.delete(id);
  }
}
