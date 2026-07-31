# Expense Tracker

Веб-приложение для учёта личных доходов и расходов: транзакции с категориями, фильтрация по периоду, сводка по балансу. Монорепозиторий на pnpm workspaces без Turborepo.

## Стек

- **Frontend:** Next.js 16 (App Router, React 19, TypeScript), Feature-Sliced Design, Tailwind CSS v4 + shadcn/ui (Radix), React Hook Form + Zod — `http://localhost:3000`
- **Backend:** Nest.js 11, REST API с префиксом `/api`, архитектура CQRS (`@nestjs/cqrs`) — `http://localhost:3001`
- **База данных:** PostgreSQL 16 (в dev — через Docker)
- **ORM:** Prisma 5
- **Аутентификация:** JWT (Passport), пароли — bcrypt
- **API-документация:** Swagger/OpenAPI — `http://localhost:3001/api/docs` (только вне production)
- **Пакетный менеджер:** pnpm workspaces

## Требования

- Node.js 20 (см. `.nvmrc`)
- pnpm 9+
- Docker (для локального PostgreSQL) — либо своя БД PostgreSQL 16

## Структура проекта

```
apps/
  frontend/          — Next.js приложение (FSD)
    src/app/          — роутинг Next.js: страницы, layout, providers (без бизнес-логики)
    src/widgets/       — составные блоки из нескольких фич/сущностей (main-nav, user-profile)
    src/features/      — пользовательские сценарии (auth, create-transaction, transactions-list)
    src/entities/      — бизнес-сущности (user, category, transaction)
    src/shared/        — переиспользуемый код: ui (shadcn/ui), lib, api-клиент, config
  backend/            — Nest.js API (CQRS)
    src/auth/          — регистрация/логин, JWT, guard'ы
    src/categories/    — CRUD категорий
    src/payment-methods/ — CRUD способов оплаты
    src/transactions/  — CRUD + фильтрация/пагинация транзакций, сводка сумм
    src/users/         — доступ к пользователям (используется auth-модулем)
    src/prisma/        — глобальный PrismaService
packages/
  shared/             — общие TypeScript-типы для фронта и бэка (Category, PaymentMethod, Transaction, Auth)
```

Git-соглашения (GitHub Flow, именование веток, Conventional Commits) — в скилле `.claude/skills/commit/SKILL.md`.

Каждая фича на бэкенде построена по единому потоку: `Controller → CommandBus/QueryBus → Handler → Service → Repository → PrismaService`. Модуль `transactions` — самый полный, ориентир для добавления новых фич (детали — в `apps/backend/CLAUDE.md`).

## Быстрый старт

### 1. Зависимости

```bash
pnpm install
```

### 2. Переменные окружения

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

При необходимости отредактируйте — по умолчанию всё настроено под локальный Docker.

**`apps/backend/.env`:**

| Переменная | Назначение | По умолчанию |
|---|---|---|
| `DATABASE_URL` | Строка подключения PostgreSQL | — (обязательна) |
| `JWT_SECRET` | Секрет для подписи JWT | — (обязательна, без неё backend не стартует) |
| `JWT_EXPIRES_IN` | TTL access-токена | `7d` |
| `FRONTEND_URL` | Origin для CORS | `http://localhost:3000` |
| `PORT` | Порт backend | `3001` |
| `NODE_ENV` | При `production` отключает Swagger (`/api/docs`) | — |

**`apps/frontend/.env`:**

| Переменная | Назначение | По умолчанию |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Базовый URL backend API | `http://localhost:3001/api` |

### 3. База данных

Запустите PostgreSQL через Docker:

```bash
docker compose up -d
```

Проверить статус:

```bash
docker compose ps
```

### 4. Миграции и генерация Prisma-клиента

```bash
pnpm --filter backend exec prisma migrate dev --name init
```

Эта команда одновременно применяет миграции и генерирует клиент. При последующих изменениях схемы:

```bash
pnpm --filter backend exec prisma migrate dev --name <название_изменения>
```

Открыть Prisma Studio (GUI для просмотра БД):

```bash
pnpm --filter backend prisma:studio
```

### 5. Запуск в режиме разработки

```bash
pnpm dev
```

Фронтенд и бэкенд запускаются параллельно.

### 6. API-документация

После запуска backend в dev-режиме Swagger-документация доступна на `http://localhost:3001/api/docs`. В production (`NODE_ENV=production`) роут отключён.

## Основные эндпоинты

Все эндпоинты, кроме `health`/`auth`, требуют `Authorization: Bearer <accessToken>` и работают только с ресурсами текущего пользователя.

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/api/health` | Проверка живости backend |
| `POST` | `/api/auth/register` | Регистрация пользователя |
| `POST` | `/api/auth/login` | Логин, выдаёт JWT |
| `GET` | `/api/categories` | Список категорий пользователя |
| `POST` | `/api/categories` | Создать категорию |
| `PATCH` | `/api/categories/:id` | Обновить категорию |
| `DELETE` | `/api/categories/:id` | Удалить категорию |
| `GET` | `/api/payment-methods` | Список способов оплаты пользователя |
| `POST` | `/api/payment-methods` | Создать способ оплаты |
| `PATCH` | `/api/payment-methods/:id` | Обновить способ оплаты |
| `DELETE` | `/api/payment-methods/:id` | Удалить способ оплаты |
| `GET` | `/api/transactions` | Список транзакций (фильтры `month`, `year`, пагинация `page`/`limit`) + сводка доход/расход/баланс |
| `POST` | `/api/transactions` | Создать транзакцию |
| `GET` | `/api/transactions/:id` | Получить транзакцию по id |
| `PATCH` | `/api/transactions/:id` | Частично обновить транзакцию |
| `DELETE` | `/api/transactions/:id` | Удалить транзакцию |

Полная актуальная схема запросов/ответов — в Swagger (`/api/docs`).

## Полезные команды

| Команда | Описание |
|---|---|
| `pnpm dev` | Запуск всех приложений в watch-режиме |
| `pnpm build` | Сборка всех приложений (сначала `shared`, потом apps) |
| `pnpm lint` | Проверка линтером |
| `pnpm lint:fix` | Автоисправление ошибок линтера |
| `pnpm format` | Форматирование кода через Prettier |
| `pnpm format:check` | Проверка форматирования без изменений |
| `pnpm typecheck` | Проверка типов TypeScript |
| `docker compose up -d` | Запуск PostgreSQL |
| `docker compose down` | Остановка PostgreSQL |
| `docker compose down -v` | Остановка PostgreSQL и удаление данных |

Команды отдельных пакетов (`pnpm --filter backend ...`, `pnpm --filter frontend ...`) — в `apps/backend/CLAUDE.md` и `apps/frontend/CLAUDE.md`.

## Статус проекта

CI и автотесты пока не настроены — проверка перед коммитом ограничена `lint`/`typecheck`/`build`.
