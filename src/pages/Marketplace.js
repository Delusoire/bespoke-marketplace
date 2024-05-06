import { S } from "/modules/official/stdlib/index.js";
const { React } = S;
import { _ } from "/modules/official/stdlib/deps.js";
import { t } from "../i18n.js";
import { Module } from "/hooks/module.js";
import { fetchJSON } from "/hooks/util.js";
import ModuleCard from "../components/ModuleCard/index.js";
import { settingsButton } from "../../index.js";
import { CONFIG } from "../settings.js";
import { getProp, useChipFilter, useDropdown, useSearchBar } from "/modules/official/stdlib/lib/components/index.js";
const cachedMetaURLs = new Map();
export const fetchMetaURLSync = metaURL => cachedMetaURLs.get(metaURL);
export const fetchMetaURL = async metaURL => {
	const cachedMetadata = fetchMetaURLSync(metaURL);
	if (cachedMetadata) {
		return cachedMetadata;
	}
	const metadata = await fetchJSON(metaURL);
	cachedMetaURLs.set(metaURL, metadata);
	return metadata;
};
const dummyMetadata = {
	name: "",
	tags: [],
	preview: "",
	version: "",
	authors: [],
	description: "",
	readme: "",
	entries: {},
	dependencies: [],
};
export const useMetas = identifiersToMetadataLists => {
	const updateIdentifiersToMetaURLs = () =>
		_.mapValues(identifiersToMetadataLists, (metaList, identifier) => {
			const module = Module.registry.get(identifier);
			const installed = module !== undefined;
			return installed ? module.getLocalMeta() : metaList[0];
		});
	const updateIdentifiersToMetadatas = () =>
		_.mapValues(identifiersToMetaURLs, (metaURL, identifier) => {
			const module = Module.registry.get(identifier);
			const installed = module !== undefined;
			const isLocalMetadata = installed && metaURL === module.getLocalMeta();
			return isLocalMetadata ? module.metadata : dummyMetadata;
		});
	const [identifiersToMetaURLs, setIdentifiersToMetaURLs] = React.useState(updateIdentifiersToMetaURLs);
	const [identifiersToMetadatas, setIdentifiersToMetadatas] = React.useState(updateIdentifiersToMetadatas);
	React.useEffect(() => {
		const identifiersToMetaURLs = updateIdentifiersToMetaURLs();
		setIdentifiersToMetaURLs(identifiersToMetaURLs);
	}, [identifiersToMetadataLists]);
	React.useEffect(() => {
		const identifiersToMetadatas = updateIdentifiersToMetadatas();
		setIdentifiersToMetadatas(identifiersToMetadatas);
	}, [identifiersToMetaURLs]);
	React.useEffect(() => {
		let expired = false;
		for (const [identifier, metaURL] of Object.entries(identifiersToMetaURLs)) {
			const module = Module.registry.get(identifier);
			const installed = module !== undefined;
			const isLocalMetadata = installed && metaURL === module.getLocalMeta();
			if (!isLocalMetadata) {
				fetchMetaURL(metaURL).then(metadata => {
					if (expired) return;
					const identifiersToMetadatasCopy = Object.assign({}, identifiersToMetadatas);
					identifiersToMetadatasCopy[identifier] = metadata;
					setIdentifiersToMetadatas(identifiersToMetadatasCopy);
				});
			}
		}
		return () => {
			expired = true;
		};
	}, [identifiersToMetaURLs]);
	return _.mapValues(identifiersToMetadataLists, (_, identifier) => ({
		metadata: identifiersToMetadatas[identifier],
		metaURL: identifiersToMetaURLs[identifier],
		setMetaURL: metaURL =>
			setIdentifiersToMetaURLs(identifiersToMetaURLs =>
				Object.assign({}, identifiersToMetaURLs, {
					[identifier]: metaURL,
				}),
			),
	}));
};
const identifiersToRemoteMetadataURLsLists = await fetchJSON("https://raw.githubusercontent.com/Delusoire/spicetify-marketplace/main/repo.json");
const mergeObjectsWithArraysConcatenated = (a, b) =>
	_.mergeWith(a, b, (objValue, srcValue) => (_.isArray(objValue) ? objValue.concat(srcValue) : undefined));
