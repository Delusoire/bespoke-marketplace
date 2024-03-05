import { TabItemConfig } from "./types/marketplace-types";
import { version } from "../package.json";

export const MARKETPLACE_VERSION = version;

const STORAGE_KEY_PREFIX = "marketplace";
export const LOCALSTORAGE_KEYS = {
	installedExtensions: `${STORAGE_KEY_PREFIX}:installed-extensions`,
	installedSnippets: `${STORAGE_KEY_PREFIX}:installed-snippets`,
	installedThemes: `${STORAGE_KEY_PREFIX}:installed-themes`,
	activeTab: `${STORAGE_KEY_PREFIX}:active-tab`,
	tabs: `${STORAGE_KEY_PREFIX}:tabs`,
	sort: `${STORAGE_KEY_PREFIX}:sort`,
	// Theme installed store the localsorage key of the theme (e.g. marketplace:installed:NYRI4/Comfy-spicetify/user.css)
	themeInstalled: `${STORAGE_KEY_PREFIX}:theme-installed`,
	localTheme: `${STORAGE_KEY_PREFIX}:local-theme`,
	albumArtBasedColor: `${STORAGE_KEY_PREFIX}:albumArtBasedColors`,
	albumArtBasedColorMode: `${STORAGE_KEY_PREFIX}:albumArtBasedColorsMode`,
	albumArtBasedColorVibrancy: `${STORAGE_KEY_PREFIX}:albumArtBasedColorsVibrancy`,
	colorShift: `${STORAGE_KEY_PREFIX}:colorShift`,
};

// Initalize topbar tabs
// Data initalized in TabBar.js
export const ALL_TABS: TabItemConfig[] = [
	{ name: "Extensions", enabled: true },
	{ name: "Themes", enabled: true },
	{ name: "Snippets", enabled: true },
	{ name: "Apps", enabled: true },
	{ name: "Installed", enabled: true },
];

export const CUSTOM_APP_PATH = "/marketplace";

// Used in Card.tsx
export const MAX_TAGS = 4;

export const SNIPPETS_PAGE_URL = "https://github.com/spicetify/spicetify-marketplace/blob/main/src/resources/snippets.ts";

export const BLACKLIST_URL = "https://raw.githubusercontent.com/spicetify/spicetify-marketplace/main/resources/blacklist.json";

export const RELEASES_URL = "https://github.com/spicetify/spicetify-marketplace/releases";

export const LATEST_RELEASE_URL = "https://api.github.com/repos/spicetify/spicetify-marketplace/releases/latest";

export const ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 76.465 68.262"><path d="M151.909 72.923v6.5h10.097l8.663 44.567h48.968v-6.5h-43.61l-1.2-6.172h42.974l10.35-33.91h-59.915l-.872-4.485H151.91zm17.59 10.984h49.867l-6.393 20.91h-39.409l-4.064-20.91zm5.626 44.11a6.5 6.5 0 0 0-6.5 6.5 6.5 6.5 0 0 0 6.5 6.501 6.5 6.5 0 0 0 6.5-6.5 6.5 6.5 0 0 0-6.5-6.5zm38.274 0a6.5 6.5 0 0 0-6.5 6.5 6.5 6.5 0 0 0 6.5 6.501 6.5 6.5 0 0 0 6.5-6.5 6.5 6.5 0 0 0-6.5-6.5z" style="fill:currentColor;stroke-width:.264583" transform="translate(-151.909 -72.923)"/></svg>`;

export const ACTIVE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 76.465 68.262"><path d="M151.909 72.923v6.5h10.097l8.663 44.567h48.968v-6.5h-43.61l-1.2-6.172h42.974l10.35-33.91h-59.915l-.872-4.485H151.91zm23.216 55.095a6.5 6.5 0 0 0-6.5 6.5 6.5 6.5 0 0 0 6.5 6.5 6.5 6.5 0 0 0 6.5-6.5 6.5 6.5 0 0 0-6.5-6.5zm38.274 0a6.5 6.5 0 0 0-6.5 6.5 6.5 6.5 0 0 0 6.5 6.5 6.5 6.5 0 0 0 6.5-6.5 6.5 6.5 0 0 0-6.5-6.5z" style="fill:currentColor;stroke-width:.264583" transform="translate(-151.909 -72.923)"/></svg>`;
