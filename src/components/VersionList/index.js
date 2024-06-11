import { useUpdate } from "../../util/index.js";
import { React } from "/modules/official/stdlib/src/expose/React.js";
import { useLocation, usePanelAPI } from "/modules/official/stdlib/src/webpack/CustomHooks.js";
import { PanelContent, PanelHeader, PanelSkeleton } from "/modules/official/stdlib/src/webpack/ReactComponents.js";
export default function(props) {
    const [ref, setRef] = React.useState(null);
    const m = React.useMemo(()=>import("../../pages/Marketplace.js"), []);
    React.useEffect(()=>void m.then((m)=>m.refresh?.()), [
        ref
    ]);
    React.useEffect(()=>()=>void m.then((m)=>m.unselect?.()), []);
    const location = useLocation();
    const { panelSend } = usePanelAPI();
    if (location.pathname !== "/bespoke/marketplace") {
        panelSend("panel_close_click_or_collapse");
    }
    return /*#__PURE__*/ React.createElement(PanelSkeleton, {
        label: "Marketplace"
    }, /*#__PURE__*/ React.createElement(PanelContent, null, /*#__PURE__*/ React.createElement(PanelHeader, {
        title: "greetings"
    }), /*#__PURE__*/ React.createElement("div", {
        id: "MarketplacePanel",
        ref: (r)=>setRef(r)
    })));
}
export const VersionListContent = (props)=>{
    const { selectedInstance } = props;
    return props.modules.map((module)=>/*#__PURE__*/ React.createElement("ul", {
            key: module.getHeritage().join("\x00")
        }, Array.from(module.instances).map(([version, inst])=>/*#__PURE__*/ React.createElement(VersionItem, {
                key: version,
                moduleInstance: inst,
                selectInstance: props.selectInstance,
                cardUpdateEnabled: props.cardUpdateEnabled
            }))));
};
const VersionItem = (props)=>{
    return /*#__PURE__*/ React.createElement("li", {
        onClick: ()=>props.selectInstance(props.moduleInstance)
    }, props.moduleInstance.getVersion(), /*#__PURE__*/ React.createElement(RAB, props), /*#__PURE__*/ React.createElement(DEB, props));
};
const RAB = (props)=>{
    const { moduleInstance } = props;
    const isInstalled = React.useCallback(()=>"isInstalled" in moduleInstance && moduleInstance.isInstalled(), [
        moduleInstance
    ]);
    const [installed, setInstalled, updateInstalled] = useUpdate(isInstalled);
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
            props.setInstalled(false);
            if (!await props.moduleInstance.remove()) {
                props.updateInstalled();
            }
        }
    }, "del");
};
const AddButton = (props)=>{
    return /*#__PURE__*/ React.createElement("button", {
        onClick: async ()=>{
            props.setInstalled(true);
            if (!await props.moduleInstance.add()) {
                props.updateInstalled();
            }
        }
    }, "ins");
};
const DEB = (props)=>{
    const isEnabled = React.useCallback(()=>props.moduleInstance.isEnabled(), [
        props.moduleInstance
    ]);
    const [enabled, setEnabled, updateEnabled] = useUpdate(isEnabled);
    const B = enabled ? DisableButton : EnableButton;
    return /*#__PURE__*/ React.createElement(B, {
        ...props,
        setEnabled: (enabled)=>setEnabled(enabled),
        updateEnabled: updateEnabled,
        cardUpdateEnabled: props.cardUpdateEnabled
    });
};
const DisableButton = (props)=>{
    return /*#__PURE__*/ React.createElement("button", {
        onClick: async ()=>{
            props.setEnabled(false);
            if (await props.moduleInstance.getModule().disable()) {
                props.cardUpdateEnabled();
            } else {
                props.updateEnabled();
            }
        }
    }, "dis");
};
const EnableButton = (props)=>{
    return /*#__PURE__*/ React.createElement("button", {
        onClick: async ()=>{
            props.setEnabled(true);
            if (await props.moduleInstance.enable()) {
                props.cardUpdateEnabled();
            } else {
                props.updateEnabled();
            }
        }
    }, "ena");
};
