import { React } from "/modules/official/stdlib/src/expose/React.js";
import AuthorsDiv from "./AuthorsDiv.js";
import TagsDiv from "./TagsDiv.js";
import type { ModuleInstance, Metadata, Version } from "/hooks/module.js";
import { _, startCase } from "/modules/official/stdlib/deps.js";
import { useUpdate } from "../../util/index.js";
import { fetchJSON } from "/hooks/util.js";
import { Platform } from "/modules/official/stdlib/src/expose/Platform.js";
import { Cards, SettingToggle } from "/modules/official/stdlib/src/webpack/ReactComponents.js";
import { classnames } from "/modules/official/stdlib/src/webpack/ClassNames.js";
import { useQuery } from "/modules/official/stdlib/src/webpack/ReactQuery.js";
import { VersionListContent } from "../VersionList/index.js";
import { ReactDOM } from "/modules/official/stdlib/src/webpack/React.js";

const History = Platform.getHistory();

interface ModuleCardProps {
	moduleInst: ModuleInstance;
	selectVersion: ( v: Version ) => void;
	showTags?: boolean;
	onClick: () => void;
	isSelected: boolean;
}

const fallbackImage = () => (
	<svg
		data-encore-id="icon"
		role="img"
		aria-hidden="true"
		data-testid="card-image-fallback"
		viewBox="0 0 24 24"
		className="fill-current"
		style={ { width: "64px", height: "64px" } }
	>
		<path d="M20.929,1.628A1,1,0,0,0,20,1H4a1,1,0,0,0-.929.628l-2,5A1.012,1.012,0,0,0,1,7V22a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V7a1.012,1.012,0,0,0-.071-.372ZM4.677,3H19.323l1.2,3H3.477ZM3,21V8H21V21Zm8-3a1,1,0,0,1-1,1H6a1,1,0,0,1,0-2h4A1,1,0,0,1,11,18Z" />
	</svg>
);

export default function ( { moduleInst, selectVersion, showTags = true, onClick, isSelected }: ModuleCardProps ) {
	const isEnabled = React.useCallback( () => moduleInst.isLoaded(), [ moduleInst ] );
	const [ enabled, setEnabled, updateEnabled ] = useUpdate( isEnabled );

	const installed = moduleInst.isInstalled();
	const hasRemote = Boolean( moduleInst.artifacts.length );

	const outdated = installed && hasRemote && false;

	const remoteMetadata = moduleInst.getRemoteMetadata();
	const { data, isSuccess } = useQuery( {
		queryKey: [ "moduleCard", remoteMetadata ],
		queryFn: () => fetchJSON<Metadata>( remoteMetadata! ),
		enabled: moduleInst.metadata.isDummy && hasRemote,
	} );

	if ( moduleInst.metadata.isDummy && isSuccess ) {
		moduleInst.updateMetadata( data );
	}

	const { name, description, tags, authors, preview } = moduleInst.metadata;

	const cardClasses = classnames( "LunqxlFIupJw_Dkx6mNx", {
		"border-[var(--essential-warning)]": outdated,
		"bg-neutral-800": isSelected,
	} );

	const externalHref = moduleInst.getRemoteArtifact();
	const metadataURL = installed ? moduleInst.getRelPath( "metadata.json" ) : remoteMetadata;
	const previewHref = metadataURL ? `${ metadataURL }/../${ preview }` : "";

	// TODO: add more important tags
	const importantTags = [].filter( Boolean );

	const panelTarget: any = document.querySelector( "#MarketplacePanel" );
	let panel;
	if ( isSelected && panelTarget ) {
		panel = ReactDOM.createPortal(
			<VersionListContent
				module={ moduleInst.getModule() }
				selectVersion={ selectVersion }
				cardUpdateEnabled={ updateEnabled }
			/>,
			panelTarget,
			crypto.randomUUID(),
		);
	}

	return (
		<div className={ cardClasses }>
			{ panel }
			<div
				className="border-[var(--essential-warning)] flex flex-col h-full"
				style={ { pointerEvents: "all" } }
				draggable="true"
				onClick={ onClick }
			>
				<div
					onClick={ () => {
						metadataURL && History.push( `/bespoke/marketplace/${ encodeURIComponent( metadataURL ) }` );
					} }
					style={ { pointerEvents: "all", cursor: "pointer", marginBottom: "16px" } }
				>
					<Cards.CardImage
						images={ [ { url: previewHref } ] }
						FallbackComponent={ fallbackImage }
					/>
				</div>
				<div className="flex flex-col gap-2 flex-grow">
					<a
						draggable="false"
						title={ name }
						className="hover:underline"
						dir="auto"
						href={ externalHref }
						target="_blank"
						rel="noopener noreferrer"
						onClick={ e => e.stopPropagation() }
					>
						<div className="main-type-balladBold">{ startCase( name ) }</div>
					</a>
					<div className="text-sm mx-0 whitespace-normal color-[var(--spice-subtext)] flex flex-col gap-2">
						<AuthorsDiv authors={ authors } />
					</div>
					<p className="text-sm mx-0 overflow-hidden line-clamp-3 mb-auto">
						{ description || "No description for this package" }
					</p>
					<div className="text-[var(--spice-subtext)] whitespace-normal main-type-mestoBold">
						<TagsDiv
							tags={ tags }
							showTags={ showTags }
							importantTags={ importantTags }
						/>
					</div>
					<div className="flex justify-between">
						{ moduleInst.isEnabled() && (
							<SettingToggle
								className="x-settings-button justify-end"
								value={ enabled }
								onSelected={ async ( checked: boolean ) => {
									setEnabled( checked );
									const hasChanged = checked ? moduleInst.load() : moduleInst.unload();
									if ( !( await hasChanged ) ) {
										updateEnabled();
									}
								} }
							/>
						) }
					</div>
				</div>
			</div>
		</div>
	);
}
