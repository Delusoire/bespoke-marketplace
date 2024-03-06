import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;
import SortBox from "../components/SortBox/index.js";
import { _ } from "/modules/Delusoire/std/deps.js";
import { t } from "../i18n.js";
import { Module } from "/hooks/module.js";
import { fetchJSON } from "/hooks/util.js";
import ModuleCard, { useMetas } from "../components/ModuleCard/index.js";

const identifiersToRemoteMetadataURLsLists = await fetchJSON("https://raw.githubusercontent.com/Delusoire/spicetify-marketplace/repo.json");

const mergeObjectsWithArraysConcatenated = (a, b) =>
	_.mergeWith(a, b, (objValue, srcValue) => (_.isArray(objValue) ? objValue.concat(srcValue) : undefined));

export default function () {
	const [refreshCount, refresh] = React.useReducer(x => x + 1, 0);

	const identifiersToMetadataURLsLists = React.useMemo(() => {
		const localModules = Module.getModules();
		const identifiersToLocalMetadataURLsLists = Object.fromEntries(localModules.map(module => [module.getIdentifier(), [module.getLocalMeta()]]));
		return mergeObjectsWithArraysConcatenated(identifiersToLocalMetadataURLsLists, identifiersToRemoteMetadataURLsLists);
	}, [refreshCount]);

	const identifiersToMetadataProps = useMetas(identifiersToMetadataURLsLists);

	const propsList = Object.entries(identifiersToMetadataProps).map(([identifier, metadataProps]) =>
		Object.assign({ identifier, showTags: true, metaURLList: identifiersToMetadataURLsLists[identifier] }, metadataProps),
	);

	const [search, setSearch] = React.useState("");

	return (
		<section className="contentSpacing">
			<div className="marketplace-header">
				<div className="marketplace-header__left">
					<h2 className="marketplace-header__label">{t("grid.sort.label")}</h2>
					<SortBox onChange={value => updateSort(value)} options={sortOptions} selectedOption={sortOptions[0]} />
				</div>
				<div className="marketplace-header__right">
					<div className="searchbar--bar__wrapper">
						<input
							className="searchbar-bar"
							type="text"
							placeholder={`${t("grid.search")} ${t("tabs.modules")}...`}
							value={this.state.searchValue}
							onChange={event => {
								setSearch(event.target.value);
							}}
						/>
					</div>
					{/* TODO: add settings btn */}
				</div>
			</div>
			<>
				<div className="marketplace-grid main-gridContainer-gridContainer main-gridContainer-fixedWidth">
					{propsList.map(props => (
						<ModuleCard key={props.identifier} {...props} />
					))}
				</div>
			</>
		</section>
	);
}
