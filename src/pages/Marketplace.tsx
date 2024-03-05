import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;
import semver from "https://esm.sh/semver";
import { Option } from "https://esm.sh/react-dropdown";

import { LOCALSTORAGE_KEYS, MARKETPLACE_VERSION, LATEST_RELEASE_URL } from "../static.js";
import LoadMoreIcon from "../components/icons/LoadMoreIcon.js";
import LoadingIcon from "../components/icons/LoadingIcon.js";
import SettingsIcon from "../components/icons/SettingsIcon.js";
import ThemeDeveloperToolsIcon from "../components/icons/ThemeDeveloperToolsIcon.js";
import SortBox from "../components/SortBox/index.js";
import Card from "../components/Card/index.js";
import Button from "../components/Button/index.js";
import DownloadIcon from "../components/icons/DownloadIcon.js";
import { modules } from "/hooks/module.js";

const m1 = {
	"Delusoire/std": [
		"https://raw.githubusercontent.com/Delusoire/bespoke/main/modules/Delusoire/std/metadata.json",
		"https://raw.githubusercontent.com/Delusoire/bespoke/next/modules/Delusoire/std/metadata.json",
	],
};

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
					{/* FIXME: add settings btn */}
				</div>
			</div>
			<>
				<div className="marketplace-grid main-gridContainer-gridContainer main-gridContainer-fixedWidth">{cards}</div>
			</>
		</section>
	);
}
