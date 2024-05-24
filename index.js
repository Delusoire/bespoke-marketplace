import { createStorage, createRegistrar, createLogger } from "/modules/official/stdlib/index.js";
import { createSettings } from "/modules/official/stdlib/lib/settings.js";
import { React } from "/modules/official/stdlib/src/expose/React.js";
import { NavLink } from "/modules/official/stdlib/src/registers/navlink.js";
import { ACTIVE_ICON, ICON } from "./src/static.js";
import { Route } from "/modules/official/stdlib/src/webpack/ReactComponents.js";
import { PlaybarButton } from "/modules/official/stdlib/src/registers/playbarButton.js";
import { usePanelAPI } from "/modules/official/stdlib/src/webpack/CustomHooks.js";
import panelReg from "/modules/official/stdlib/src/registers/panel.js";
import VersionList from "./src/components/VersionList/./index.js";
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
    registrar.register("navlink", /*#__PURE__*/ React.createElement(MarketplaceLink, null));
    const panel = /*#__PURE__*/ React.createElement(VersionList, null);
    registrar.register("panel", panel);
    registrar.register("playbarButton", /*#__PURE__*/ React.createElement(VersionListButton, panelReg.getHash(panel)));
}
const MarketplaceLink = ()=>/*#__PURE__*/ React.createElement(NavLink, {
        localizedApp: "Marketplace",
        appRoutePath: "/bespoke/marketplace",
        icon: ICON,
        activeIcon: ACTIVE_ICON
    });
const VersionListButton = (props)=>{
    const { isActive, panelSend } = usePanelAPI(props.state);
    return /*#__PURE__*/ React.createElement(PlaybarButton, {
        label: "Marketplace",
        isActive: isActive,
        icon: ICON,
        onClick: ()=>panelSend(props.event)
    });
};
