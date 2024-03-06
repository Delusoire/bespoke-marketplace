import { S } from "/modules/Delusoire/std/index.js";
export default function (props) {
    // Add a div with author links inside
    const authorsDiv = (S.React.createElement("div", { className: "marketplace-card__authors" }, props.authors.map((author, index) => {
        return (S.React.createElement("a", { title: author.name, className: "marketplace-card__author", href: author.url, draggable: "false", dir: "auto", target: "_blank", rel: "noopener noreferrer", onClick: e => e.stopPropagation(), key: index }, author.name));
    })));
    return authorsDiv;
}
