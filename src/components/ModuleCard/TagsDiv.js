import { t } from "i18next";
import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;
import { MAX_TAGS } from "../../static";
const knownTags = {
    [t("grid.archived")]: "archived",
};
const Tag = (tag) => (S.React.createElement("li", { className: "marketplace-card__tag", draggable: false, "data-tag": knownTags[tag] }, tag));
export default function ({ tags, importantTags, showTags }) {
    const [expanded, setExpanded] = React.useState(false);
    const baseTags = [importantTags, showTags && tags].flat();
    let extraTags = new Array();
    // If there are more than one extra tags, slice them and add an expand button
    if (baseTags.length - MAX_TAGS > 1) {
        extraTags = baseTags.splice(MAX_TAGS);
    }
    return (S.React.createElement("div", { className: "marketplace-card__tags-container" },
        S.React.createElement("ul", { className: "marketplace-card__tags" },
            baseTags.map(Tag),
            expanded && extraTags.map(Tag)),
        !expanded && extraTags.length && (S.React.createElement("button", { className: "marketplace-card__tags-more-btn", onClick: e => {
                e.stopPropagation();
                setExpanded(true);
            } }, "..."))));
}
