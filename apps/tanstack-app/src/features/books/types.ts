export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  year: number;
  pages: number;
  language: string;
  status: "Available" | "Borrowed" | "Reserved" | "Lost";
  location: string;
  addedDate: string;
  timesBorrowed: number;
}
