import { S } from "/modules/Delusoire/stdlib/index.js";
export default function({ onClick }) {
    return /*#__PURE__*/ S.React.createElement("div", {
        onClick: onClick
    }, /*#__PURE__*/ S.React.createElement("p", {
        style: {
            fontSize: 100,
            lineHeight: "65px"
        }
    }, "»"), /*#__PURE__*/ S.React.createElement("span", {
        style: {
            fontSize: 20
        }
    }, "Load more"));
}
