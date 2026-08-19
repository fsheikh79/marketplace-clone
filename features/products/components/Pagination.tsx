import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-1"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="border-surface-border text-brand-900 flex h-9 w-9 items-center justify-center rounded-md border disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onChange(pageNumber)}
          aria-current={pageNumber === page ? "page" : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold ${
            pageNumber === page
              ? "bg-brand-900 text-white"
              : "border-surface-border text-brand-900 hover:bg-surface-muted border"
          }`}
        >
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="border-surface-border text-brand-900 flex h-9 w-9 items-center justify-center rounded-md border disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
