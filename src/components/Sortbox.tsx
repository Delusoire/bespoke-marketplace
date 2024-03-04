import { S } from "/modules/Delusoire/std/index.js";
import Dropdown, { Option } from "https://esm.sh/react-dropdown";

interface SortBoxProps {
	options: SortBoxOption[];
	onChange: (value: string) => void;
	selectedOption: string;
}

export default function ({ options, onChange, selectedOption }: SortBoxProps) {
	return (
		<div className="marketplace-sortBox">
			<div className="marketplace-sortBox-header">
				<div className="marketplace-sortBox-header-title" />
				<Dropdown
					placeholder="Select an option"
					options={options.map(item => ({
						value: item.key,
						label: item.value,
					}))}
					value={selectedOption}
					onChange={(item: Option) => {
						onChange(item.value);
					}}
				/>
			</div>
		</div>
	);
}