const SortOptions = {
	default: () => t("sort.default"),
	"a-z": () => t("sort.a-z"),
	"z-a": () => t("sort.z-a"),
	random: () => t("sort.random"),
};
const SortFns = {
	default: undefined,
	"a-z": (a, b) => (b.name > a.name ? 1 : a.name > b.name ? -1 : 0),
	"z-a": (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0),
	random: () => Math.random() - 0.5,
};
const enabled = {
	enabled: {
		"": t("filter.enabled"),
	},
};
const getFilters = () => ({
	"": null,
	themes: {
		"": t("filter.themes"),
		...enabled,
	},
	extensions: {
		"": t("filter.extensions"),
		...enabled,
	},
	apps: {
		"": t("filter.apps"),
		...enabled,
	},
	snippets: {
		"": t("filter.snippets"),
		...enabled,
	},
	libs: {
		"": CONFIG.showLibs && t("filter.libs"),
	},
});
const isModLib = mod => _.intersection(mod.metadata.tags, ["lib", "npm", "internal"]).length > 0;
const enabledFn = {
	enabled: {
		"": mod => Module.registry.get(mod.identifier).isEnabled(),
	},
};
const filterFNs = {
	"": mod => CONFIG.showLibs || !isModLib(mod),
	themes: {
		"": mod => mod.metadata.tags.includes("theme"),
		...enabledFn,
	},
	apps: {
		"": mod => mod.metadata.tags.includes("app"),
		...enabledFn,
	},
	extensions: {
		"": mod => mod.metadata.tags.includes("extension"),
		...enabledFn,
	},
	snippets: {
		"": mod => mod.metadata.tags.includes("snippet"),
		...enabledFn,
	},
	libs: {
		"": isModLib,
	},
};
export default function () {
	const [refreshCount, refresh] = React.useReducer(x => x + 1, 0);
	const [searchbar, search] = useSearchBar({
		placeholder: t("pages.marketplace.search_modules"),
		expanded: true,
	});
	const [sortbox, sortOption] = useDropdown({
		options: SortOptions,
	});
	const sortFn = SortFns[sortOption];
	const [chipFilter, selectedFilters] = useChipFilter(getFilters());
	const selectedFilterFNs = selectedFilters.map(({ key }) => getProp(filterFNs, key));
	const identifiersToMetadataURLsLists = React.useMemo(() => {
		const localModules = Module.getModules();
		const identifiersToLocalMetadataURLsLists = Object.fromEntries(localModules.map(module => [module.getIdentifier(), [module.getLocalMeta()]]));
		return mergeObjectsWithArraysConcatenated(identifiersToLocalMetadataURLsLists, identifiersToRemoteMetadataURLsLists);
	}, [refreshCount]);
	const identifiersToMetadataProps = useMetas(identifiersToMetadataURLsLists);
	const propsList = React.useMemo(
		() =>
			Object.entries(identifiersToMetadataProps).map(([identifier, metadataProps]) =>
				Object.assign(
					{
						identifier,
						showTags: true,
						metaURLList: identifiersToMetadataURLsLists[identifier],
					},
					metadataProps,
				),
			),
		[identifiersToMetadataURLsLists, identifiersToMetadataProps],
	);
	return /*#__PURE__*/ S.React.createElement(
		"section",
		{
			className: "contentSpacing",
		},
		/*#__PURE__*/ S.React.createElement(
			"div",
			{
				className: "marketplace-header items-center flex justify-between pb-2 flex-row z-10",
			},
			/*#__PURE__*/ S.React.createElement(
				"div",
				{
					className: "marketplace-header__left flex gap-2",
				},
				chipFilter,
			),
			/*#__PURE__*/ S.React.createElement(
				"div",
				{
					className: "marketplace-header__right flex gap-2 items-center",
				},
				/*#__PURE__*/ S.React.createElement(
					"p",
					{
						className: "inline-flex self-center font-bold text-sm",
					},
					t("pages.marketplace.sort.label"),
				),
				sortbox,
				searchbar,
				settingsButton,
			),
		),
		/*#__PURE__*/ S.React.createElement(
			S.React.Fragment,
			null,
			/*#__PURE__*/ S.React.createElement(
				"div",
				{
					className: "marketplace-grid iKwGKEfAfW7Rkx2_Ba4E soGhxDX6VjS7dBxX9Hbd",
				},
				selectedFilterFNs
					.reduce((acc, fn) => acc.filter(fn), propsList)
					.filter(props => {
						const { metadata } = props;
						const { name, tags, authors } = metadata;
						const searchFiels = [name, ...tags, ...authors];
						return searchFiels.some(f => f.toLowerCase().includes(search.toLowerCase()));
					})
					.sort((a, b) => sortFn?.(a.metadata, b.metadata))
					.map(props =>
						/*#__PURE__*/ S.React.createElement(ModuleCard, {
							key: props.identifier,
							...props,
						}),
					),
			),
		),
	);
}
