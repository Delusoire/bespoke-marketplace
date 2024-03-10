import { S } from "/modules/Delusoire/std/index.js";
import AuthorsDiv from "./AuthorsDiv.js";
import TagsDiv from "./TagsDiv.js";
import { useModule } from "../../pages/Module.js";
import Dropdown from "/modules/Delusoire/std/api/components/Dropdown.js";
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
    const dropdown = /*#__PURE__*/ S.React.createElement(Dropdown, {
        options: options,
        activeOption: metaURL,
        onSwitch: (metaURL)=>setMetaURL(metaURL)
    });
    return dropdown;
};
export default function({ identifier, metadata, metaURL, setMetaURL, metaURLList, showTags }) {
    const { installed, enabled, outdated, localOnly } = useModule(identifier);
    const metaSelector = useMetaSelector({
        metaURL,
        setMetaURL,
        metaURLList
    });
    const { name, description, tags, authors, preview } = metadata;
    const cardClasses = S.classnames("LunqxlFIupJw_Dkx6mNx", {
        "marketplace-card--localOnly": localOnly,
        "marketplace-card--outdated": !localOnly && outdated,
        "marketplace-card--enabled": !localOnly && !outdated && enabled,
        "marketplace-card--disabled": !localOnly && !outdated && !enabled && installed
    });
    const href = metaURL.startsWith("http") ? metaURL : null;
    const previewHref = `${metaURL}/../${preview}`;
    // TODO: add more important tags
    const importantTags = [].filter(Boolean);
    return /*#__PURE__*/ S.React.createElement("div", {
        className: cardClasses
    }, /*#__PURE__*/ S.React.createElement("div", {
        className: "XiVwj5uoqqSFpS4cYOC6",
        draggable: "true"
    }, /*#__PURE__*/ S.React.createElement("div", {
        className: "xBV4XgMq0gC5lQICFWY_"
    }, /*#__PURE__*/ S.React.createElement("div", {
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
        alt: "ur blind haha *points finger*",
        "aria-hidden": "false",
        draggable: "false",
        loading: "lazy",
        src: previewHref,
        className: "mMx2LUixlnN_Fu45JpFB SKJSok3LfyedjZjujmFt",
        onError: (e)=>{
            // https://png-pixel.com
            e.currentTarget.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII");
            e.currentTarget.closest(".g4PZpjkqEh5g7xDpCr2K")?.classList.add("main-cardImage-imageWrapper--error");
        }
    })))), /*#__PURE__*/ S.React.createElement("div", {
        className: "E1N1ByPFWo4AJLHovIBQ"
    }, /*#__PURE__*/ S.React.createElement("div", {
        style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row"
        }
    }, /*#__PURE__*/ S.React.createElement("a", {
        draggable: "false",
        title: name,
        className: "Nqa6Cw3RkDMV8QnYreTr",
        dir: "auto",
        href: href,
        target: "_blank",
        rel: "noopener noreferrer",
        onClick: (e)=>e.stopPropagation()
    }, /*#__PURE__*/ S.React.createElement("div", {
        className: "nk6UgB4GUYNoAcPtAQaG main-type-balladBold"
    }, name)), metaSelector), /*#__PURE__*/ S.React.createElement("div", {
        className: "Za_uNH8nTZ0qCuIqbPLZ main-type-mestoBold marketplace-cardSubHeader"
    }, /*#__PURE__*/ S.React.createElement(AuthorsDiv, {
        authors: authors
    })), /*#__PURE__*/ S.React.createElement("p", {
        className: "marketplace-card-desc"
    }, description), /*#__PURE__*/ S.React.createElement("div", {
        className: "marketplace-card__bottom-meta main-type-mestoBold"
    }, /*#__PURE__*/ S.React.createElement(TagsDiv, {
        tags: tags,
        showTags: showTags,
        importantTags: importantTags
    })))));
}
