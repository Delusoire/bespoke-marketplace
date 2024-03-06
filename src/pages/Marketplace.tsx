import { S } from "/modules/Delusoire/std/index.js";
import SortBox from "../components/SortBox/index.js";
import { _ } from "/modules/Delusoire/std/deps.js";
import { t } from "../i18n.js";
import { Module } from "/hooks/module.js";
import { fetchJSON } from "/hooks/util.js";
import { useMetas } from "../components/ModuleCard/index.js";

const identifiersToRemoteMetadataLists = await fetchJSON("https://raw.githubusercontent.com/Delusoire/spicetify-marketplace/repo.json");

const mergeObjectsWithArraysConcatenated = (a, b) =>
	_.mergeWith(a, b, (objValue, srcValue) => (_.isArray(objValue) ? objValue.concat(srcValue) : undefined));

export default function () {
	const localModules = Module.getModules();
	const identifiersToLocalMetadataLists = Object.fromEntries(localModules.map(module => [module.getIdentifier(), [module.getLocalMeta()]]));
	const identifiersToMetadataLists = mergeObjectsWithArraysConcatenated(identifiersToLocalMetadataLists, identifiersToRemoteMetadataLists);

	const identifiersToProps = useMetas(identifiersToMetadataLists);

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
								this.setState({ searchValue: event.target.value });
							}}
						/>
					</div>
					{/* TODO: add settings btn */}
				</div>
			</div>
			<>
				<div className="marketplace-grid main-gridContainer-gridContainer main-gridContainer-fixedWidth">{cards}</div>
			</>
		</section>
	);
}
