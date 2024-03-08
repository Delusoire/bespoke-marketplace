import { S } from "/modules/Delusoire/std/index.js";
import AuthorsDiv from "./AuthorsDiv.js";
import TagsDiv from "./TagsDiv.js";
import { useModule } from "../../pages/Module.js";
const History = S.Platform.getHistory();
export default function ({ identifier, metadata, metaURL, setMetaURL, metaURLList, showTags }) {
    // TODO: add visual indicators for these
    const { installed, enabled, outdated, localOnly } = useModule(identifier);
    const { name, description, tags, authors, preview } = metadata;
    const cardClasses = S.classnames("main-card-card", {
        "marketplace-card--installed": installed,
    });
    // TODO: add more important tags
    const importantTags = [installed && "installed"].filter(Boolean);
    // TODO: add metaURLList support
    return (S.React.createElement("div", { className: cardClasses, onClick: () => {
            History.push(`/marketplace/${encodeURIComponent(metaURL)}`);
        } },
        S.React.createElement("div", { className: "main-card-draggable", draggable: "true" },
            S.React.createElement("div", { className: "main-card-imageContainer" },
                S.React.createElement("div", { className: "main-cardImage-imageWrapper" },
                    S.React.createElement("div", null,
                        S.React.createElement("img", { alt: "ur blind haha *points finger*", "aria-hidden": "false", draggable: "false", loading: "lazy", src: preview, className: "main-image-image main-cardImage-image", onError: e => {
                                // https://png-pixel.com
                                e.currentTarget.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII");
                                e.currentTarget.closest(".main-cardImage-imageWrapper")?.classList.add("main-cardImage-imageWrapper--error");
                            } })))),
            S.React.createElement("div", { className: "main-card-cardMetadata" },
                S.React.createElement("a", { draggable: "false", title: name, className: "main-cardHeader-link", dir: "auto", href: metaURL, target: "_blank", rel: "noopener noreferrer", onClick: e => e.stopPropagation() },
                    S.React.createElement("div", { className: "main-cardHeader-text main-type-balladBold" }, name)),
                S.React.createElement("div", { className: "main-cardSubHeader-root main-type-mestoBold marketplace-cardSubHeader" },
                    S.React.createElement(AuthorsDiv, { authors: authors })),
                S.React.createElement("p", { className: "marketplace-card-desc" }, description),
                S.React.createElement("div", { className: "marketplace-card__bottom-meta main-type-mestoBold" },
                    S.React.createElement(TagsDiv, { tags: tags, showTags: showTags, importantTags: importantTags }))))));
}
