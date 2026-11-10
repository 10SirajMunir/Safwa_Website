import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type ButtonVariant = "primary" | "gold" | "outline" | "outline-light" | "whatsapp";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-maroon-800 text-ivory hover:bg-maroon-700 active:bg-maroon-900",
  gold: "bg-gold-400 text-maroon-900 hover:bg-gold-300 active:bg-gold-500",
  outline: "border border-maroon-800/30 text-maroon-800 hover:border-maroon-800 hover:bg-maroon-800/[0.04]",
  "outline-light": "border border-gold-300/50 text-gold-200 hover:border-gold-300 hover:bg-white/[0.06]",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-dark",
};

export const buttonClasses = (variant: ButtonVariant = "primary", className = "") =>
  `inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-6 text-[1rem] font-semibold tracking-[0.01em] transition-colors duration-150 ${variants[variant]} ${className}`;

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

/** Internal navigation styled as a button. */
export function ButtonLink({ variant = "primary", className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, className)} {...props}>
      {children}
    </Link>
  );
}

type ExternalButtonProps = Omit<ComponentProps<"a">, "className"> & {
  variant?: ButtonVariant;
  className?: string;
};

/** Links that leave the site or open an app (WhatsApp, phone, email). */
export function ExternalButton({ variant = "primary", className, children, ...props }: ExternalButtonProps) {
  const opensNewTab = props.href?.startsWith("http");
  return (
    <a
      className={buttonClasses(variant, className)}
      {...(opensNewTab && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    >
      {children}
    </a>
  );
}
