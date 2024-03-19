import { S } from "/modules/Delusoire/stdlib/index.js";
const { React } = S;
import { _ } from "/modules/Delusoire/stdlib/deps.js";
import { t } from "../i18n.js";
import { Module } from "/hooks/module.js";
import { fetchJSON } from "/hooks/util.js";
import ModuleCard from "../components/ModuleCard/index.js";
import { settingsButton } from "../../index.js";
import { useDropdown } from "/modules/Delusoire/stdlib/lib/components/index.js";
import { getProp, useChipFilter } from "../components/ChipFilter/index.js";
const cachedMetaURLs = new Map();
export const fetchMetaURLSync = (metaURL)=>cachedMetaURLs.get(metaURL);
export const fetchMetaURL = async (metaURL)=>{
    const cachedMetadata = fetchMetaURLSync(metaURL);
    if (cachedMetadata) {
        return cachedMetadata;
    }
    const metadata = await fetchJSON(metaURL);
    cachedMetaURLs.set(metaURL, metadata);
    return metadata;
};
const dummyMetadata = {
    name: "",
    tags: [],
    preview: "",
    version: "",
    authors: [],
    description: "",
    readme: "",
    entries: {
        js: false,
        css: false,
        mixin: false
    },
    dependencies: []
};
export const useMetas = (identifiersToMetadataLists)=>{
    const updateIdentifiersToMetaURLs = ()=>_.mapValues(identifiersToMetadataLists, (metaList, identifier)=>{
            const module = Module.registry.get(identifier);
            const installed = module !== undefined;
            return installed ? module.getLocalMeta() : metaList[0];
        });
    const updateIdentifiersToMetadatas = ()=>_.mapValues(identifiersToMetaURLs, (metaURL, identifier)=>{
            const module = Module.registry.get(identifier);
            const installed = module !== undefined;
            const isLocalMetadata = installed && metaURL === module.getLocalMeta();
            return isLocalMetadata ? module.metadata : dummyMetadata;
        });
    const [identifiersToMetaURLs, setIdentifiersToMetaURLs] = React.useState(updateIdentifiersToMetaURLs);
    const [identifiersToMetadatas, setIdentifiersToMetadatas] = React.useState(updateIdentifiersToMetadatas);
    React.useEffect(()=>{
        const identifiersToMetaURLs = updateIdentifiersToMetaURLs();
        setIdentifiersToMetaURLs(identifiersToMetaURLs);
    }, [
        identifiersToMetadataLists
    ]);
    React.useEffect(()=>{
        const identifiersToMetadatas = updateIdentifiersToMetadatas();
        setIdentifiersToMetadatas(identifiersToMetadatas);
    }, [
        identifiersToMetaURLs
    ]);
    React.useEffect(()=>{
        let expired = false;
        for (const [identifier, metaURL] of Object.entries(identifiersToMetaURLs)){
            const module = Module.registry.get(identifier);
            const installed = module !== undefined;
            const isLocalMetadata = installed && metaURL === module.getLocalMeta();
            if (!isLocalMetadata) {
                fetchMetaURL(metaURL).then((metadata)=>{
                    if (expired) return;
                    const identifiersToMetadatasCopy = Object.assign({}, identifiersToMetadatas);
                    identifiersToMetadatasCopy[identifier] = metadata;
                    setIdentifiersToMetadatas(identifiersToMetadatasCopy);
                });
            }
        }
        return ()=>{
            expired = true;
        };
    }, [
        identifiersToMetaURLs
    ]);
    return _.mapValues(identifiersToMetadataLists, (_, identifier)=>({
            metadata: identifiersToMetadatas[identifier],
            metaURL: identifiersToMetaURLs[identifier],
            setMetaURL: (metaURL)=>setIdentifiersToMetaURLs((identifiersToMetaURLs)=>Object.assign({}, identifiersToMetaURLs, {
                        [identifier]: metaURL
                    }))
        }));
};
const Searchbar = ({ value, onChange })=>{
    return /*#__PURE__*/ S.React.createElement("div", {
        className: "flex flex-col flex-grow items-end"
    }, /*#__PURE__*/ S.React.createElement("input", {
        className: "!bg-[var(--backdrop)] border-[var(--spice-sidebar)] !text-[var(--spice-text)] border-solid h-8 py-2 px-3 rounded-lg",
        type: "text",
        placeholder: `${t("pages.marketplace.search")} ${t("pages.marketplace.modules")}...`,
        value: value,
        onChange: (event)=>{
            onChange(event.target.value);
        }
    }));
};
const useSearchbar = ()=>{
    const [value, setValue] = React.useState("");
    const searchbar = /*#__PURE__*/ S.React.createElement(Searchbar, {
        value: value,
        onChange: (str)=>{
            setValue(str);
        }
    });
    return [
        searchbar,
        value
    ];
};
const identifiersToRemoteMetadataURLsLists = await fetchJSON("https://raw.githubusercontent.com/Delusoire/spicetify-marketplace/main/repo.json");
const mergeObjectsWithArraysConcatenated = (a, b)=>_.mergeWith(a, b, (objValue, srcValue)=>_.isArray(objValue) ? objValue.concat(srcValue) : undefined);
const SortOptions = {
    default: ()=>t("sort.default"),
    "a-z": ()=>t("sort.a-z"),
    "z-a": ()=>t("sort.z-a")
};
const SortFns = {
    default: undefined,
    "a-z": (a, b)=>b.name > a.name ? 1 : a.name > b.name ? -1 : 0,
    "z-a": (a, b)=>a.name > b.name ? 1 : b.name > a.name ? -1 : 0
};
export default function() {
    const [refreshCount, refresh] = React.useReducer((x)=>x + 1, 0);
    const identifiersToMetadataURLsLists = React.useMemo(()=>{
        const localModules = Module.getModules();
        const identifiersToLocalMetadataURLsLists = Object.fromEntries(localModules.map((module)=>[
                module.getIdentifier(),
                [
                    module.getLocalMeta()
                ]
            ]));
        return mergeObjectsWithArraysConcatenated(identifiersToLocalMetadataURLsLists, identifiersToRemoteMetadataURLsLists);
    }, [
        refreshCount
    ]);
    const identifiersToMetadataProps = useMetas(identifiersToMetadataURLsLists);
    const propsList = React.useMemo(()=>Object.entries(identifiersToMetadataProps).map(([identifier, metadataProps])=>Object.assign({
                identifier,
                showTags: true,
                metaURLList: identifiersToMetadataURLsLists[identifier]
            }, metadataProps)), [
        identifiersToMetadataURLsLists,
        identifiersToMetadataProps
    ]);
    const [sortbox, sortOption] = useDropdown({
        options: SortOptions
    });
    const sortFn = SortFns[sortOption];
    const [searchbar, search] = useSearchbar();
    const filters = {
        extensions: {
            "": t("Extensions")
        },
        themes: {
            "": t("Themes"),
            random: {
                "": t("Random")
            }
        }
    };
    const filterFNs = {
        "": ()=>true,
        extensions: {
            "": (mod)=>mod.metadata.tags.includes("extension")
        },
        themes: {
            "": (mod)=>mod.metadata.tags.includes("theme"),
            random: {
                "": ()=>Math.round(Math.random())
            }
        }
    };
    const [chipFilter, selectedFilters] = useChipFilter(filters);
    return /*#__PURE__*/ S.React.createElement("section", {
        className: "contentSpacing"
    }, /*#__PURE__*/ S.React.createElement("div", {
        className: "marketplace-header items-center flex justify-between pb-2 flex-row top-16 z-10"
    }, /*#__PURE__*/ S.React.createElement("div", {
        className: "marketplace-header__left flex gap-2"
    }, /*#__PURE__*/ S.React.createElement("h2", {
        className: "inline-flex self-center"
    }, t("pages.marketplace.sort.label")), sortbox, chipFilter), /*#__PURE__*/ S.React.createElement("div", {
        className: "marketplace-header__right flex gap-2"
    }, searchbar, settingsButton)), /*#__PURE__*/ S.React.createElement(S.React.Fragment, null, /*#__PURE__*/ S.React.createElement("div", {
        className: "marketplace-grid iKwGKEfAfW7Rkx2_Ba4E soGhxDX6VjS7dBxX9Hbd"
    }, selectedFilters.reduce((acc, { key })=>acc.filter(getProp(filterFNs, key)), propsList).filter((props)=>{
        const { metadata } = props;
        const { name, tags, authors } = metadata;
        const searchFiels = [
            name,
            ...tags,
            ...authors
        ];
        return searchFiels.some((f)=>f.toLowerCase().includes(search.toLowerCase()));
    }).sort((a, b)=>sortFn?.(a.metadata, b.metadata)).map((props)=>/*#__PURE__*/ S.React.createElement(ModuleCard, {
            key: props.identifier,
            ...props
        })))));
}
