import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;
import Dropdown from "https://esm.sh/react-dropdown";
export default function (options) {
    const [activeOption, setActiveOption] = React.useState(Object.keys(options)[0]);
    const dropdown = (S.React.createElement("div", { className: "marketplace-sortBox" },
        S.React.createElement("div", { className: "marketplace-sortBox-header" },
            S.React.createElement("div", { className: "marketplace-sortBox-header-title" }),
            S.React.createElement(Dropdown, { placeholder: "Select an option", options: Object.entries(options).map(([value, label]) => ({ value, label })), value: activeOption, onChange: (item) => {
                    setActiveOption(item.value);
                } }))));
    return [dropdown, activeOption, setActiveOption];
}
