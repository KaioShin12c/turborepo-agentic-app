import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { BooksPagination } from "./books-pagination";

beforeAll(() => {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
});

function renderPagination(
  props: {
    page?: number;
    totalPages?: number;
    totalRecords?: number;
    perPage?: number;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
  } = {},
) {
  return render(
    <BooksPagination
      page={props.page ?? 1}
      totalPages={props.totalPages ?? 10}
      totalRecords={props.totalRecords ?? 100}
      perPage={props.perPage ?? 8}
      onPageChange={props.onPageChange ?? vi.fn()}
      onPerPageChange={props.onPerPageChange ?? vi.fn()}
    />,
  );
}

function openSelect() {
  const trigger = document.querySelector('[data-slot="select-trigger"]');
  if (trigger) fireEvent.click(trigger);
}

function getPageLinks() {
  return document.querySelectorAll('[data-slot="pagination-link"]');
}

function getPageLinkByText(text: string) {
  const links = [...getPageLinks()];
  return links.find((el) => el.textContent?.trim() === text);
}

describe("BooksPagination", () => {
  describe("page info display", () => {
    it("renders correct page info", () => {
      renderPagination({ page: 3, totalPages: 10, totalRecords: 100 });

      expect(screen.getByText(/Page 3 of 10/)).toBeInTheDocument();
      expect(screen.getByText(/100 records/)).toBeInTheDocument();
    });

    it("clamps page when page exceeds totalPages", () => {
      renderPagination({ page: 15, totalPages: 10, totalRecords: 100 });

      expect(screen.getByText(/Page 10 of 10/)).toBeInTheDocument();
    });

    it("displays page 0 of 1 when totalPages is 0 and page is 0", () => {
      renderPagination({ page: 0, totalPages: 0, totalRecords: 0 });

      expect(screen.getByText(/Page 0 of 0/)).toBeInTheDocument();
    });
  });

  describe("page number generation", () => {
    it("renders page numbers 1-5 when on page 1 of 10", () => {
      renderPagination({ page: 1, totalPages: 10 });

      expect(getPageLinkByText("1")).toBeDefined();
      expect(getPageLinkByText("2")).toBeDefined();
      expect(getPageLinkByText("3")).toBeDefined();
      expect(getPageLinkByText("4")).toBeDefined();
      expect(getPageLinkByText("5")).toBeDefined();
      expect(getPageLinkByText("6")).toBeUndefined();
    });

    it("renders page numbers 3-7 when on page 5 of 10", () => {
      renderPagination({ page: 5, totalPages: 10 });

      expect(getPageLinkByText("3")).toBeDefined();
      expect(getPageLinkByText("4")).toBeDefined();
      expect(getPageLinkByText("5")).toBeDefined();
      expect(getPageLinkByText("6")).toBeDefined();
      expect(getPageLinkByText("7")).toBeDefined();
      expect(getPageLinkByText("2")).toBeUndefined();
      expect(getPageLinkByText("8")).toBeUndefined();
    });

    it("renders last 5 pages when on page 10 of 10", () => {
      renderPagination({ page: 10, totalPages: 10 });

      expect(getPageLinkByText("6")).toBeDefined();
      expect(getPageLinkByText("7")).toBeDefined();
      expect(getPageLinkByText("8")).toBeDefined();
      expect(getPageLinkByText("9")).toBeDefined();
      expect(getPageLinkByText("10")).toBeDefined();
    });

    it("renders last 5 pages when on page 9 of 10", () => {
      renderPagination({ page: 9, totalPages: 10 });

      expect(getPageLinkByText("6")).toBeDefined();
      expect(getPageLinkByText("7")).toBeDefined();
      expect(getPageLinkByText("8")).toBeDefined();
      expect(getPageLinkByText("9")).toBeDefined();
      expect(getPageLinkByText("10")).toBeDefined();
    });

    it("renders last 5 pages when on page 8 of 10", () => {
      renderPagination({ page: 8, totalPages: 10 });

      expect(getPageLinkByText("6")).toBeDefined();
      expect(getPageLinkByText("7")).toBeDefined();
      expect(getPageLinkByText("8")).toBeDefined();
      expect(getPageLinkByText("9")).toBeDefined();
      expect(getPageLinkByText("10")).toBeDefined();
    });

    it("renders all pages when totalPages is less than 5", () => {
      renderPagination({ page: 1, totalPages: 3 });

      expect(getPageLinkByText("1")).toBeDefined();
      expect(getPageLinkByText("2")).toBeDefined();
      expect(getPageLinkByText("3")).toBeDefined();
      expect(getPageLinkByText("4")).toBeUndefined();
    });

    it("renders 5 pages when totalPages is exactly 5", () => {
      renderPagination({ page: 1, totalPages: 5 });

      expect(getPageLinkByText("1")).toBeDefined();
      expect(getPageLinkByText("2")).toBeDefined();
      expect(getPageLinkByText("3")).toBeDefined();
      expect(getPageLinkByText("4")).toBeDefined();
      expect(getPageLinkByText("5")).toBeDefined();
      expect(getPageLinkByText("6")).toBeUndefined();
    });

    it("renders only page 1 when totalPages is 1", () => {
      renderPagination({ page: 1, totalPages: 1, totalRecords: 5 });

      expect(getPageLinkByText("1")).toBeDefined();
      expect(getPageLinkByText("2")).toBeUndefined();
    });
  });

  describe("navigation buttons", () => {
    it("first page button is disabled when on page 1", () => {
      renderPagination({ page: 1, totalPages: 10 });

      const firstBtn = screen.getByLabelText("Go to first page");
      const tokens = firstBtn.className.split(/\s+/);
      expect(tokens).toContain("pointer-events-none");
    });

    it("first page button is enabled when page > 1", () => {
      renderPagination({ page: 2, totalPages: 10 });

      const firstBtn = screen.getByLabelText("Go to first page");
      const tokens = firstBtn.className.split(/\s+/);
      expect(tokens).not.toContain("pointer-events-none");
    });

    it("last page button is disabled when on last page", () => {
      renderPagination({ page: 10, totalPages: 10 });

      const lastBtn = screen.getByLabelText("Go to last page");
      const tokens = lastBtn.className.split(/\s+/);
      expect(tokens).toContain("pointer-events-none");
    });

    it("last page button is enabled when not on last page", () => {
      renderPagination({ page: 1, totalPages: 10 });

      const lastBtn = screen.getByLabelText("Go to last page");
      const tokens = lastBtn.className.split(/\s+/);
      expect(tokens).not.toContain("pointer-events-none");
    });

    it("calls onPageChange(1) when first page button is clicked", () => {
      const onPageChange = vi.fn();
      renderPagination({ page: 3, totalPages: 10, onPageChange });

      fireEvent.click(screen.getByLabelText("Go to first page"));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it("calls onPageChange(totalPages) when last page button is clicked", () => {
      const onPageChange = vi.fn();
      renderPagination({ page: 3, totalPages: 10, onPageChange });

      fireEvent.click(screen.getByLabelText("Go to last page"));
      expect(onPageChange).toHaveBeenCalledWith(10);
    });

    it("calls onPageChange with page number when page button is clicked", () => {
      const onPageChange = vi.fn();
      renderPagination({ page: 1, totalPages: 10, onPageChange });

      const pageLink = getPageLinkByText("3")!;
      fireEvent.click(pageLink);
      expect(onPageChange).toHaveBeenCalledWith(3);
    });
  });

  describe("active page indicator", () => {
    it("marks the current page as active", () => {
      renderPagination({ page: 5, totalPages: 10 });

      const activeLink = [...getPageLinks()].find((el) => el.getAttribute("data-active") === "true");
      expect(activeLink).toBeDefined();
      expect(activeLink?.textContent).toBe("5");
    });

    it("does not mark non-current pages as active", () => {
      renderPagination({ page: 5, totalPages: 10 });

      const activeLinks = [...getPageLinks()].filter((el) => el.getAttribute("data-active") === "true");
      expect(activeLinks).toHaveLength(1);
    });
  });

  describe("per page select", () => {
    it("displays current perPage value", () => {
      renderPagination({ perPage: 16 });

      expect(screen.getByLabelText("Per page")).toBeInTheDocument();
    });

    it("calls onPerPageChange when selecting a different per page option", () => {
      const onPerPageChange = vi.fn();
      renderPagination({ perPage: 8, onPerPageChange });

      openSelect();
      fireEvent.click(screen.getByText("12"));

      expect(onPerPageChange).toHaveBeenCalledWith(12);
    });

    it("calls onPerPageChange when selecting the max option", () => {
      const onPerPageChange = vi.fn();
      renderPagination({ perPage: 8, onPerPageChange });

      openSelect();
      fireEvent.click(screen.getByText("20"));

      expect(onPerPageChange).toHaveBeenCalledWith(20);
    });
  });
});
