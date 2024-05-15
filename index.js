import { createStorage, createRegistrar, createLogger } from "/modules/official/stdlib/index.js";
import { createSettings } from "/modules/official/stdlib/lib/settings.js";
import { React } from "/modules/official/stdlib/src/expose/React.js";
import { NavLink } from "/modules/official/stdlib/src/registers/navlink.js";
import { ACTIVE_ICON, ICON } from "./src/static.js";
import { Route } from "/modules/official/stdlib/src/webpack/ReactComponents.js";
export let storage;
export let logger;
export let settings;
export let settingsButton;
export default function(mod) {
    storage = createStorage(mod);
    logger = createLogger(mod);
    [settings, settingsButton] = createSettings(mod);
    const registrar = createRegistrar(mod);
    const LazyApp = React.lazy(()=>import("./src/app.js"));
    registrar.register("route", /*#__PURE__*/ React.createElement(Route, {
        path: "/bespoke/marketplace/*",
        element: /*#__PURE__*/ React.createElement(LazyApp, null)
    }));
    registrar.register("navlink", ()=>/*#__PURE__*/ React.createElement(NavLink, {
            localizedApp: "Marketplace",
            appRoutePath: "/bespoke/marketplace",
            icon: ICON,
            activeIcon: ACTIVE_ICON
        }));
}
