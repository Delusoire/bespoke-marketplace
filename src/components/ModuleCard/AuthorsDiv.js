import { S } from "/modules/Delusoire/std/index.js";
export default function({ authors }) {
    return /*#__PURE__*/ S.React.createElement("div", {
        className: "marketplace-card__authors"
    }, authors.map((author, index)=>/*#__PURE__*/ S.React.createElement("a", {
            title: author,
            className: "marketplace-card__author",
            href: `https://github.com/${author}`,
            draggable: "false",
            dir: "auto",
            target: "_blank",
            rel: "noopener noreferrer",
            onClick: (e)=>e.stopPropagation(),
            key: index
        }, author)));
}
