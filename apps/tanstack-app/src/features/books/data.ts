import { faker } from "@faker-js/faker";
import type { Book } from "./types";

const BOOK_STATUSES: Book["status"][] = ["Available", "Borrowed", "Reserved", "Lost"];

const LANGUAGES = ["English", "English", "English", "English", "Vietnamese", "French", "German", "Japanese"];

function generateBook(index: number): Book {
  const section = String.fromCharCode(65 + faker.number.int({ min: 0, max: 9 }));
  const shelf = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, "0");
  const position = faker.number.int({ min: 1, max: 22 }).toString().padStart(2, "0");

  return {
    id: `BOK-${(1001 + index).toString()}`,
    title: faker.book.title(),
    author: faker.book.author(),
    isbn: faker.commerce.isbn(),
    category: faker.book.genre(),
    publisher: faker.book.publisher(),
    year: faker.number.int({ min: 1900, max: 2024 }),
    pages: faker.number.int({ min: 80, max: 1500 }),
    language: faker.helpers.arrayElement(LANGUAGES),
    status: faker.helpers.arrayElement(BOOK_STATUSES),
    location: `${section}-${shelf}-${position}`,
    addedDate: faker.date.between({ from: "2023-10-01", to: "2024-10-01" }).toISOString().split("T")[0],
    timesBorrowed: faker.number.int({ min: 0, max: 120 }),
  };
}

export const BOOKS: Book[] = Array.from({ length: 35 }, (_, i) => generateBook(i));
