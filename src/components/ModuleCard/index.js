import { S } from "/modules/Delusoire/std/index.js";
import AuthorsDiv from "./AuthorsDiv.js";
import TagsDiv from "./TagsDiv.js";
import { useModule } from "../../pages/Module.js";
import Dropdown from "/modules/Delusoire/std/lib/components/Dropdown.js";
const History = S.Platform.getHistory();
const useMetaSelector = ({ metaURL, setMetaURL, metaURLList })=>{
    const prettifyMeta = (metaURL)=>{
        const moduleURL = metaURL.replace(/\/metadata\.json$/, "");
        try {
            const url = new URL(moduleURL);
            switch(url.hostname){
                case "raw.githubusercontent.com":
                    {
                        return `@github: ${url.pathname}`;
                    }
            }
        } catch (e) {
            const match = moduleURL.match(/^\/modules(?<modulePath>\/.*)$/);
            const { modulePath } = match.groups ?? {};
            return `@local: ${modulePath}`;
        }
        return moduleURL;
    };
    const options = Object.fromEntries(metaURLList.map((metaURL)=>[
            metaURL,
            prettifyMeta(metaURL)
        ]));
    const dropdown = /*#__PURE__*/ S.React.createElement("div", {
        className: "min-w-fit"
    }, /*#__PURE__*/ S.React.createElement(Dropdown, {
        options: options,
        activeOption: metaURL,
        onSwitch: (metaURL)=>setMetaURL(metaURL)
    }));
    return dropdown;
};
export default function({ identifier, metadata, metaURL, setMetaURL, metaURLList, showTags }) {
    const { module, installed, enabled, updateEnabled, outdated, localOnly } = useModule(identifier);
    const metaSelector = useMetaSelector({
        metaURL,
        setMetaURL,
        metaURLList
    });
    const { name, description, tags, authors, preview } = metadata;
    const cardClasses = S.classnames("LunqxlFIupJw_Dkx6mNx", {
        "border border-solid": installed,
        "border-[var(--essential-announcement)]": localOnly,
        "border-[var(--essential-warning)]": !localOnly && outdated,
        "border-[var(--essential-bright-accent)]": !localOnly && !outdated && enabled,
        "border-[var(--essential-negative)]": !localOnly && !outdated && !enabled && installed
    });
    const href = metaURL.startsWith("http") ? metaURL : null;
    const previewHref = `${metaURL}/../${preview}`;
    // TODO: add more important tags
    const importantTags = [].filter(Boolean);
    return /*#__PURE__*/ S.React.createElement("div", {
        className: cardClasses
    }, /*#__PURE__*/ S.React.createElement("div", {
        className: "flex flex-col",
        draggable: "true"
    }, /*#__PURE__*/ S.React.createElement("div", null, /*#__PURE__*/ S.React.createElement("div", {
        className: "g4PZpjkqEh5g7xDpCr2K"
    }, /*#__PURE__*/ S.React.createElement("div", {
        onClick: ()=>{
            History.push(`/marketplace/${encodeURIComponent(metaURL)}`);
        },
        style: {
            pointerEvents: "all",
            cursor: "pointer"
        }
    }, /*#__PURE__*/ S.React.createElement("img", {
        alt: "",
        "aria-hidden": "false",
        draggable: "false",
        loading: "lazy",
        src: previewHref,
        className: "SKJSok3LfyedjZjujmFt",
        onError: (e)=>{
            // https://png-pixel.com
            e.currentTarget.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII");
            e.currentTarget.closest(".g4PZpjkqEh5g7xDpCr2K")?.classList.add("main-cardImage-imageWrapper--error");
        }
    })))), /*#__PURE__*/ S.React.createElement("div", {
        className: "flex-grow flex flex-col"
    }, /*#__PURE__*/ S.React.createElement("div", {
        style: {
            display: "flex",
            alignItems: "center",
            flexDirection: "row"
        }
    }, /*#__PURE__*/ S.React.createElement("a", {
        draggable: "false",
        title: name,
        className: "hover:underline",
        dir: "auto",
        href: href,
        target: "_blank",
        rel: "noopener noreferrer",
        onClick: (e)=>e.stopPropagation()
    }, /*#__PURE__*/ S.React.createElement("div", {
        className: "main-type-balladBold"
    }, name)), metaSelector), /*#__PURE__*/ S.React.createElement("div", {
        className: "main-type-mestoBold mt-1 whitespace-normal color-[var(--spice-subtext)] flex flex-col gap-2"
    }, /*#__PURE__*/ S.React.createElement(AuthorsDiv, {
        authors: authors
    })), installed && /*#__PURE__*/ S.React.createElement(S.ReactComponents.SettingToggle, {
        className: "rFFJg1UIumqUUFDgo6n7",
        value: enabled,
        onSelected: (checked)=>{
            if (checked) {
                module.enable();
            } else {
                module.disable();
            }
            updateEnabled();
        }
    }), /*#__PURE__*/ S.React.createElement("p", {
        className: "text-sm my-3 mx-0 overflow-hidden line-clamp-3"
    }, description), /*#__PURE__*/ S.React.createElement("div", {
        className: "text-[var(--spice-subtext)] whitespace-normal main-type-mestoBold mt-auto mb-0 "
    }, /*#__PURE__*/ S.React.createElement(TagsDiv, {
        tags: tags,
        showTags: showTags,
        importantTags: importantTags
    })))));
}
