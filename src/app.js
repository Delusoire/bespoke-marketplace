import { S } from "/modules/Delusoire/stdlib/index.js";
import Marketplace from "./pages/Marketplace.js";
import ModulePage from "./pages/Module.js";
export default function() {
    const match = S.useMatch("/marketplace/:murl");
    const murl = match?.params?.murl;
    return /*#__PURE__*/ S.React.createElement("div", {
        id: "marketplace"
    }, /*#__PURE__*/ S.React.createElement(S.ReactComponents.Routes, null, /*#__PURE__*/ S.React.createElement(S.ReactComponents.Route, {
        path: "/",
        element: /*#__PURE__*/ S.React.createElement(Marketplace, null)
    }), /*#__PURE__*/ S.React.createElement(S.ReactComponents.Route, {
        path: ":murl",
        element: /*#__PURE__*/ S.React.createElement(ModulePage, {
            murl: murl
        })
    })));
}
