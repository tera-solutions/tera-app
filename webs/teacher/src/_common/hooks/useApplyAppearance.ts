import { useEffect } from "react";

import { SettingService } from "@tera/modules/system";

import { THEME_COLOR_OPTIONS } from "pages/Settings/constants";

/** Darken a `#rrggbb` hex by `amount` (0–1) for the `--color-brand-dark` hover/active shade. */
const darken = (hex: string, amount: number) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const channel = (shift: number) =>
    Math.max(0, Math.round(((num >> shift) & 0xff) * (1 - amount)));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(channel(16))}${toHex(channel(8))}${toHex(channel(0))}`;
};

/**
 * Applies the business's saved `appearance.color` / `appearance.font` settings
 * app-wide, on top of Tailwind's CSS-variable theme (`--color-brand` in
 * `main.css` drives every `bg-brand`/`text-brand`/`border-brand` utility class
 * at runtime, so overriding it here re-tints those classes without a rebuild).
 *
 * `appearance.theme_mode` (light/dark/system) is intentionally NOT applied:
 * this codebase has no dark-mode styling anywhere (no `dark:` variants in any
 * component), so there is nothing for the setting to switch. Wiring it up for
 * real means auditing and adding dark variants across the whole app — a
 * separate, much larger initiative, not a Settings-page wiring fix.
 */
const useApplyAppearance = (enabled: boolean) => {
  const { data } = SettingService.useSettingList(
    { params: { page: 1, per_page: 100 } },
    { enabled },
  );

  useEffect(() => {
    const items: Array<{ key: string; value: string }> = data?.data?.items ?? [];
    const map = Object.fromEntries(items.map((item) => [item.key, item.value]));

    const color = map["appearance.color"];
    const hex = THEME_COLOR_OPTIONS.find((option) => option.value === color)?.hex;
    if (hex) {
      document.documentElement.style.setProperty("--color-brand", hex);
      document.documentElement.style.setProperty("--color-brand-dark", darken(hex, 0.2));
    }

    const font = map["appearance.font"];
    if (font) {
      document.documentElement.style.setProperty("font-family", `"${font}", sans-serif`);
    }
  }, [data]);
};

export default useApplyAppearance;
