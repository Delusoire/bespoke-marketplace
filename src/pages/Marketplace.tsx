import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;
import { _ } from "/modules/Delusoire/std/deps.js";
import { t } from "../i18n.js";
import { Metadata, Module } from "/hooks/module.js";
import { fetchJSON } from "/hooks/util.js";
import ModuleCard from "../components/ModuleCard/index.js";
import useDropdown from "../components/Dropdown/useDropdown.js";

const cachedMetaURLs = new Map<string, Metadata>();
export const fetchMetaURLSync = (metaURL: string) => cachedMetaURLs.get(metaURL);

export const fetchMetaURL = async (metaURL: string) => {
	const cachedMetadata = fetchMetaURLSync(metaURL);
	if (cachedMetadata) {
		return cachedMetadata;
	}

	const metadata = await fetchJSON<Metadata>(metaURL);
	cachedMetaURLs.set(metaURL, metadata);
	return metadata;
};

const dummyMetadata: Metadata = {
	name: "",
	tags: [],
	preview: "",
	version: "",
	authors: [],
	description: "",
	readme: "",
	entries: {
		js: false,
		css: false,
		mixin: false,
	},
	dependencies: [],
};

export const useMetas = (identifiersToMetadataLists: Record<string, string[]>) => {
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
		setMetaURL: (metaURL: string) =>
			setIdentifiersToMetaURLs(identifiersToMetaURLs => Object.assign({}, identifiersToMetaURLs, { [identifier]: metaURL })),
	}));
};

const identifiersToRemoteMetadataURLsLists = await fetchJSON("https://raw.githubusercontent.com/Delusoire/spicetify-marketplace/main/repo.json");

const mergeObjectsWithArraysConcatenated = (a, b) =>
	_.mergeWith(a, b, (objValue, srcValue) => (_.isArray(objValue) ? objValue.concat(srcValue) : undefined));

const SortOptions = { "a-z": t("sort.a-z"), "z-a": t("sort.z-a") };
const SortFns: Record<keyof typeof SortOptions, (a: Metadata, b: Metadata) => number | boolean> = {
	"a-z": (a, b) => b.name > a.name,
	"z-a": (a, b) => a.name > b.name,
};

export default function () {
	const [refreshCount, refresh] = React.useReducer(x => x + 1, 0);

	const identifiersToMetadataURLsLists = React.useMemo(() => {
		const localModules = Module.getModules();
		const identifiersToLocalMetadataURLsLists = Object.fromEntries(localModules.map(module => [module.getIdentifier(), [module.getLocalMeta()]]));
		return mergeObjectsWithArraysConcatenated(identifiersToLocalMetadataURLsLists, identifiersToRemoteMetadataURLsLists);
	}, [refreshCount]);

	const identifiersToMetadataProps = useMetas(identifiersToMetadataURLsLists);

	const propsList = React.useMemo(
		() =>
			Object.entries(identifiersToMetadataProps).map(([identifier, metadataProps]) =>
				Object.assign({ identifier, showTags: true, metaURLList: identifiersToMetadataURLsLists[identifier] }, metadataProps),
			),
		[identifiersToMetadataURLsLists, identifiersToMetadataProps],
	);

	const [sortbox, sortOption] = useDropdown(SortOptions);
	const sortFn = SortFns[sortOption];
	const [searchbar, search] = useSearchbar();

	return (
		<section className="contentSpacing">
			<div className="marketplace-header">
				<div className="marketplace-header__left">
					<h2 className="marketplace-header__label">{t("grid.sort.label")}</h2>
					{sortbox}
				</div>
				<div className="marketplace-header__right">
					{searchbar}
					{/* TODO: add settings btn */}
				</div>
			</div>
			<>
				<div className="marketplace-grid main-gridContainer-gridContainer main-gridContainer-fixedWidth">
					{propsList
						.filter(props => {
							const { metadata } = props;
							const { authors, name, tags } = metadata;
							const searchFiels = [...authors, name, ...tags];
							return searchFiels.some(f => f.toLowerCase().includes(search.toLowerCase()));
						})
						.sort((a, b) => sortFn(a.metadata, b.metadata) as number)
						.map(props => (
							<ModuleCard key={props.identifier} {...props} />
						))}
				</div>
			</>
		</section>
	);
}

const Searchbar = ({ value, onChange }) => {
	return (
		<div className="searchbar--bar__wrapper">
			<input
				className="searchbar-bar"
				type="text"
				placeholder={`${t("grid.search")} ${t("tabs.modules")}...`}
				value={value}
				onChange={event => {
					onChange(event.target.value);
				}}
			/>
		</div>
	);
};

const useSearchbar = () => {
	const [value, setValue] = React.useState("");

	const searchbar = (
		<Searchbar
			value={value}
			onChange={str => {
				setValue(str);
			}}
		/>
	);

	return [searchbar, value] as const;
};
