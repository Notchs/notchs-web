export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "notchs-theme";
export const THEME_ATTRIBUTE = "data-theme";
/** Fired on window when the user picks a theme with the toggle. */
export const THEME_CHANGE_EVENT = "notchs:theme-change";

/**
 * Runs before first paint so a saved theme choice is applied without a flash.
 * With no saved choice the attribute stays unset and CSS follows the system.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("${THEME_ATTRIBUTE}",t)}catch(e){}})()`;
