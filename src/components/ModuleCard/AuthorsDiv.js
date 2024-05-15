import { React } from "/modules/official/stdlib/src/expose/React.js";
export default function({ authors }) {
    return /*#__PURE__*/ React.createElement("div", {
        className: ""
    }, authors.map((author, index)=>/*#__PURE__*/ React.createElement("a", {
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
