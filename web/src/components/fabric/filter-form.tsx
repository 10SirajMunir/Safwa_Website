import Form from "next/form";
import Link from "next/link";
import {
  FILTER_KEYS,
  FILTER_LABELS,
  type CatalogFilters,
  type FilterOptions,
} from "@/server/catalog/filters";
import { ChevronDownIcon } from "@/components/ui/icons";
import { buttonClasses } from "@/components/ui/button-link";

interface FilterFormProps {
  options: FilterOptions;
  filters: CatalogFilters;
  /** Keeps element ids unique when the form appears twice (phone + desktop layouts). */
  idPrefix: string;
}

/**
 * FR-01 filters as a GET form: the URL carries the filters, so results can be shared,
 * bookmarked and crawled, and the form works with JavaScript turned off.
 */
export function FilterForm({ options, filters, idPrefix }: FilterFormProps) {
  return (
    <Form action="/fabrics" className="space-y-4" aria-label="Filter fabrics">
      {FILTER_KEYS.filter((key) => options[key].length > 0).map((key) => {
        const id = `${idPrefix}-${key}`;
        return (
          <div key={key}>
            <label htmlFor={id} className="block text-[0.9375rem] font-semibold text-ink">
              {FILTER_LABELS[key]}
            </label>
            <div className="relative mt-1.5">
              <select
                id={id}
                name={key}
                defaultValue={filters[key] ?? ""}
                className="min-h-12 w-full appearance-none rounded-sm border border-line bg-white pl-3 pr-10 text-[1rem] text-ink focus:border-maroon-700"
              >
                <option value="">Any</option>
                {options[key].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
            </div>
          </div>
        );
      })}
      <div className="flex flex-col gap-2 pt-2">
        <button type="submit" className={buttonClasses("primary", "w-full")}>
          Show fabrics
        </button>
        {Object.keys(filters).length > 0 && (
          <Link href="/fabrics" className={buttonClasses("outline", "w-full")}>
            Clear filters
          </Link>
        )}
      </div>
    </Form>
  );
}
