import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;
import { _ } from "/modules/Delusoire/std/deps.js";
import { t } from "../i18n.js";
import { Module } from "/hooks/module.js";
import { fetchJSON } from "/hooks/util.js";
import ModuleCard from "../components/ModuleCard/index.js";
const cachedMetaURLs = new Map();
const fetchMetaURL = async (metaURL) => {
    const cachedMetadata = cachedMetaURLs.get(metaURL);
    if (cachedMetadata) {
        return cachedMetadata;
    }
    const metadata = await fetchJSON(metaURL);
    cachedMetaURLs.set(metaURL, metadata);
    return metadata;
};
const dummyMetadata = {
    name: "",
    description: "",
    tags: [],
    authors: [],
    preview: "",
};
export const useMetas = (identifiersToMetadataLists) => {
    const updateIdentifiersToMetaURLs = () => _.mapValues(identifiersToMetadataLists, (metaList, identifier) => {
        const module = Module.registry.get(identifier);
        const installed = module !== undefined;
        return installed ? module.getLocalMeta() : metaList[0];
    });
    const updateIdentifiersToMetadatas = () => _.mapValues(identifiersToMetaURLs, (metaURL, identifier) => {
        const module = Module.registry.get(identifier);
        const installed = module !== undefined;
        const isLocalMetadata = installed && metaURL === module.getLocalMeta();
        return isLocalMetadata ? module.metadata : dummyMetadata;
    });
    const [identifiersToMetaURLs, setIdentifiersToMetaURLs] = React.useState(updateIdentifiersToMetaURLs);
    const [identifiersToMetadatas, setIdentifiersToMetadatas] = React.useState(updateIdentifiersToMetadatas);
    React.useEffect(() => {
        const identifiersToMetaURLs = updateIdentifiersToMetaURLs();
        setIdentifiersToMetaURLs(identifiersToMetaURLs);
    }, [identifiersToMetadataLists]);
    React.useEffect(() => {
        const identifiersToMetadatas = updateIdentifiersToMetadatas();
        setIdentifiersToMetadatas(identifiersToMetadatas);
    }, [identifiersToMetaURLs]);
    React.useEffect(() => {
        let expired = false;
        for (const [identifier, metaURL] of Object.entries(identifiersToMetaURLs)) {
            const module = Module.registry.get(identifier);
            const installed = module !== undefined;
            const isLocalMetadata = installed && metaURL === module.getLocalMeta();
            if (!isLocalMetadata) {
                fetchMetaURL(metaURL).then(metadata => {
                    if (expired)
                        return;
                    const identifiersToMetadatasCopy = Object.assign({}, identifiersToMetadatas);
                    identifiersToMetadatasCopy[identifier] = metadata;
                    setIdentifiersToMetadatas(identifiersToMetadatasCopy);
                });
            }
        }
        return () => {
            expired = true;
        };
    }, [identifiersToMetaURLs]);
    return _.mapValues(identifiersToMetadataLists, (_, identifier) => ({
        metadata: identifiersToMetadatas[identifier],
        metaURL: identifiersToMetaURLs[identifier],
        setMetaURL: (metaURL) => setIdentifiersToMetaURLs(identifiersToMetaURLs => Object.assign({}, identifiersToMetaURLs, { [identifier]: metaURL })),
    }));
};
const identifiersToRemoteMetadataURLsLists = await fetchJSON("https://raw.githubusercontent.com/Delusoire/spicetify-marketplace/main/repo.json");
const mergeObjectsWithArraysConcatenated = (a, b) => _.mergeWith(a, b, (objValue, srcValue) => (_.isArray(objValue) ? objValue.concat(srcValue) : undefined));
export default function () {
    const [refreshCount, refresh] = React.useReducer(x => x + 1, 0);
    const identifiersToMetadataURLsLists = React.useMemo(() => {
        const localModules = Module.getModules();
        const identifiersToLocalMetadataURLsLists = Object.fromEntries(localModules.map(module => [module.getIdentifier(), [module.getLocalMeta()]]));
        return mergeObjectsWithArraysConcatenated(identifiersToLocalMetadataURLsLists, identifiersToRemoteMetadataURLsLists);
    }, [refreshCount]);
    const identifiersToMetadataProps = useMetas(identifiersToMetadataURLsLists);
    const propsList = React.useMemo(() => Object.entries(identifiersToMetadataProps).map(([identifier, metadataProps]) => Object.assign({ identifier, showTags: true, metaURLList: identifiersToMetadataURLsLists[identifier] }, metadataProps)), [identifiersToMetadataURLsLists, identifiersToMetadataProps]);
    const [searchbar, search] = useSearchbar();
    return (S.React.createElement("section", { className: "contentSpacing" },
        S.React.createElement("div", { className: "marketplace-header" },
            S.React.createElement("div", { className: "marketplace-header__left" },
                S.React.createElement("h2", { className: "marketplace-header__label" }, t("grid.sort.label"))),
            S.React.createElement("div", { className: "marketplace-header__right" }, searchbar)),
        S.React.createElement(S.React.Fragment, null,
            S.React.createElement("div", { className: "marketplace-grid iKwGKEfAfW7Rkx2_Ba4E soGhxDX6VjS7dBxX9Hbd" }, propsList
                .filter(props => {
                const { metadata } = props;
                const { authors, name, tags } = metadata;
                const searchFiels = [...authors, name, ...tags];
                return searchFiels.some(f => f.toLowerCase().includes(search.toLowerCase()));
            })
                .sort()
                .map(props => (S.React.createElement(ModuleCard, { key: props.identifier, ...props })))))));
}
const Searchbar = ({ value, onChange }) => {
    return (S.React.createElement("div", { className: "searchbar--bar__wrapper" },
        S.React.createElement("input", { className: "searchbar-bar", type: "text", placeholder: `${t("grid.search")} ${t("tabs.modules")}...`, value: value, onChange: event => {
                onChange(event.target.value);
            } })));
};
const useSearchbar = () => {
    const [value, setValue] = React.useState("");
    const searchbar = (S.React.createElement(Searchbar, { value: value, onChange: str => {
            setValue(str);
        } }));
    return [searchbar, value];
};
