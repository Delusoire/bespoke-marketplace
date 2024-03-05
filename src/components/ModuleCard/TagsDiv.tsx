import { t } from "i18next";
import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;

import { MAX_TAGS } from "../../static";

const knownTags = {
	[t("grid.archived")]: "archived",
};

const Tag = (tag: string) => (
	<li className="marketplace-card__tag" draggable={false} data-tag={knownTags[tag]}>
		{tag}
	</li>
);

interface TagsDivProps {
	tags: string[];
	importantTags: string[];
	shouldShowTags: boolean;
}
export default function ({ tags, importantTags, shouldShowTags }: TagsDivProps) {
	const [expanded, setExpanded] = React.useState(false);

	const baseTags = [importantTags, shouldShowTags && tags].flat();

	let extraTags = new Array<string>();
	// If there are more than one extra tags, slice them and add an expand button
	if (baseTags.length - MAX_TAGS > 1) {
		extraTags = baseTags.splice(MAX_TAGS);
	}

	return (
		<div className="marketplace-card__tags-container">
			<ul className="marketplace-card__tags">
				{baseTags.map(Tag)}
				{expanded && extraTags.map(Tag)}
			</ul>
			{!expanded && extraTags.length && (
				<button
					className="marketplace-card__tags-more-btn"
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
