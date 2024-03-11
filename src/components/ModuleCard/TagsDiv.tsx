import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;

import { MAX_TAGS } from "../../static.js";
import { t } from "../../i18n.js";

const knownTags = {
	[t("module.archived")]: "archived",
};

const Tag = (tag: string) => (
	<li className="bg-[var(--spice-tab-active)] rounded pt-0 pb-1 px-2" draggable={false} data-tag={knownTags[tag]}>
		{tag}
	</li>
);

interface TagsDivProps {
	tags: string[];
	importantTags: string[];
	showTags: boolean;
}
export default function ({ tags, importantTags, showTags }: TagsDivProps) {
	const [expanded, setExpanded] = React.useState(false);

	const baseTags = [importantTags, showTags && tags].flat();

	let extraTags = new Array<string>();
	// If there are more than one extra tags, slice them and add an expand button
	if (baseTags.length - MAX_TAGS > 1) {
		extraTags = baseTags.splice(MAX_TAGS);
	}

	return (
		<div className="">
			<ul className="flex flex-wrap gap-2">
				{baseTags.map(Tag)}
				{expanded && extraTags.map(Tag)}
			</ul>
			{!expanded && extraTags.length > 0 && (
				<button
					className="bg-[var(--spice-tab-active)] rounded pt-0 pb-1 px-2 mt-2 border-none hover:brightness-150 focus:brightness-150"
					onClick={e => {
						e.stopPropagation();
						setExpanded(true);
					}}
				>
					...
				</button>
			)}
		</div>
	);
}
