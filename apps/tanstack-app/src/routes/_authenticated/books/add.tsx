import { createFileRoute } from "@tanstack/react-router";
import AddBookContent from "../../../features/books/components/add-book-page";

export const Route = createFileRoute("/_authenticated/books/add")({
  component: AddBookContent,
});
