export default function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-sm border-2 border-ink-900 bg-surface p-5 shadow-[4px_4px_0_0_var(--ink-900)]">
      <p className="text-sm text-ink-500">{label}</p>
      <p className="mt-1 font-display text-2xl font-medium text-ink-800">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
