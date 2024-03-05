import { S } from "/modules/Delusoire/std/index.js";

type ButtonType = "round" | "circle";

interface ButtonProps {
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	className?: string[];
	label?: string | null;
	type?: ButtonType;
	children: React.ReactNode;
	disabled?: boolean;
}

export default function ({ onClick, className = [], label = "", type = "round", children, disabled = false }: ButtonProps) {
	const btnClass = S.classnames(
		"spicetify-marketplace-button",
		{
			"spicetify-marketplace-circle": type === "circle",
		},
		className,
	);

	return (
		<button className={btnClass} onClick={onClick} aria-label={label} disabled={disabled}>
			{children}
		</button>
	);
}
