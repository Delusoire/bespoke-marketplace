import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;
import { _ } from "/modules/Delusoire/std/deps.js";
import { t } from "../i18n.js";
import { Metadata, Module } from "/hooks/module.js";
import { fetchJSON } from "/hooks/util.js";
import ModuleCard from "../components/ModuleCard/index.js";

const cachedMetaURLs = new Map<string, Metadata>();
const fetchMetaURL = async (metaURL: string) => {
	const cachedMetadata = cachedMetaURLs.get(metaURL);
	if (cachedMetadata) {
		return cachedMetadata;
	}

	const metadata = await fetchJSON(metaURL);
	cachedMetaURLs.set(metaURL, metadata);
	return metadata;
};

const dummyMetadata = {
	name: "",
	description: "",
	tags: [],
	authors: [],
	preview: "",
} as Metadata;

export const useMetas = (identifiersToMetadataLists: Record<string, string[]>) => {
	const [identifiersToMetaURLs, setIdentifiersToMetaURLs] = React.useState({} as Record<string, string>);
	const [identifiersToMetadatas, setIdentifiersToMetadatas] = React.useState({} as Record<string, Metadata>);

	React.useEffect(() => {
		const identifiersToMetaURLs = _.mapValues(identifiersToMetadataLists, (metaList, identifier) => {
			const module = Module.registry.get(identifier);
			const installed = module !== undefined;

			return installed ? module.getLocalMeta() : metaList[0];
		});
		setIdentifiersToMetaURLs(identifiersToMetaURLs);
	}, [identifiersToMetadataLists]);

	React.useEffect(() => {
		const identifiersToMetadatas = _.mapValues(identifiersToMetaURLs, (metaURL, identifier) => {
			const module = Module.registry.get(identifier);
			const installed = module !== undefined;
			const isLocalMetadata = installed && metaURL === module.getLocalMeta();

			return isLocalMetadata ? module.metadata : dummyMetadata;
		});
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

	const propsList = React.useMemo(
		() =>
			Object.entries(identifiersToMetadataProps).map(([identifier, metadataProps]) =>
				Object.assign({ identifier, showTags: true, metaURLList: identifiersToMetadataURLsLists[identifier] }, metadataProps),
			),
		[identifiersToMetadataURLsLists, identifiersToMetadataProps],
	);

	const [searchbar, search] = useSearchbar();

	return (
		<section className="contentSpacing">
			<div className="marketplace-header">
				<div className="marketplace-header__left">
					<h2 className="marketplace-header__label">{t("grid.sort.label")}</h2>
					{/* TODO: add sort box */}
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
						.sort()
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
