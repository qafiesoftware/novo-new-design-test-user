// components/ui/InitialsAvatar.tsx
function getInitials(name: string): string {
  const parts = name?.trim().split(" ").filter(Boolean);
  if (!parts || parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-cyan-500",
];

function getColor(name: string): string {
  const index = (name?.charCodeAt(0) ?? 0) % COLORS.length;
  return COLORS[index];
}

export default function InitialsAvatar({ name, size = 34 }: { name: string; size?: number }) {
  const initials = getInitials(name);
  const color = getColor(name);

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white shadow-sm ${color}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}
