import { S } from "/modules/Delusoire/std/index.js";

interface ToggleProps {
	storageKey: string;
	enabled: boolean;
	clickable?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ({ storageKey, enabled, clickable, onChange }: ToggleProps) {
	const labelClass = S.classnames("spicetify-marketplace-toggle-wrapper", {
		"spicetify-marketplace-disabled": clickable,
	});

	return (
		<label className={labelClass}>
			<input
				className="spicetify-marketplace-toggle-input"
				type="checkbox"
				checked={enabled}
				data-storage-key={storageKey}
				id={`toggle:${storageKey}`}
				title={`Toggle for ${storageKey}`}
				onChange={onChange}
			/>
			<span className="spicetify-marketplace-toggle-indicator-wrapper">
				<span className="spicetify-marketplace-toggle-indicator" />
			</span>
		</label>
	);
}
