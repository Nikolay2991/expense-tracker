import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";

const items = [
  {
    href: "/transactions",
    title: "Транзакции",
    description: "История доходов и расходов",
  },
  {
    href: "/categories",
    title: "Категории",
    description: "Управление категориями",
  },
] as const;

export function MainNav() {
  return (
    <nav className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="group">
          <Card className="gap-2 py-5 transition-colors group-hover:bg-accent">
            <CardTitle className="px-6">{item.title}</CardTitle>
            <CardDescription className="px-6">{item.description}</CardDescription>
          </Card>
        </Link>
      ))}
    </nav>
  );
}
