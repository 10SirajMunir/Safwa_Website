import type { ReactNode } from "react";

export const inputClasses =
  "min-h-12 w-full rounded-sm border border-line bg-white px-3 text-[1.0625rem] text-ink placeholder:text-muted/60 focus:border-maroon-700 aria-[invalid=true]:border-danger";

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

/** Label above, hint and error below, wired up with aria-describedby by the caller. */
export function Field({ id, label, optional, hint, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold text-ink">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-[0.9375rem] text-muted">
          {hint}
        </p>
      )}
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[0.9375rem] font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, { hint, error }: { hint?: boolean; error?: string }) {
  const ids = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}
