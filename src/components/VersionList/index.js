import { useUpdate } from "../../util/index.js";
import { ModuleManager } from "/hooks/protocol.js";
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
const Version = (props)=>{
    return /*#__PURE__*/ React.createElement("li", null, props.moduleInst.getVersion(), /*#__PURE__*/ React.createElement(RAB, {
        moduleInst: props.moduleInst
    }), /*#__PURE__*/ React.createElement(DEB, {
        moduleInst: props.moduleInst
    }));
};
const RAB = (props)=>{
    const [installed, setInstalled, updateInstalled] = useUpdate(()=>props.moduleInst.isInstalled());
    const B = installed ? RemoveButton : AddButton;
    return /*#__PURE__*/ React.createElement(B, {
        ...props,
        setInstalled: setInstalled,
        updateInstalled: updateInstalled
    });
};
const RemoveButton = (props)=>{
    return /*#__PURE__*/ React.createElement("button", {
        onClick: async ()=>{
            props.setInstalled(true);
            if (!await props.moduleInst.remove()) {
                props.updateInstalled();
            }
        }
    }, "del");
};
const AddButton = (props)=>{
    return /*#__PURE__*/ React.createElement("button", {
        onClick: async ()=>{
            props.setInstalled(false);
            if (!await props.moduleInst.add()) {
                props.updateInstalled();
            }
        }
    }, "ins");
};
const DEB = (props)=>{
    const [enabled, setEnabled, updateEnabled] = useUpdate(()=>props.moduleInst.isEnabled());
    const B = enabled ? DisableButton : EnableButton;
    return /*#__PURE__*/ React.createElement(B, {
        ...props,
        setEnabled: setEnabled,
        updateEnabled: updateEnabled
    });
};
const DisableButton = (props)=>{
    return /*#__PURE__*/ React.createElement("button", {
        onClick: async ()=>{
            props.setEnabled(true);
            if (!await ModuleManager.disable(props.moduleInst.getModule())) {
                props.updateEnabled();
            }
        }
    }, "dis");
};
const EnableButton = (props)=>{
    return /*#__PURE__*/ React.createElement("button", {
        onClick: async ()=>{
            props.setEnabled(false);
            if (!await ModuleManager.enable(props.moduleInst)) {
                props.updateEnabled();
            }
        }
    }, "ena");
};
