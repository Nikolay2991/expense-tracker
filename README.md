# Expense Tracker

Монорепозиторий трекера расходов.

## Стек

- **Frontend:** Next.js 14 (App Router, TypeScript)
- **Backend:** Nest.js (TypeScript)
- **База данных:** PostgreSQL
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

## Запуск

```bash
# Установка зависимостей
pnpm install

# Генерация Prisma-клиента
pnpm --filter backend prisma generate

# Применение миграций
pnpm --filter backend prisma migrate dev

# Запуск в режиме разработки
pnpm dev
```

## Переменные окружения

Скопируйте `.env.example` в `.env` в корне и в `apps/backend/`:

```bash
cp .env.example apps/backend/.env
```
