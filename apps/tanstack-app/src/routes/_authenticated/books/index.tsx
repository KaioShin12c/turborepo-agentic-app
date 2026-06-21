import { createFileRoute } from "@tanstack/react-router";
import BooksContent from "../../../features/books/components/books-page";

export const Route = createFileRoute("/_authenticated/books/")({
  component: BooksContent,
});
