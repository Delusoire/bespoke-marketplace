import { React } from "/modules/official/stdlib/src/expose/React.js";
import { ReactDOM } from "/modules/official/stdlib/src/webpack/React.js";
import { t } from "../i18n.js";
import { Module } from "/hooks/module.js";
import ModuleCard from "../components/ModuleCard/index.js";
import { hash, settingsButton } from "../../index.js";
import { CONFIG } from "../settings.js";
import { getProp, TreeNodeVal, useChipFilter, useDropdown, useSearchBar } from "/modules/official/stdlib/lib/components/index.js";
import { usePanelAPI } from "/modules/official/stdlib/src/webpack/CustomHooks.js";
import { VersionListContent } from "../components/VersionList/index.js";
const SortOptions = {
    default: ()=>t("sort.default"),
    "a-z": ()=>t("sort.a-z"),
    "z-a": ()=>t("sort.z-a"),
    random: ()=>t("sort.random")
};
const SortFns = {
    default: null,
    "a-z": (a, b)=>b.name > a.name ? 1 : a.name > b.name ? -1 : 0,
    "z-a": (a, b)=>a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
    random: ()=>Math.random() - 0.5
};
const enabled = {
    enabled: {
        [TreeNodeVal]: t("filter.enabled")
    }
};
const getFilters = ()=>({
        [TreeNodeVal]: null,
        themes: {
            [TreeNodeVal]: t("filter.themes"),
            ...enabled
        },
        extensions: {
            [TreeNodeVal]: t("filter.extensions"),
            ...enabled
        },
        apps: {
            [TreeNodeVal]: t("filter.apps"),
            ...enabled
        },
        snippets: {
            [TreeNodeVal]: t("filter.snippets"),
            ...enabled
        },
        libs: {
            [TreeNodeVal]: CONFIG.showLibs && t("filter.libs")
        }
    });
const libTags = new Set([
    "lib",
    "npm",
    "internal"
]);
const isModLib = (m)=>new Set(m.metadata.tags).intersection(libTags).size > 0;
const enabledFn = {
    enabled: {
        [TreeNodeVal]: (m)=>m.isLoaded()
    }
};
const filterFNs = {
    [TreeNodeVal]: (m)=>CONFIG.showLibs || !isModLib(m),
    themes: {
        [TreeNodeVal]: (m)=>m.metadata.tags.includes("theme"),
        ...enabledFn
    },
    apps: {
        [TreeNodeVal]: (m)=>m.metadata.tags.includes("app"),
        ...enabledFn
    },
    extensions: {
        [TreeNodeVal]: (m)=>m.metadata.tags.includes("extension"),
        ...enabledFn
    },
    snippets: {
        [TreeNodeVal]: (m)=>m.metadata.tags.includes("snippet"),
        ...enabledFn
    },
    libs: {
        [TreeNodeVal]: isModLib
    }
};
export let unselect;
export let refresh;
export default function() {
    const [searchbar, search] = useSearchBar({
        placeholder: t("pages.marketplace.search_modules"),
        expanded: true
    });
    const [sortbox, sortOption] = useDropdown({
        options: SortOptions
    });
    const sortFn = SortFns[sortOption];
    const filters = React.useMemo(getFilters, [
        CONFIG.showLibs
    ]);
    const [chipFilter, selectedFilters] = useChipFilter(filters);
    const getSelectedFilterFNs = ()=>selectedFilters.map(({ key })=>getProp(filterFNs, key));
    const selectedFilterFNs = React.useMemo(getSelectedFilterFNs, [
        selectedFilters
    ]);
    const getModuleInsts = ()=>Object.fromEntries(Module.getAll().flatMap((module)=>{
            const selectedVersion = module.getEnabledVersion() || module.instances.keys().next().value;
            const moduleInst = module.instances.get(selectedVersion);
            return moduleInst ? [
                [
                    module.getIdentifier(),
                    moduleInst
                ]
            ] : [];
        }));
    const [moduleInsts, setModuleInsts] = React.useState(getModuleInsts);
    const moduleCardProps = selectedFilterFNs.reduce((acc, fn)=>acc.filter(fn[TreeNodeVal]), Array.from(Object.values(moduleInsts))).filter((moduleInst)=>{
        const { name, tags, authors } = moduleInst.metadata;
        const searchFiels = [
            name,
            ...tags,
            ...authors
        ];
        return searchFiels.some((f)=>f.toLowerCase().includes(search.toLowerCase()));
    }).sort((a, b)=>sortFn?.(a.metadata, b.metadata));
    const [selectedModule, selectModule] = React.useState(null);
    unselect = ()=>selectModule(null);
    [, refresh] = React.useReducer((n)=>n + 1, 0);
    const panelTarget = document.querySelector("#MarketplacePanel");
    let panel;
    if (selectedModule && panelTarget) {
        panel = ReactDOM.createPortal(/*#__PURE__*/ React.createElement(VersionListContent, {
            module: selectedModule
        }), panelTarget, crypto.randomUUID());
    }
    const { panelSend } = usePanelAPI();
    return /*#__PURE__*/ React.createElement(React.Fragment, null, panel, /*#__PURE__*/ React.createElement("section", {
        className: "contentSpacing"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "marketplace-header items-center flex justify-between pb-2 flex-row z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "marketplace-header__left flex gap-2"
    }, chipFilter), /*#__PURE__*/ React.createElement("div", {
        className: "marketplace-header__right flex gap-2 items-center"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "inline-flex self-center font-bold text-sm"
    }, t("pages.marketplace.sort.label")), sortbox, searchbar, settingsButton)), /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("div", {
        className: "marketplace-grid iKwGKEfAfW7Rkx2_Ba4E soGhxDX6VjS7dBxX9Hbd"
    }, moduleCardProps.map((moduleInst)=>{
        const module = moduleInst.getModule();
        const moduleIdentifier = module.getIdentifier();
        const isSelected = module === selectedModule;
        return /*#__PURE__*/ React.createElement(ModuleCard, {
            key: moduleIdentifier,
            moduleInst: moduleInst,
            isSelected: isSelected,
            selectVersion: (v)=>{
                const mis = {
                    ...moduleInsts,
                    [moduleIdentifier]: module.instances.get(v)
                };
                setModuleInsts(mis);
            },
            onClick: ()=>{
                if (isSelected) {
                    panelSend("panel_close_click_or_collapse");
                } else {
                    if (!selectedModule && hash) {
                        panelSend?.(hash.event);
                    }
                    selectModule(module);
                }
            }
        });
    })))));
}
