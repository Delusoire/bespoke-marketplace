import { S } from "/modules/Delusoire/stdlib/index.js";
import { t } from "../../i18n.js";
const knownTags = {
    [t("module.archived")]: "archived"
};
const Tag = (tag)=>/*#__PURE__*/ S.React.createElement("li", {
        className: "bg-[var(--spice-tab-active)] rounded pt-0 pb-1 px-2",
        draggable: false,
        "data-tag": knownTags[tag]
    }, tag);
export default function({ tags, importantTags, showTags }) {
    const baseTags = [
        importantTags,
        showTags && tags.filter((tag)=>![
                "theme",
                "app",
                "extension",
                "snippet",
                "lib"
            ].includes(tag))
    ].flat();
    return /*#__PURE__*/ S.React.createElement(S.ReactComponents.ScrollableContainer, null, /*#__PURE__*/ S.React.createElement("ul", {
        className: "flex gap-2 text-sm"
    }, baseTags.map(Tag)));
}
