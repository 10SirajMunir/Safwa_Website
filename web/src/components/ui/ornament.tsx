/** The thin gold rule with a four-petal diamond from the logo; the site's only decorative motif. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-gold-500 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-current" />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M7 0c.6 2.6 1.6 3.9 3.2 4.4C8.6 5 7.6 6 7 7c-.6-1-1.6-2-3.2-2.6C5.4 3.9 6.4 2.6 7 0Zm0 7c.6 1 1.6 2 3.2 2.6C8.6 10.1 7.6 11.4 7 14c-.6-2.6-1.6-3.9-3.2-4.4C5.4 9 6.4 8 7 7Zm0 0c1-.6 2-1.6 2.6-3.2C10.1 5.4 11.4 6.4 14 7c-2.6.6-3.9 1.6-4.4 3.2C9 8.6 8 7.6 7 7Zm0 0c-1 .6-2 1.6-2.6 3.2C3.9 8.6 2.6 7.6 0 7c2.6-.6 3.9-1.6 4.4-3.2C5 5.4 6 6.4 7 7Z" />
      </svg>
      <span className="h-px flex-1 bg-current" />
    </div>
  );
}
