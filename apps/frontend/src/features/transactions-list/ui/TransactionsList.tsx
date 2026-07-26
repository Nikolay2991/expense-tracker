"use client";

import { TransactionItem } from "@/entities/transaction";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { useTransactions } from "../model/useTransactions";

const PAGE_SIZE = 10;

export function TransactionsList() {
  const { page, setPage, totalPages, data, isLoading, error } = useTransactions(PAGE_SIZE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние транзакции</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Загрузка…</p>
        ) : error ? (
          <p className="py-6 text-center text-sm text-destructive">{error}</p>
        ) : data && data.transactions.length > 0 ? (
          <ul className="divide-y divide-border">
            {data.transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">Транзакций пока нет</p>
        )}
      </CardContent>
      {data && data.total > 0 ? (
        <CardFooter className="justify-between">
          <span className="text-sm text-muted-foreground">
            Стр. {page} из {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
            >
              Назад
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
            >
              Вперёд
            </Button>
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}
