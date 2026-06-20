export interface RevenueDataPoint {
  label: string;
  value: number;
}

export interface OverdueItem {
  id: string;
  name: string;
  book: string;
  author: string;
  days: number;
  fine: number;
  color: string;
  initial: string;
}

export const REVENUE_DATA: RevenueDataPoint[] = [
  { label: "Membership", value: 8800 },
  { label: "Overdue", value: 7200 },
  { label: "Events", value: 4910 },
  { label: "Others", value: 3400 },
];

export const OVERDUE_ITEMS: OverdueItem[] = [
  {
    id: "USR-2007",
    name: "John Smith",
    book: "Don Quixote",
    author: "Miguel de Cervantes",
    days: 5,
    fine: 4.5,
    color: "var(--chart-1)",
    initial: "J",
  },
  {
    id: "USR-2025",
    name: "Emma",
    book: "Pride and Prejudice",
    author: "Jane Austen",
    days: 4,
    fine: 3.5,
    color: "var(--chart-5)",
    initial: "E",
  },
];
