import { S } from "/modules/Delusoire/stdlib/index.js";
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
	const baseTags = [importantTags, showTags && tags.filter(tag => !["theme", "app", "extension", "snippet", "lib"].includes(tag))].flat();

	return (
		<S.ReactComponents.ScrollableContainer>
			<ul className="flex gap-2 text-sm">{baseTags.map(Tag)}</ul>
		</S.ReactComponents.ScrollableContainer>
	);
}
