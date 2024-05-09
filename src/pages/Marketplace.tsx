import { S } from "/modules/official/stdlib/index.js";
const { React } = S;
import { _ } from "/modules/official/stdlib/deps.js";
import { t } from "../i18n.js";
import { type LoadableModule, type Metadata, Module } from "/hooks/module.js";
import ModuleCard from "../components/ModuleCard/index.js";
import { settingsButton } from "../../index.js";
import { CONFIG } from "../settings.js";
import { getProp, useChipFilter, useDropdown, useSearchBar } from "/modules/official/stdlib/lib/components/index.js";

const SortOptions = { default: () => t("sort.default"), "a-z": () => t("sort.a-z"), "z-a": () => t("sort.z-a"), random: () => t("sort.random") };
const SortFns: Record<keyof typeof SortOptions, (a: Metadata, b: Metadata) => number | boolean> = {
	default: undefined,
	"a-z": (a, b) => (b.name > a.name ? 1 : a.name > b.name ? -1 : 0),
	"z-a": (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0),
	random: () => Math.random() - 0.5,
};

const enabled = { enabled: { "": t("filter.enabled") } };

const getFilters = () => ({
	"": null,
	themes: { "": t("filter.themes"), ...enabled },
	extensions: { "": t("filter.extensions"), ...enabled },
	apps: { "": t("filter.apps"), ...enabled },
	snippets: { "": t("filter.snippets"), ...enabled },
	libs: { "": CONFIG.showLibs && t("filter.libs") },
});

const libTags = new Set(["lib", "npm", "internal"]);
const isModLib = (mod: LoadableModule) => new Set(mod.metadata.tags).intersection(libTags).size > 0;
const enabledFn = { enabled: { "": ({ loadableModule: mod }) => mod.isLoaded() } };

const filterFNs = {
	"": ({ loadableModule: mod }) => CONFIG.showLibs || !isModLib(mod),
	themes: { "": ({ loadableModule: mod }) => mod.metadata.tags.includes("theme"), ...enabledFn },
	apps: { "": ({ loadableModule: mod }) => mod.metadata.tags.includes("app"), ...enabledFn },
	extensions: { "": ({ loadableModule: mod }) => mod.metadata.tags.includes("extension"), ...enabledFn },
	snippets: { "": ({ loadableModule: mod }) => mod.metadata.tags.includes("snippet"), ...enabledFn },
	libs: { "": isModLib },
};

export default function () {
	const [searchbar, search] = useSearchBar({ placeholder: t("pages.marketplace.search_modules"), expanded: true });

	const [sortbox, sortOption] = useDropdown({ options: SortOptions });
	const sortFn = SortFns[sortOption];

	const [chipFilter, selectedFilters] = useChipFilter(getFilters());
	const selectedFilterFNs = selectedFilters.map(({ key }) => getProp(filterFNs, key));

	const propsList = React.useMemo(
		() =>
			Module.getModules().map(module => {
				const selectedVersion = module.enabled ?? Object.keys(module.loadableModuleByVersion)[0];
				const loadableModule = module.loadableModuleByVersion[selectedVersion];
				return { module, loadableModule, showTags: true };
			}),
		[],
	);

	return (
		<section className="contentSpacing">
			<div className="marketplace-header items-center flex justify-between pb-2 flex-row z-10">
				<div className="marketplace-header__left flex gap-2">{chipFilter}</div>
				<div className="marketplace-header__right flex gap-2 items-center">
					<p className="inline-flex self-center font-bold text-sm">{t("pages.marketplace.sort.label")}</p>
					{sortbox}
					{searchbar}
					{settingsButton}
				</div>
			</div>
			<>
				<div className="marketplace-grid main-gridContainer-gridContainer main-gridContainer-fixedWidth">
					{selectedFilterFNs
						.reduce((acc, fn) => acc.filter(fn), propsList)
						.filter(({ loadableModule }: (typeof propsList)[number]) => {
							const { name, tags, authors } = loadableModule.metadata;
							const searchFiels = [name, ...tags, ...authors];
							return searchFiels.some(f => f.toLowerCase().includes(search.toLowerCase()));
						})
						.sort((a, b) => sortFn?.(a.loadableModule.metadata, b.loadableModule.metadata) as number)
						.map(props => (
							<ModuleCard key={props.identifier} {...props} />
						))}
				</div>
			</>
		</section>
	);
}
