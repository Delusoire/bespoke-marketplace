import { S } from "/modules/Delusoire/std/index.js";
const { React, ReactDOM } = S;
import Button from "../components/Button/index.js";
import DownloadIcon from "../components/icons/DownloadIcon.js";
import LoadingIcon from "../components/icons/LoadingIcon.js";
import TrashIcon from "../components/icons/TrashIcon.js";
import { t } from "../i18n.js";
import { renderMarkdown } from "../api/github.js";
import { logger } from "../index.js";
import { Module, ModuleManager } from "/hooks/module.js";
import { fetchJSON } from "/hooks/util.js";
import { fetchMetaURL } from "./Marketplace.js";
const ShadowContent = ({ root, children })=>ReactDOM.createPortal(children, root);
const ShadowRoot = ({ mode, delegatesFocus, styleSheets, children })=>{
    const node = React.useRef(null);
    const [root, setRoot] = React.useState(null);
    React.useLayoutEffect(()=>{
        if (node.current) {
            const root = node.current.attachShadow({
                mode,
                delegatesFocus
            });
            if (styleSheets.length > 0) {
                root.adoptedStyleSheets = styleSheets;
            }
            setRoot(root);
        }
    }, [
        node,
        styleSheets
    ]);
    return /*#__PURE__*/ S.React.createElement("div", {
        ref: node
    }, root && /*#__PURE__*/ S.React.createElement(ShadowContent, {
        root: root
    }, children));
};
const RemoteMarkdown = React.memo(({ url })=>{
    const { status, error, data: markdown } = S.ReactQuery.useQuery({
        queryKey: [
            "markdown",
            url
        ],
        queryFn: ()=>fetch(url).then((res)=>res.text()).then((markdown)=>renderMarkdown(markdown))
    });
    const fixRelativeImports = (markdown)=>markdown.replace(/(src|href)="\.\//g, `$1="${url}/../`);
    switch(status){
        case "pending":
            {
                return /*#__PURE__*/ S.React.createElement("footer", {
                    className: "marketplace-footer"
                }, /*#__PURE__*/ S.React.createElement(LoadingIcon, null));
            }
        case "success":
            {
                return /*#__PURE__*/ S.React.createElement(ShadowRoot, {
                    mode: "open",
                    delegatesFocus: true,
                    styleSheets: []
                }, /*#__PURE__*/ S.React.createElement("style", null, '@import "https://cdn.jsdelivr.xyz/npm/water.css@2/out/water.css";'), /*#__PURE__*/ S.React.createElement("div", {
                    id: "marketplace-readme",
                    className: "marketplace-readme__container",
                    dangerouslySetInnerHTML: {
                        __html: fixRelativeImports(markdown)
                    }
                }));
            }
        case "error":
            {
                logger.error(error);
                return "Something went wrong.";
            }
    }
});
export const useModule = (identifier)=>{
    const updateModule = ()=>Module.registry.get(identifier);
    const [module, setModule] = React.useState(updateModule);
    React.useEffect(()=>{
        const module = updateModule();
        setModule(module);
    }, [
        identifier
    ]);
    const installed = module !== undefined;
    const enabled = installed && module.isEnabled();
    const [outdated, setOutdated] = React.useState(false);
    const localOnly = installed && module.remoteMetadataURL === undefined;
    React.useEffect(()=>{
        let expired = false;
        const updateOutdated = async (remoteMetadataURL)=>{
            const remoteMetadata = await fetchMetaURL(remoteMetadataURL);
            if (expired) {
                return;
            }
            const outdated = module.metadata.version !== remoteMetadata.version;
            setOutdated(outdated);
        };
        if (installed && !localOnly) {
            updateOutdated(module.remoteMetadataURL);
        }
        return ()=>{
            expired = true;
        };
    }, [
        module
    ]);
    return {
        module,
        setModule,
        installed,
        enabled,
        outdated,
        localOnly
    };
};
export default function({ murl }) {
    const { data: metadata } = S.ReactQuery.useSuspenseQuery({
        queryKey: [
            "modulePage",
            murl
        ],
        queryFn: ()=>fetchJSON(murl)
    });
    const identifier = `${metadata.authors[0]}/${metadata.name}`;
    // TODO: add visual indicator & toggle for enabled
    const { module, setModule, installed, enabled, outdated, localOnly } = useModule(identifier);
    const readmeURL = `${murl}/../${metadata.readme}`;
    const label = t(installed ? "pages.module.remove" : "pages.module.install");
    const installedAndUpdated = installed && !outdated;
    return /*#__PURE__*/ S.React.createElement("section", {
        className: "contentSpacing"
    }, /*#__PURE__*/ S.React.createElement("div", {
        className: "marketplace-header"
    }, /*#__PURE__*/ S.React.createElement("div", {
        className: "marketplace-header__left"
    }, /*#__PURE__*/ S.React.createElement("h1", null, t("pages.module.title"))), /*#__PURE__*/ S.React.createElement("div", {
        className: "marketplace-header__right"
    }, !localOnly && /*#__PURE__*/ S.React.createElement(Button, {
        className: "marketplace-header__button",
        onClick: (e)=>{
            e.preventDefault();
            // TODO: these are optimistic updates, they may cause de-sync
            if (installedAndUpdated) {
                module.dispose(true);
                setModule(undefined);
            } else {
                ModuleManager.add(murl);
                const module = new Module(metadata, `/modules/${identifier}/metadata.json`, murl, false);
                setModule(module);
            }
        },
        label: label
    }, installedAndUpdated ? /*#__PURE__*/ S.React.createElement(TrashIcon, null) : /*#__PURE__*/ S.React.createElement(DownloadIcon, null), " ", label))), /*#__PURE__*/ S.React.createElement(RemoteMarkdown, {
        url: readmeURL
    }));
}
