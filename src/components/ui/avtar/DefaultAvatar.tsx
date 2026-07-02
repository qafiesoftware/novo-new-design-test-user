type DefaultAvatarProps = {
  name?: string;
  size?: number;
};

export default function DefaultAvatar({ name = "", size = 96 }: DefaultAvatarProps) {
  const initials = name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const letter = initials;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full rounded-full"
      aria-label={name ? `${name} avatar` : "User avatar"}
    >
      {/* Background */}
      <rect width="96" height="96" fill="#EEF2FF" rx="48" />

      {/* Body silhouette */}
      <circle cx="48" cy="38" r="18" fill="#C7D2FE" />
      <ellipse cx="48" cy="82" rx="28" ry="16" fill="#C7D2FE" />

      {/* Initials — centered, on top of silhouette */}
      <text
        x="48"
        y="44"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={letter.length > 1 ? "16" : "20"}
        fontWeight="600"
        fontFamily="Outfit, sans-serif"
        fill="#4F46E5"
      >
        {letter}
      </text>
    </svg>
  );
}
