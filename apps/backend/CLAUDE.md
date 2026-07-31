# Backend (Nest.js)

Nest.js 11, REST API с префиксом `/api`, порт 3001. Часть монорепо — общие правила см. в корневом `CLAUDE.md`.

Стек: **CQRS** (`@nestjs/cqrs`), **Prisma** + PostgreSQL, **JWT-аутентификация** (Passport), валидация через `class-validator`/`class-transformer`. Все бизнес-данные (`Category`, `Transaction`) изолированы по пользователю — `userId` обязателен везде.

## Команды

```bash
# Dev-режим (watch)
pnpm --filter backend dev

# Prisma-миграции и studio
pnpm --filter backend exec prisma migrate dev --name <name>
pnpm --filter backend prisma:studio

# Prisma Client после правки schema.prisma
pnpm --filter backend prisma:generate

# База данных (Docker), запускается из корня репозитория
docker compose up -d
docker compose down
```

## Архитектура фичи (CQRS)

Каждая доменная фича (`categories`, `payment-methods`, `transactions`, `users`) — это папка `src/<feature>/` со слоями. Поток запроса:

```
Controller → CommandBus/QueryBus → Command/Query Handler → Service → Repository → PrismaService
```

- **`<feature>.controller.ts`** — только HTTP: навешивает `@UseGuards(JwtAuthGuard)`, достаёт пользователя через `@CurrentUser()`, парсит `@Param`/`@Query`/`@Body`, диспетчит `commandBus.execute(new XCommand(...))` / `queryBus.execute(new XQuery(...))`. Никакой логики.
- **`commands/*.command.ts`, `queries/*.query.ts`** — плоские DTO-классы: `constructor(public readonly ...)`. Команды — на запись, запросы — на чтение.
- **`commands/handlers/*.handler.ts`, `queries/handlers/*.handler.ts`** — тонкие обёртки с `@CommandHandler`/`@QueryHandler`, делегируют в сервис (одна строка). Логику в хендлеры не кладём.
- **`handlers.ts`** — экспортирует массивы `XCommandHandlers` / `XQueryHandlers`, которые спредятся в `providers` модуля.
- **`<feature>.service.ts`** — вся бизнес-логика: проверки владения, правила, маппинг Prisma-модели → shared-DTO, выброс исключений.
- **`<feature>.repository.ts`** — **единственный слой, который трогает `PrismaService`**. Возвращает Prisma-типы; для `include` использует `Prisma.validator<...>()` + `Prisma.<Model>GetPayload<...>`.
- **`dto/*.dto.ts`** — входные DTO с декораторами `class-validator` и Swagger-декораторами (`@ApiProperty`/`@ApiPropertyOptional`). Update-DTO наследует Create через `PartialType` (`@nestjs/swagger` — в отличие от `@nestjs/mapped-types` протягивает `@ApiProperty`-метаданные в схему).
- **`<feature>.module.ts`** — `imports: [CqrsModule]`, регистрирует controller, service, repository и спред хендлеров.

Ориентир для копирования — модуль `transactions` (самый полный: пагинация, фильтр по датам, агрегаты-суммы).

## Добавление новой фичи

1. Модель в `prisma/schema.prisma` (с `userId` + связью на `User`, `createdAt`/`updatedAt`), затем `pnpm --filter backend exec prisma migrate dev --name <name>`.
2. Создать `src/<feature>/` по структуре выше: command/query-классы, их handlers, `handlers.ts`, service, repository, DTO, module.
3. Подключить `<Feature>Module` в `AppModule` (`src/app.module.ts`).
4. Общие типы ответа (то, что уходит на фронт) — в `packages/shared`, импорт из `@expense-tracker/shared`. Prisma-модели наружу не отдаём.

`PrismaModule` объявлен `@Global()` — `PrismaService` доступен без повторного импорта.

## Аутентификация и изоляция по пользователю

- Защищённые контроллеры: `@UseGuards(JwtAuthGuard)` на классе; `@CurrentUser() user: JwtUser` даёт `{ id, email }` (из JWT-payload `{ sub, email }`).
- **Владение проверяется в сервисе, а не в guard.** Любая выборка/мутация фильтруется по `userId` (`findByIdAndUser`, `categoryExistsForUser` и т.п.); чужой ресурс → `NotFoundException`/`BadRequestException`. Никогда не доверяем `id` из запроса без проверки владельца.
- Пароли — `bcrypt` (salt rounds 10). Наружу отдаём `UserPublic`, `passwordHash` не экспонируем.
- `JWT_SECRET` читается через `config.getOrThrow` — без него приложение не стартует.

## Ключевые соглашения

- **Деньги.** В БД `Decimal(12,2)`. В репозитории/сервисе — `Prisma.Decimal` (на запись `new Prisma.Decimal(dto.amount)`). Наружу конвертируем в `number` (`amount.toNumber()`) в маппере сервиса. `Decimal` из API не отдаём.
- **Исключения** — стандартные Nest (`NotFoundException`, `BadRequestException`, `ConflictException`, `UnauthorizedException`) с сообщениями **на русском**.
- **Валидация DTO** — только декораторами `class-validator`; для приведения типов query/date — `@Type(() => Number|Date)` из `class-transformer`. Глобальный `ValidationPipe` включён с `whitelist`, `forbidNonWhitelisted`, `transform` — лишние поля отсекаются, неизвестные → ошибка.
- **Частичные апдейты** — в сервисе собираем `data` условно (`...(dto.x !== undefined ? { x } : {})`), чтобы не затирать поля.

## Глобальная конфигурация (`main.ts` / `app.module.ts`)

- Префикс `/api`, CORS ограничен `FRONTEND_URL` (по умолчанию `http://localhost:3000`).
- Глобальный `ThrottlerGuard`: 100 запросов/мин с IP (`ThrottlerModule.forRoot`).
- `ConfigModule.forRoot({ isGlobal: true })` — доступ к env через `ConfigService` везде.
- Swagger-документация на `/api/docs` включена только вне production (`NODE_ENV !== "production"`) — публично отдавать полную схему API в проде не нужно.

## Модели БД

- `User` — `email @unique`, `name`, `passwordHash`.
- `Category` — `@@unique([userId, name])`, опциональные `color`/`icon`, связь на `User`.
- `PaymentMethod` — структурно как `Category` (`@@unique([userId, name])`, `color?`/`icon?`, связь на `User`), но семантически отдельная сущность (способ оплаты, не категория расхода).
- `Transaction` — `amount Decimal(12,2)`, `type TransactionType` (enum `income`/`expense`), `description?`, `date`, обязательные связи на `Category` и `User`, необязательная (`Int?`) связь на `PaymentMethod` (`onDelete: SetNull`).

## Окружение

`.env` (шаблон `.env.example`):

- `DATABASE_URL` — строка подключения PostgreSQL.
- `JWT_SECRET` — обязателен, иначе старт падает.
- `JWT_EXPIRES_IN` — TTL токена (по умолчанию `7d`).
- `FRONTEND_URL` — origin для CORS (по умолчанию `http://localhost:3000`).
- `PORT` — порт backend (по умолчанию `3001`).
- `NODE_ENV` — при `production` отключает Swagger-документацию на `/api/docs`.

## Общие типы

Импортировать из `@expense-tracker/shared` (`packages/shared/src/types/`), новые копии этих типов на бэке не заводить.
