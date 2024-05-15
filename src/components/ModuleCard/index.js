import { React } from "/modules/official/stdlib/src/expose/React.js";
import AuthorsDiv from "./AuthorsDiv.js";
import TagsDiv from "./TagsDiv.js";
import { startCase } from "/modules/official/stdlib/deps.js";
import Dropdown from "/modules/official/stdlib/lib/components/Dropdown.js";
import { useUpdate } from "../../util/index.js";
import { fetchJSON } from "/hooks/util.js";
import { Platform } from "/modules/official/stdlib/src/expose/Platform.js";
import { Cards, ScrollableText, SettingToggle } from "/modules/official/stdlib/src/webpack/ReactComponents.js";
import { classnames } from "/modules/official/stdlib/src/webpack/ClassNames.js";
import { useQuery } from "/modules/official/stdlib/src/webpack/ReactQuery.js";
const History = Platform.getHistory();
const useLoadableModuleSelector = ({ moduleInst, setModuleInst: setLoadableModule })=>{
    const parseMeta = (metaURL)=>{
        const moduleURL = metaURL.replace(/\/metadata\.json$/, "");
        {
            const match = moduleURL.match(/^\/modules(?<modulePath>\/.*)$/);
            if (match) {
                const { modulePath } = match.groups ?? {};
                return {
                    type: "local",
                    path: modulePath
                };
            }
        }
        try {
            const url = new URL(moduleURL);
            switch(url.hostname){
                case "raw.githubusercontent.com":
                    {
                        return {
                            type: "github",
                            path: url.pathname
                        };
                    }
            }
        } catch (_) {}
        return {
            type: "unknown",
            path: moduleURL
        };
    };
    const prettifyMeta = (moduleInst)=>()=>{
            const remote = moduleInst.getRemote();
            if (!remote) {
                return;
            }
            const { type, path } = parseMeta(remote);
            const { version } = moduleInst.metadata;
            return /*#__PURE__*/ React.createElement(ScrollableText, {
                title: `@${type}: ${path}`
            }, version);
        };
    const instances = moduleInst.getModule().instances;
    const options = Object.fromEntries(Array.from(instances.entries()).map(([k, v])=>[
            k,
            prettifyMeta(v)
        ]));
    const dropdown = /*#__PURE__*/ React.createElement("div", {
        className: "min-w-fit"
    }, /*#__PURE__*/ React.createElement(Dropdown, {
        options: options,
        activeOption: moduleInst.getVersion(),
        onSwitch: (version)=>setLoadableModule(instances.get(version))
    }));
    return dropdown;
};
const fallbackImage = ()=>/*#__PURE__*/ React.createElement("svg", {
        "data-encore-id": "icon",
        role: "img",
        "aria-hidden": "true",
        "data-testid": "card-image-fallback",
        viewBox: "0 0 24 24",
        className: "fill-current",
        style: {
            width: "64px",
            height: "64px"
        }
    }, /*#__PURE__*/ React.createElement("path", {
        d: "M20.929,1.628A1,1,0,0,0,20,1H4a1,1,0,0,0-.929.628l-2,5A1.012,1.012,0,0,0,1,7V22a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V7a1.012,1.012,0,0,0-.071-.372ZM4.677,3H19.323l1.2,3H3.477ZM3,21V8H21V21Zm8-3a1,1,0,0,1-1,1H6a1,1,0,0,1,0-2h4A1,1,0,0,1,11,18Z"
    }));
export default function({ moduleInst: initialModuleInst, showTags }) {
    const [moduleInst, setModuleInst] = React.useState(initialModuleInst);
    const moduleInstSelector = useLoadableModuleSelector({
        moduleInst,
        setModuleInst
    });
    const isEnabled = ()=>moduleInst.isLoaded();
    const [enabled, updateEnabled] = useUpdate(isEnabled);
    const installed = moduleInst.isInstalled();
    const hasRemote = Boolean(moduleInst.remotes.length);
    const outdated = installed && hasRemote && false;
    const { data, isSuccess } = useQuery({
        queryKey: [
            "moduleCard",
            moduleInst.getRemote()
        ],
        queryFn: ()=>fetchJSON(moduleInst.getRemote()),
        enabled: moduleInst.metadata.isDummy && hasRemote
    });
    if (isSuccess) {
        moduleInst.updateMetadata(data);
    }
    const { name, description, tags, authors, preview } = moduleInst.metadata;
    const cardClasses = classnames("main-card-card", {
        "border-[var(--essential-warning)]": outdated
    });
    const externalHref = moduleInst.getRemote();
    const metadataURL = installed ? moduleInst.getRelPath("metadata.json") : externalHref;
    const previewHref = `${metadataURL}/../${preview}`;
    // TODO: add more important tags
    const importantTags = [].filter(Boolean);
    return /*#__PURE__*/ React.createElement("div", {
        className: cardClasses
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col h-full",
        draggable: "true"
    }, /*#__PURE__*/ React.createElement("div", {
        onClick: ()=>{
            History.push(`/bespoke/marketplace/${encodeURIComponent(metadataURL)}`);
        },
        style: {
            pointerEvents: "all",
            cursor: "pointer",
            marginBottom: "16px"
        }
    }, /*#__PURE__*/ React.createElement(Cards.CardImage, {
        images: [
            {
                url: previewHref
            }
        ],
        FallbackComponent: fallbackImage
    })), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col gap-2 flex-grow"
    }, /*#__PURE__*/ React.createElement("a", {
        draggable: "false",
        title: name,
        className: "hover:underline",
        dir: "auto",
        href: externalHref,
        target: "_blank",
        rel: "noopener noreferrer",
        onClick: (e)=>e.stopPropagation()
    }, /*#__PURE__*/ React.createElement("div", {
        className: "main-type-balladBold"
    }, startCase(name))), /*#__PURE__*/ React.createElement("div", {
        className: "text-sm mx-0 whitespace-normal color-[var(--spice-subtext)] flex flex-col gap-2"
    }, /*#__PURE__*/ React.createElement(AuthorsDiv, {
        authors: authors
    })), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm mx-0 overflow-hidden line-clamp-3 mb-auto"
    }, description || "No description for this package"), /*#__PURE__*/ React.createElement("div", {
        className: "text-[var(--spice-subtext)] whitespace-normal main-type-mestoBold"
    }, /*#__PURE__*/ React.createElement(TagsDiv, {
        tags: tags,
        showTags: showTags,
        importantTags: importantTags
    })), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between"
    }, moduleInstSelector, installed && /*#__PURE__*/ React.createElement(SettingToggle, {
        className: "x-settings-button justify-end",
        value: enabled,
        onSelected: async (checked)=>{
            const hasChanged = checked ? moduleInst.load() : moduleInst.unload();
            if (await hasChanged) {
                updateEnabled();
            }
        }
    })))));
}
