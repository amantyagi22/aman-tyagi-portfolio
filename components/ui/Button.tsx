import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

export function PrimaryButton({ href, children }: ButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-[var(--button-primary-bg)] px-5 py-2 text-sm font-medium text-[var(--button-primary-text)] transition-colors hover:opacity-90"
    >
      {children}
    </Link>
  );
}

export function SecondaryButton({ href, children }: ButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-[var(--border)] px-5 py-2 text-sm font-medium text-[var(--button-secondary-text)] transition-colors hover:border-[var(--border-strong)]"
    >
      {children}
    </Link>
  );
}
