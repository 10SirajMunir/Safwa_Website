"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { mainNav } from "@/config/navigation";

interface NavListProps {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
  activePath?: string | null;
}

function isActive(pathname: string | null | undefined, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || (pathname?.startsWith(`${href}/`) ?? false);
}

function NavList({ className, linkClassName, onNavigate, activePath }: NavListProps) {
  return (
    <ul className={className}>
      {mainNav.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={linkClassName}
            aria-current={isActive(activePath, item.href) ? "page" : undefined}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ActiveNavList(props: Omit<NavListProps, "activePath">) {
  return <NavList {...props} activePath={usePathname()} />;
}

/**
 * Main navigation. The links are always in the server HTML; the current-page marker
 * (aria-current) is added once the pathname is known.
 */
export function NavLinks(props: Omit<NavListProps, "activePath">) {
  return (
    <Suspense fallback={<NavList {...props} />}>
      <ActiveNavList {...props} />
    </Suspense>
  );
}
