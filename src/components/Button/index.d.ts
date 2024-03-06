/// <reference types="react" />
type ButtonType = "round" | "circle";
interface ButtonProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    label?: string | null;
    type?: ButtonType;
    children: React.ReactNode;
    disabled?: boolean;
}
export default function ({ onClick, className, label, type, children, disabled }: ButtonProps): JSX.Element;
export {};
