import { S } from "/modules/official/stdlib/index.js";
const { React } = S;
export const Searchbar = ({ value, onChange, placeholder }) => {
	return /*#__PURE__*/ S.React.createElement(
		"div",
		{
			className: "flex flex-col flex-grow items-end",
		},
		/*#__PURE__*/ S.React.createElement("input", {
			className: "!bg-[var(--backdrop)] border-[var(--spice-sidebar)] !text-[var(--spice-text)] border-solid h-8 py-2 px-3 rounded-lg",
			type: "text",
			placeholder: placeholder,
			value: value,
			onChange: event => {
				onChange(event.target.value);
			},
		}),
	);
};
export const useSearchbar = placeholder => {
	const [value, setValue] = React.useState("");
	const searchbar = /*#__PURE__*/ S.React.createElement(Searchbar, {
		value: value,
		onChange: str => {
			setValue(str);
		},
		placeholder: placeholder,
	});
	return [searchbar, value];
};
