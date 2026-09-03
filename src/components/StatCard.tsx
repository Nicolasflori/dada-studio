export default function StatCard({
  label,
  value,
  hint,
  destacado,
}: {
  label: string;
  value: string;
  hint?: string;
  destacado?: boolean;
}) {
  return (
    <div
      className={
        destacado
          ? "rounded-sm border-2 border-ink-900 bg-red-500 p-5 text-paper shadow-[4px_4px_0_0_var(--ink-900)]"
          : "rounded-sm border-2 border-ink-900 bg-surface p-5 shadow-[4px_4px_0_0_var(--ink-900)]"
      }
    >
      <p className={destacado ? "text-sm text-paper/80" : "text-sm text-ink-500"}>{label}</p>
      <p className={`mt-1 font-display text-3xl font-medium ${destacado ? "text-paper" : "text-ink-800"}`}>{value}</p>
      {hint && <p className={`mt-1 text-xs ${destacado ? "text-paper/70" : "text-ink-400"}`}>{hint}</p>}
    </div>
  );
}
