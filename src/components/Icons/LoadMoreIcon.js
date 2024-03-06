import { S } from "/modules/Delusoire/std/index.js";
export default function ({ onClick }) {
    return (S.React.createElement("div", { onClick: onClick },
        S.React.createElement("p", { style: {
                fontSize: 100,
                lineHeight: "65px",
            } }, "\u00BB"),
        S.React.createElement("span", { style: {
                fontSize: 20,
            } }, "Load more")));
}
