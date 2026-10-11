export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "notchs-theme";
export const THEME_ATTRIBUTE = "data-theme";

/**
 * Runs before first paint so a saved theme choice is applied without a flash.
 * With no saved choice the attribute stays unset and CSS follows the system.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("${THEME_ATTRIBUTE}",t)}catch(e){}})()`;
