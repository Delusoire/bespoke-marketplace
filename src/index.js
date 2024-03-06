import { S, createStorage, createRegistrar, createLogger } from "/modules/Delusoire/std/index.js";
import { createSettings } from "/modules/Delusoire/std/api/settings.js";
import { NavLink } from "/modules/Delusoire/std/registers/navlink.js";
import { ACTIVE_ICON, ICON } from "./static.js";
export let storage = undefined;
export let logger = undefined;
export let settings = undefined;
export default function (mod) {
    storage = createStorage(mod);
    logger = createLogger(mod);
    settings = createSettings(mod);
    const registrar = createRegistrar(mod);
    const LazyApp = S.React.lazy(() => import("./app.js"));
    registrar.register("route", S.React.createElement(S.ReactComponents.Route, { path: "/marketplace/*", element: S.React.createElement(LazyApp, null) }));
    registrar.register("navlink", () => S.React.createElement(NavLink, { localizedApp: "Marketplace", appRoutePath: "/marketplace", icon: ICON, activeIcon: ACTIVE_ICON }));
}
