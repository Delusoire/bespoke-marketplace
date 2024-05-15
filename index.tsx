import { createStorage, createRegistrar, createLogger } from "/modules/official/stdlib/index.js";
import { createSettings } from "/modules/official/stdlib/lib/settings.js";
import { React } from "/modules/official/stdlib/src/expose/React.js";

import { NavLink } from "/modules/official/stdlib/src/registers/navlink.js";
import type { ModuleInstance } from "/hooks/module.js";
import type { Settings } from "/modules/official/stdlib/lib/settings.js";
import { ACTIVE_ICON, ICON } from "./src/static.js";
import { Route } from "/modules/official/stdlib/src/webpack/ReactComponents.js";

export let storage: Storage;
export let logger: Console;
export let settings: Settings;
export let settingsButton: React.JSX.Element;

export default function ( mod: ModuleInstance ) {
	storage = createStorage( mod );
	logger = createLogger( mod );
	[ settings, settingsButton ] = createSettings( mod );
	const registrar = createRegistrar( mod );

	const LazyApp = React.lazy( () => import( "./src/app.js" ) );
	registrar.register( "route", <Route path={ "/bespoke/marketplace/*" } element={ <LazyApp /> } /> );

	registrar.register( "navlink", () => (
		<NavLink localizedApp="Marketplace" appRoutePath="/bespoke/marketplace" icon={ ICON } activeIcon={ ACTIVE_ICON } />
	) );
}
