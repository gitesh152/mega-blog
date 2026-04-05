import { useAppDispatch, useAppSelector } from "../../hooks";
import { toggleTheme } from "../../features/theme/themeSlice";

type ThemeToggleProps = {
  readonly compact?: boolean;
};

function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const isDark = themeMode === "dark";

  // Position mapping for toggle circle
  const togglePositions = {
    compact: { dark: "left-8", light: "left-1" },
    full: { dark: "left-10.5", light: "left-1" },
  };
  const toggleLeftPosition =
    togglePositions[compact ? "compact" : "full"][isDark ? "dark" : "light"];

  // Toggle circle styles
  const toggleStyles = isDark
    ? "bg-stone-200 ring-stone-300/70"
    : "bg-emerald-500 ring-emerald-400/60";

  // Inner dot styles
  const innerToggleStyles = isDark
    ? "left-0.5 top-0.5 bg-stone-800"
    : "left-1 top-1 bg-emerald-300/80";

  // Size classes
  const sizes = {
    button: compact ? "h-9 w-16" : "h-10 w-20",
    toggleCircle: compact ? "h-7 w-7" : "h-8 w-8",
    innerDot: compact ? "h-5 w-5" : "h-6 w-6",
  };

  // Background styles
  const bgStyles = isDark
    ? "border-stone-600 bg-linear-to-r from-stone-900 via-stone-800 to-stone-700"
    : "border-stone-300 bg-linear-to-r from-stone-100 via-stone-50 to-emerald-50";

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      className={[
        "group relative overflow-hidden rounded-full border transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-200 dark:focus-visible:ring-offset-stone-900",
        sizes.button,
        bgStyles,
      ].join(" ")}
    >
      <span
        className={[
          "absolute inset-0 transition-opacity duration-500",
          isDark ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <span className="absolute left-3 top-2 h-1 w-1 rounded-full bg-stone-100/90" />
        <span className="absolute left-6 top-3 h-1.5 w-1.5 rounded-full bg-stone-200/80" />
        <span className="absolute right-4 top-2.5 h-1 w-1 rounded-full bg-stone-100/90" />
      </span>

      <span
        className={[
          "absolute inset-0 transition-opacity duration-500",
          isDark ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <span className="absolute right-5 top-3 h-2 w-8 rounded-full bg-stone-300/80" />
        <span className="absolute right-3 top-5 h-2.5 w-6 rounded-full bg-stone-200/90" />
      </span>

      <span
        className={[
          "absolute top-1 rounded-full shadow-md ring-1 transition-all duration-500",
          sizes.toggleCircle,
          toggleLeftPosition,
          toggleStyles,
        ].join(" ")}
      >
        <span
          className={[
            "absolute rounded-full transition-all duration-500",
            sizes.innerDot,
            innerToggleStyles,
          ].join(" ")}
        />
      </span>
    </button>
  );
}

export default ThemeToggle;
