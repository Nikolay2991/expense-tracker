"use client";

import * as React from "react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { CreateTransactionForm } from "./CreateTransactionForm";

export function CreateTransactionDialog({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Добавить транзакцию</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Новая транзакция</DialogTitle>
          <DialogDescription>Заполните данные и сохраните транзакцию.</DialogDescription>
        </DialogHeader>
        <CreateTransactionForm
          onSuccess={() => {
            setOpen(false);
            onCreated?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
