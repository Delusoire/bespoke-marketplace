import { S, createStorage, createRegistrar, createLogger } from "/modules/Delusoire/std/index.js";
import { createSettings } from "/modules/Delusoire/std/lib/settings.js";

import { NavLink } from "/modules/Delusoire/std/src/registers/navlink.js";
import type { Module } from "/hooks/module.js";
import type { Settings } from "/modules/Delusoire/std/lib/settings.js";
import { ACTIVE_ICON, ICON } from "./src/static.js";

export let storage: Storage = undefined;
export let logger: Console = undefined;
export let settings: Settings = undefined;
export let settingsButton: React.JSX.Element = undefined;

export default function (mod: Module) {
	storage = createStorage(mod);
	logger = createLogger(mod);
	[settings, settingsButton] = createSettings(mod);
	const registrar = createRegistrar(mod);

	const LazyApp = S.React.lazy(() => import("./src/app.js"));
	registrar.register("route", <S.ReactComponents.Route path={"/marketplace/*"} element={<LazyApp />} />);

	registrar.register("navlink", () => <NavLink localizedApp="Marketplace" appRoutePath="/marketplace" icon={ICON} activeIcon={ACTIVE_ICON} />);
}
