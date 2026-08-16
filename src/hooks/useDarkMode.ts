import { useEffect, useState } from "react";
import { PickerTheme } from "../types";

export function useDarkMode(theme: PickerTheme): boolean {
  const [systemIsDark, setSystemIsDark] = useState(false);

  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setSystemIsDark(mediaQuery.matches);
    updateTheme();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateTheme);
      return () => mediaQuery.removeEventListener("change", updateTheme);
    }

    mediaQuery.addListener(updateTheme);
    return () => mediaQuery.removeListener(updateTheme);
  }, [theme]);

  return theme === "dark" || (theme === "system" && systemIsDark);
}
