# Expense Tracker

Монорепозиторий трекера расходов.

## Стек

- **Frontend:** Next.js 16 (App Router, TypeScript) — `http://localhost:3000`
- **Backend:** Nest.js (TypeScript) — `http://localhost:3001`
- **База данных:** PostgreSQL 16
- **ORM:** Prisma
- **Пакетный менеджер:** pnpm workspaces

## Структура

```
apps/
  frontend/   — Next.js приложение
  backend/    — Nest.js API
packages/
  shared/     — Общие типы и DTO
```

## Быстрый старт

### 1. Зависимости

```bash
pnpm install
```

### 2. Переменные окружения

```bash
cp apps/backend/.env.example apps/backend/.env
```

При необходимости отредактируйте `apps/backend/.env` — по умолчанию настроено под локальный Docker.

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
pnpm --filter backend prisma migrate dev --name init
```

Эта команда одновременно применяет миграции и генерирует клиент. При последующих изменениях схемы:

```bash
pnpm --filter backend prisma migrate dev --name <название_изменения>
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

## Полезные команды

| Команда | Описание |
|---|---|
| `pnpm dev` | Запуск всех приложений в watch-режиме |
| `pnpm build` | Сборка всех приложений |
| `pnpm lint` | Проверка линтером |
| `pnpm lint:fix` | Автоисправление ошибок линтера |
| `pnpm format` | Форматирование кода через Prettier |
| `pnpm typecheck` | Проверка типов TypeScript |
| `docker compose up -d` | Запуск PostgreSQL |
| `docker compose down` | Остановка PostgreSQL |
| `docker compose down -v` | Остановка PostgreSQL и удаление данных |
