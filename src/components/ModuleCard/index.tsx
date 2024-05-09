import { S } from "/modules/official/stdlib/index.js";
const { React } = S;
import AuthorsDiv from "./AuthorsDiv.js";
import TagsDiv from "./TagsDiv.js";
import type { LoadableModule, Metadata, Module } from "/hooks/module.js";
import { _, startCase } from "/modules/official/stdlib/deps.js";
import Dropdown, { type OptionProps } from "/modules/official/stdlib/lib/components/Dropdown.js";
import { useUpdate } from "../../util/index.js";
import { fetchJSON } from "/hooks/util.js";

const History = S.Platform.getHistory();

interface UseMetaSelectorOpts {
	module: Module;
	loadableModule: LoadableModule;
	setLoadableModule: (loadableModule: LoadableModule) => void;
}

const useLoadableModuleSelector = ({ loadableModule, setLoadableModule, module }: UseMetaSelectorOpts) => {
	const parseMeta = (metaURL: string) => {
		const moduleURL = metaURL.replace(/\/metadata\.json$/, "");
		{
			const match = moduleURL.match(/^\/modules(?<modulePath>\/.*)$/);
			if (match) {
				const { modulePath } = match.groups ?? {};
				return { type: "local", path: modulePath };
			}
		}
		try {
			const url = new URL(moduleURL);
			switch (url.hostname) {
				case "raw.githubusercontent.com": {
					return { type: "github", path: url.pathname };
				}
			}
		} catch (_) {}

		return { type: "unknown", path: moduleURL };
	};

	const prettifyMeta = (loadableModule: LoadableModule) => {
		const { type, path } = parseMeta(loadableModule.remoteMetadataURL ?? "");
		const { version } = loadableModule.metadata;
		return <S.ReactComponents.ScrollableText title={`@${type}: ${path}`}>{version}</S.ReactComponents.ScrollableText>;
	};

	const options = _.mapValues(module.loadableModuleByVersion, prettifyMeta) as {
		[K in string]: React.FC<OptionProps>;
	};

	const dropdown = (
		<div className="min-w-fit">
			<Dropdown
				options={options}
				activeOption={loadableModule.metadata.version}
				onSwitch={version => setLoadableModule(module.loadableModuleByVersion[version])}
			/>
		</div>
	);

	return dropdown;
};

interface ModuleCardProps {
	module: Module;
	loadableModule: LoadableModule;
	showTags: boolean;
}

const fallbackImage = () => (
	<svg
		data-encore-id="icon"
		role="img"
		aria-hidden="true"
		data-testid="card-image-fallback"
		viewBox="0 0 24 24"
		className="fill-current"
		style={{ width: "64px", height: "64px" }}
	>
		<path d="M20.929,1.628A1,1,0,0,0,20,1H4a1,1,0,0,0-.929.628l-2,5A1.012,1.012,0,0,0,1,7V22a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V7a1.012,1.012,0,0,0-.071-.372ZM4.677,3H19.323l1.2,3H3.477ZM3,21V8H21V21Zm8-3a1,1,0,0,1-1,1H6a1,1,0,0,1,0-2h4A1,1,0,0,1,11,18Z" />
	</svg>
);

export default function ({ module, loadableModule: initialLoadableModule, showTags }: ModuleCardProps) {
	const [loadableModule, setLoadableModule] = React.useState(initialLoadableModule);

	const loadableModuleSelector = useLoadableModuleSelector({ loadableModule, setLoadableModule, module });

	const isEnabled = () => loadableModule.isEnabled();
	const [enabled, updateEnabled] = useUpdate(isEnabled);

	const installed = loadableModule.installed;
	const hasRemote = Boolean(loadableModule.remoteMetadataURL);

	const outdated = installed && hasRemote && false;

	const { data, isSuccess } = S.ReactQuery.useQuery({
		queryKey: ["moduleCard", loadableModule.remoteMetadataURL],
		queryFn: () => fetchJSON<Metadata>(loadableModule.remoteMetadataURL),
		enabled: loadableModule.metadata.isDummy && hasRemote,
	});

	if (isSuccess) {
		loadableModule.updateMetadata(data);
	}

	const { name, description, tags, authors, preview } = loadableModule.metadata;

	const cardClasses = S.classnames("main-card-card", {
		"border-[var(--essential-warning)]": outdated,
	});

	const externalHref = loadableModule.remoteMetadataURL;
	const metadataURL = loadableModule.installed ? `/modules/${loadableModule.getModuleIdentifier()}/metadata.json` : externalHref;
	const previewHref = `${metadataURL}/../${preview}`;

	// TODO: add more important tags
	const importantTags = [].filter(Boolean);

	return (
		<div className={cardClasses}>
			<div className="flex flex-col h-full" draggable="true">
				<div
					onClick={() => {
						History.push(`/bespoke/marketplace/${encodeURIComponent(metaURL)}`);
					}}
					style={{ pointerEvents: "all", cursor: "pointer", marginBottom: "16px" }}
				>
					<S.ReactComponents.Cards.CardImage images={[{ url: previewHref }]} FallbackComponent={fallbackImage} />
				</div>
				<div className="flex flex-col gap-2 flex-grow">
					<a
						draggable="false"
						title={name}
						className="hover:underline"
						dir="auto"
						href={externalHref}
						target="_blank"
						rel="noopener noreferrer"
						onClick={e => e.stopPropagation()}
					>
						<div className="main-type-balladBold">{startCase(name)}</div>
					</a>
					<div className="text-sm mx-0 whitespace-normal color-[var(--spice-subtext)] flex flex-col gap-2">
						<AuthorsDiv authors={authors} />
					</div>
					<p className="text-sm mx-0 overflow-hidden line-clamp-3 mb-auto">{description || "No description for this package"}</p>
					<div className="text-[var(--spice-subtext)] whitespace-normal main-type-mestoBold">
						<TagsDiv tags={tags} showTags={showTags} importantTags={importantTags} />
					</div>
					<div className="flex justify-between">
						{loadableModuleSelector}
						{installed && (
							<S.ReactComponents.SettingToggle
								className="x-settings-button justify-end"
								value={enabled}
								onSelected={async (checked: boolean) => {
									const hasChanged = checked ? loadableModule.enable(true) : loadableModule.disable(true);
									if (await hasChanged) {
										updateEnabled();
									}
								}}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
