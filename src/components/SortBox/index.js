import { S } from "/modules/Delusoire/std/index.js";
import Dropdown from "https://esm.sh/react-dropdown";
export default function ({ options, onChange, selectedOption }) {
    return (S.React.createElement("div", { className: "marketplace-sortBox" },
        S.React.createElement("div", { className: "marketplace-sortBox-header" },
            S.React.createElement("div", { className: "marketplace-sortBox-header-title" }),
            S.React.createElement(Dropdown, { placeholder: "Select an option", options: options.map(item => ({
                    value: item.key,
                    label: item.value,
                })), value: selectedOption, onChange: (item) => {
                    onChange(item.value);
                } }))));
}
