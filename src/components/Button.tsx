import { S } from "/modules/Delusoire/std/index.js";

// Round is the default style
// Circle is used by the install/remove button
type ButtonType = "round" | "circle";

const Button = (props: {
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	className?: string[];
	label?: string | null;
	type?: ButtonType;
	children: React.ReactNode;
	disabled?: boolean;
}) => {
	const buttonType = props.type || "round";

	const btnClass = S.classnames(
		"spicetify-marketplace-button",
		{
			"spicetify-marketplace-circle": buttonType === "circle",
		},
		props.className,
	);

	return (
		<button className={btnClass} onClick={props.onClick} aria-label={props.label || ""} disabled={props.disabled}>
			{props.children}
		</button>
	);
};

export default Button;
