import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { ChevronDown } from "lucide-react";
import { OVERDUE_ITEMS } from "./dashboard-data";

export function OverdueTable() {
  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="text-base font-semibold">Overdue Items Summary</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 rounded-full border border-border bg-muted/60 text-xs text-muted-foreground"
        >
          This week <ChevronDown size={12} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="py-2 text-left font-medium">Borrower ⇅</th>
                <th className="py-2 text-left font-medium">Book Info ⇅</th>
                <th className="py-2 text-left font-medium">Days O/D ⇅</th>
                <th className="py-2 text-left font-medium">Fine ⇅</th>
                <th className="py-2 text-left font-medium">Action ⇅</th>
              </tr>
            </thead>
            <tbody>
              {OVERDUE_ITEMS.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="grid size-10 place-items-center rounded-full text-sm font-semibold text-primary-foreground"
                        style={{ background: item.color }}
                      >
                        {item.initial}
                      </div>
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-10 rounded-md border border-border bg-gradient-to-br from-accent to-muted" />
                      <div>
                        <div className="font-semibold">{item.book}</div>
                        <div className="text-xs text-muted-foreground">{item.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-medium">{String(item.days).padStart(2, "0")} Days</td>
                  <td className="py-3 font-medium">${item.fine}</td>
                  <td className="py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-border text-xs font-semibold hover:bg-muted"
                    >
                      Notify
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
