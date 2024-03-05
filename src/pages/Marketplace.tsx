import { S } from "/modules/Delusoire/std/index.js";
import SortBox from "../components/SortBox/index.js";
import { modules } from "/hooks/module.js";
import { _ } from "/modules/Delusoire/std/deps.js";

const m = {
	"Delusoire/std": [
		"https://raw.githubusercontent.com/Delusoire/bespoke/main/modules/Delusoire/std/metadata.json",
		"https://raw.githubusercontent.com/Delusoire/bespoke/next/modules/Delusoire/std/metadata.json",
	],
};

const merge = (a, b) => _.mergeWith(a, b, (objValue, srcValue) => (_.isArray(objValue) ? objValue.concat(srcValue) : undefined));

export default function () {
	modules.map(module => [module.getIdentifier(), module]);

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
							placeholder={`${t("grid.search")} ${t(`tabs.${this.CONFIG.activeTab}`)}...`}
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
