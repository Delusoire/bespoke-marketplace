import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;
import AuthorsDiv from "./AuthorsDiv.js";
import TagsDiv from "./TagsDiv.js";
import { Module } from "/hooks/module.js";
const History = S.Platform.getHistory();
export default function ({ identifier, metadata, metaURL, setMetaURL, metaURLList, showTags }) {
    const module = Module.registry.get(identifier);
    const installed = module !== undefined;
    const { name, description, tags, authors, preview } = metadata;
    const cardClasses = S.classnames("LunqxlFIupJw_Dkx6mNx", `marketplace-card--${this.props.type}`, {
        "marketplace-card--installed": installed,
    });
    const remoteDir = metaURL.replace(/\/metadata\.json$/, "");
    // TODO: add more important tags
    const importantTags = [installed && "installed"].filter(Boolean);
    // TODO: add metaURLList support
    return (S.React.createElement("div", { className: cardClasses, onClick: () => {
            History.push(`spotify:app:marketplace:${identifier}`);
        } },
        S.React.createElement("div", { className: "XiVwj5uoqqSFpS4cYOC6", draggable: "true" },
            S.React.createElement("div", { className: "xBV4XgMq0gC5lQICFWY_" },
                S.React.createElement("div", { className: "g4PZpjkqEh5g7xDpCr2K" },
                    S.React.createElement("div", null,
                        S.React.createElement("img", { alt: "ur blind haha *points finger*", "aria-hidden": "false", draggable: "false", loading: "lazy", src: preview, className: "mMx2LUixlnN_Fu45JpFB SKJSok3LfyedjZjujmFt", onError: e => {
                                // https://png-pixel.com
                                e.currentTarget.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII");
                                e.currentTarget.closest(".g4PZpjkqEh5g7xDpCr2K")?.classList.add("main-cardImage-imageWrapper--error");
                            } })))),
            S.React.createElement("div", { className: "E1N1ByPFWo4AJLHovIBQ" },
                S.React.createElement("a", { draggable: "false", title: name, className: "Nqa6Cw3RkDMV8QnYreTr", dir: "auto", href: remoteDir, target: "_blank", rel: "noopener noreferrer", onClick: e => e.stopPropagation() },
                    S.React.createElement("div", { className: "nk6UgB4GUYNoAcPtAQaG main-type-balladBold" }, name)),
                S.React.createElement("div", { className: "Za_uNH8nTZ0qCuIqbPLZ main-type-mestoBold marketplace-cardSubHeader" },
                    S.React.createElement(AuthorsDiv, { authors: authors })),
                S.React.createElement("p", { className: "marketplace-card-desc" }, description),
                S.React.createElement("div", { className: "marketplace-card__bottom-meta main-type-mestoBold" },
                    S.React.createElement(TagsDiv, { tags: tags, showTags: showTags, importantTags: importantTags }))))));
}