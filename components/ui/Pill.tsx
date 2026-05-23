interface PillProps {
  children: React.ReactNode;
}

export function Pill({ children }: PillProps) {
  return (
    <span className="pill rounded-full px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}
