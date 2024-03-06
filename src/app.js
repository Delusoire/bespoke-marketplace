import { S } from "/modules/Delusoire/std/index.js";
import Marketplace from "./pages/Marketplace.js";
import ModulePage from "./pages/Module.js";
export default function () {
    const match = S.useMatch("/marketplace/:mrl");
    const murl = match?.params?.murl;
    return (S.React.createElement("div", { id: "stats-app" },
        S.React.createElement(S.ReactComponents.Routes, null,
            S.React.createElement(S.ReactComponents.Route, { path: "/", element: S.React.createElement(Marketplace, null) }),
            S.React.createElement(S.ReactComponents.Route, { path: ":module", element: S.React.createElement(ModulePage, { murl: murl }) }))));
}
