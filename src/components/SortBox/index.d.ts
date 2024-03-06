/// <reference types="react" />
interface SortBoxOption {
    key: string;
    value: string;
}
interface SortBoxProps {
    options: SortBoxOption[];
    onChange: (value: string) => void;
    selectedOption: string;
}
export default function ({ options, onChange, selectedOption }: SortBoxProps): JSX.Element;
export {};
