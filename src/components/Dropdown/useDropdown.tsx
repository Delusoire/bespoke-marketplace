import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;
import Dropdown, { Option } from "https://esm.sh/react-dropdown";

type SortBoxOptions<K extends string> = Record<K, React.ReactNode>;

type ValueOf<R> = R[keyof R];
export default function <K extends string>(options: SortBoxOptions<K>) {
	const [activeOption, setActiveOption] = React.useState(Object.keys(options)[0] as keyof typeof options);

	const dropdown = (
		<div className="marketplace-sortBox">
			<div className="marketplace-sortBox-header">
				<div className="marketplace-sortBox-header-title" />
				<Dropdown
					placeholder="Select an option"
					options={Object.entries(options).map(([value, label]) => ({ value, label }))}
					value={activeOption}
					onChange={(item: Option) => {
						setActiveOption(item.value);
					}}
				/>
			</div>
		</div>
	);

	return [dropdown, activeOption, setActiveOption] as const;
}
