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
    return "Loading ...";
};
export const VersionListContent = (props)=>{
    return /*#__PURE__*/ React.createElement("div", null, "Content for: ", props.module.getIdentifier());
};
