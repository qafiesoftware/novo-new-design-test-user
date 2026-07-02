interface UserAvatarProps {
  name?: string | null;
  size?: number;
  className?: string;
  loading?: boolean;
}

const COLOR_PAIRS = [
  { bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-700 dark:text-blue-200" },
  { bg: "bg-emerald-100 dark:bg-emerald-900", text: "text-emerald-700 dark:text-emerald-200" },
  { bg: "bg-violet-100 dark:bg-violet-900", text: "text-violet-700 dark:text-violet-200" },
  { bg: "bg-amber-100 dark:bg-amber-900", text: "text-amber-700 dark:text-amber-200" },
  { bg: "bg-rose-100 dark:bg-rose-900", text: "text-rose-700 dark:text-rose-200" },
  { bg: "bg-teal-100 dark:bg-teal-900", text: "text-teal-700 dark:text-teal-200" },
];

function getInitials(name?: string | null): string {
  if (!name?.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getColorIndex(name?: string | null): number {
  if (!name?.trim()) return 0;
  const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
  return code % COLOR_PAIRS.length;
}

export default function UserAvatar({
  name,
  size = 44,
  className = "",
  loading = false,
}: UserAvatarProps) {
  // loading ya name abhi nahi aaya
  if (loading || name === undefined) {
    return (
      <span
        className={`inline-flex animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // name aa gaya (null ya string)
  const initials = getInitials(name);
  const { bg, text } = COLOR_PAIRS[getColorIndex(name)];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium select-none ${bg} ${text} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.34, letterSpacing: "0.03em" }}
      aria-label={name ?? "User avatar"}
      role="img"
    >
      {initials}
    </span>
  );
}