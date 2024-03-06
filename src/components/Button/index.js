import { S } from "/modules/Delusoire/std/index.js";
export default function ({ onClick, className, label = "", type = "round", children, disabled = false }) {
    const btnClass = S.classnames("spicetify-marketplace-button", {
        "spicetify-marketplace-circle": type === "circle",
    }, className);
    return (S.React.createElement("button", { className: btnClass, onClick: onClick, "aria-label": label, disabled: disabled }, children));
}
