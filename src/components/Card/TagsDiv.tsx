import { t } from "i18next";
import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;

import { MAX_TAGS } from "../../constants";

const englishTagMap = {
	[t("grid.externalJS")]: "external JS",
	[t("grid.archived")]: "archived",
	[t("grid.dark")]: "dark",
	[t("grid.light")]: "light",
};

const Tag = (tag: string) => (
	<li className="marketplace-card__tag" draggable={false} data-tag={englishTagMap[tag]}>
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

	// Sort tags so that externalJS and archived tags come first
	const baseTags = [importantTags, showTags && tags].flat();

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
