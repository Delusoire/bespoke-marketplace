import { React } from "/modules/official/stdlib/src/expose/React.js";
import { ReactDOM } from "/modules/official/stdlib/src/webpack/React.js";
import Button from "../components/Button/index.js";
import LoadingIcon from "../components/Icons/LoadingIcon.js";
import TrashIcon from "../components/Icons/TrashIcon.js";
import { t } from "../i18n.js";
import { renderMarkdown } from "../api/github.js";
import { logger } from "../../index.js";
import { Module } from "/hooks/module.js";
import { fetchJSON } from "/hooks/util.js";
import { useUpdate } from "../util/index.js";
import { useQuery, useSuspenseQuery } from "/modules/official/stdlib/src/webpack/ReactQuery.js";
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
    return /*#__PURE__*/ React.createElement("div", {
        ref: node
    }, root && /*#__PURE__*/ React.createElement(ShadowContent, {
        root: root
    }, children));
};
const RemoteMarkdown = React.memo(({ url })=>{
    const { status, error, data: markdown } = useQuery({
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
                return /*#__PURE__*/ React.createElement("footer", {
                    className: "m-auto text-center"
                }, /*#__PURE__*/ React.createElement(LoadingIcon, null));
            }
        case "success":
            {
                return /*#__PURE__*/ React.createElement(ShadowRoot, {
                    mode: "open",
                    delegatesFocus: true,
                    styleSheets: []
                }, /*#__PURE__*/ React.createElement("style", null, '@import "https://cdn.jsdelivr.xyz/npm/water.css@2/out/water.css";'), /*#__PURE__*/ React.createElement("div", {
                    id: "module-readme",
                    className: "select-text",
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
export default function({ aurl }) {
    const murl = aurl.replace(/\.zip$/, ".metadata.json");
    const { data: metadata } = useSuspenseQuery({
        queryKey: [
            "modulePage",
            murl
        ],
        queryFn: ()=>fetchJSON(murl)
    });
    // !
    const author = metadata.authors[0];
    const name = metadata.name;
    const moduleIdentifier = `${author}/${name}`;
    const getModuleInst = React.useCallback(()=>{
        const module = Module.get(moduleIdentifier);
        const moduleInst = module?.instances.get(metadata.version);
        return {
            module,
            moduleInst
        };
    }, [
        moduleIdentifier,
        metadata.version
    ]);
    const [{ moduleInst }, _, updateModuleInst] = useUpdate(getModuleInst);
    const installed = moduleInst?.isInstalled();
    const outdated = installed && false;
    const label = t(installed ? "pages.module.remove" : "pages.module.install");
    const Button = installed && !outdated ? TrashButton : DownloadButton;
    return /*#__PURE__*/ React.createElement("section", {
        className: "contentSpacing"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "marketplace-header items-center flex justify-between pb-2 flex-row z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "marketplace-header__left flex gap-2"
    }, /*#__PURE__*/ React.createElement("h1", null, t("pages.module.title"))), /*#__PURE__*/ React.createElement("div", {
        className: "marketplace-header__right flex gap-2"
    }, /*#__PURE__*/ React.createElement(Button, {
        label: label,
        moduleInst: moduleInst,
        metadata: metadata,
        onUpdate: updateModuleInst
    }))), /*#__PURE__*/ React.createElement(RemoteMarkdown, {
        url: readmeURL
    }));
}
const TrashButton = (props)=>{
    return /*#__PURE__*/ React.createElement(Button, {
        label: props.label,
        onClick: async (e)=>{
            e.preventDefault();
            if (await props.moduleInst.remove()) {
                props.onUpdate();
            }
        }
    }, /*#__PURE__*/ React.createElement(TrashIcon, null), props.label);
};
const DownloadButton = (props)=>{
    return /*#__PURE__*/ React.createElement(Button, {
        label: props.label,
        onClick: async (e)=>{
            e.preventDefault();
            const module = Module.getOrCreate(`${props.metadata.authors[0]}/${props.metadata.name}`);
            const moduleInst = await module.getInstanceOrCreate(props.metadata.version);
            if (await moduleInst.add()) {
                props.onUpdate();
            }
        }
    }, /*#__PURE__*/ React.createElement(TrashIcon, null), props.label);
};
