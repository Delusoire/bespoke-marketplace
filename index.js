import { S, createStorage, createRegistrar, createLogger } from "/modules/official/stdlib/index.js";
import { createSettings } from "/modules/official/stdlib/lib/settings.js";
import { NavLink } from "/modules/official/stdlib/src/registers/navlink.js";
import { ACTIVE_ICON, ICON } from "./src/static.js";
export let storage = undefined;
export let logger = undefined;
export let settings = undefined;
export let settingsButton = undefined;
export default function (mod) {
	storage = createStorage(mod);
	logger = createLogger(mod);
	[settings, settingsButton] = createSettings(mod);
	const registrar = createRegistrar(mod);
	const LazyApp = S.React.lazy(() => import("./src/app.js"));
	registrar.register(
		"route",
		/*#__PURE__*/ S.React.createElement(S.ReactComponents.Route, {
			path: "/bespoke/marketplace/*",
			element: /*#__PURE__*/ S.React.createElement(LazyApp, null),
		}),
	);
	registrar.register("navlink", () =>
		/*#__PURE__*/ S.React.createElement(NavLink, {
			localizedApp: "Marketplace",
			appRoutePath: "/bespoke/marketplace",
			icon: ICON,
			activeIcon: ACTIVE_ICON,
		}),
	);
}
