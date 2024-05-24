import { React } from "/modules/official/stdlib/src/expose/React.js";
import { PanelContent, PanelHeader, PanelSkeleton } from "/modules/official/stdlib/src/webpack/ReactComponents.js";
export default function(props) {
    const [ref, setRef] = React.useState(null);
    const m = React.useMemo(()=>import("../../pages/Marketplace.js"), []);
    React.useEffect(()=>void m.then((m)=>m.refresh?.()), [
        ref
    ]);
    React.useEffect(()=>()=>void m.then((m)=>m.unselect?.()), []);
    return /*#__PURE__*/ React.createElement(PanelSkeleton, {
        label: "Marketplace"
    }, /*#__PURE__*/ React.createElement(PanelContent, null, /*#__PURE__*/ React.createElement(PanelHeader, {
        title: "greetings"
    }), /*#__PURE__*/ React.createElement("div", {
        id: "MarketplacePanel",
        ref: (r)=>setRef(r)
    }, /*#__PURE__*/ React.createElement(VersionListContentPlaceholder, null))));
}
const VersionListContentPlaceholder = ()=>{
    return;
};
export const VersionListContent = ({ module })=>{
    const instEntries = Array.from(module.instances.entries());
    return /*#__PURE__*/ React.createElement("ul", null, instEntries.map(([version, inst])=>/*#__PURE__*/ React.createElement(Version, {
            key: version,
            moduleInst: inst
        })));
};
const Version = ({ moduleInst })=>{
    return /*#__PURE__*/ React.createElement("li", null, moduleInst.getVersion(), /*#__PURE__*/ React.createElement("button", null, "E/D"), /*#__PURE__*/ React.createElement("button", null, "I/R"));
};
