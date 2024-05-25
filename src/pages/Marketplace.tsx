import { React } from "/modules/official/stdlib/src/expose/React.js";
import { _ } from "/modules/official/stdlib/deps.js";
import { t } from "../i18n.js";
import {
	type ModuleInstance,
	type Metadata,
	Module,
	type ModuleIdentifier,
	type Version,
} from "/hooks/module.js";
import ModuleCard from "../components/ModuleCard/index.js";
import { hash, settingsButton } from "../../index.js";
import { CONFIG } from "../settings.js";
import {
	getProp,
	TreeNodeVal,
	useChipFilter,
	useDropdown,
	useSearchBar,
	type RTree,
} from "/modules/official/stdlib/lib/components/index.js";
import { usePanelAPI } from "/modules/official/stdlib/src/webpack/CustomHooks.js";

const SortOptions = {
	default: () => t( "sort.default" ),
	"a-z": () => t( "sort.a-z" ),
	"z-a": () => t( "sort.z-a" ),
	random: () => t( "sort.random" ),
};
const SortFns: Record<keyof typeof SortOptions, null | ( ( a: Metadata, b: Metadata ) => number | boolean )> = {
	default: null,
	"a-z": ( a, b ) => ( b.name > a.name ? 1 : a.name > b.name ? -1 : 0 ),
	"z-a": ( a, b ) => ( a.name > b.name ? 1 : b.name > a.name ? -1 : 0 ),
	random: () => Math.random() - 0.5,
};

const enabled = { enabled: { [ TreeNodeVal ]: t( "filter.enabled" ) } };

const getFilters = () => ( {
	[ TreeNodeVal ]: null,
	themes: { [ TreeNodeVal ]: t( "filter.themes" ), ...enabled },
	extensions: { [ TreeNodeVal ]: t( "filter.extensions" ), ...enabled },
	apps: { [ TreeNodeVal ]: t( "filter.apps" ), ...enabled },
	snippets: { [ TreeNodeVal ]: t( "filter.snippets" ), ...enabled },
	libs: { [ TreeNodeVal ]: CONFIG.showLibs && t( "filter.libs" ) },
} );

const libTags = new Set( [ "lib", "npm", "internal" ] );
const isModLib = ( m: ModuleInstance ) => new Set( m.metadata.tags ).intersection( libTags ).size > 0;
const enabledFn = { enabled: { [ TreeNodeVal ]: ( m: ModuleInstance ) => m.isLoaded() } };

const filterFNs: RTree<( m: ModuleInstance ) => boolean> = {
	[ TreeNodeVal ]: m => CONFIG.showLibs || !isModLib( m ),
	themes: { [ TreeNodeVal ]: m => m.metadata.tags.includes( "theme" ), ...enabledFn },
	apps: { [ TreeNodeVal ]: m => m.metadata.tags.includes( "app" ), ...enabledFn },
	extensions: { [ TreeNodeVal ]: m => m.metadata.tags.includes( "extension" ), ...enabledFn },
	snippets: { [ TreeNodeVal ]: m => m.metadata.tags.includes( "snippet" ), ...enabledFn },
	libs: { [ TreeNodeVal ]: isModLib },
};

export let unselect: ( () => void ) | undefined;
export let refresh: ( () => void ) | undefined;

const getModuleInsts = () =>
	Object.fromEntries(
		Module.getAll().flatMap( module => {
			const selectedVersion = module.getEnabledVersion() || module.instances.keys().next().value;
			const moduleInst = module.instances.get( selectedVersion );
			return moduleInst ? ( [ [ module.getIdentifier(), moduleInst ] ] as const ) : [];
		} ),
	) as Record<ModuleIdentifier, ModuleInstance>;

export default function () {
	const [ searchbar, search ] = useSearchBar( {
		placeholder: t( "pages.marketplace.search_modules" ),
		expanded: true,
	} );

	const [ sortbox, sortOption ] = useDropdown( { options: SortOptions } );
	const sortFn = SortFns[ sortOption ];

	const filters = React.useMemo( getFilters, [ CONFIG.showLibs ] );
	const [ chipFilter, selectedFilters ] = useChipFilter( filters );

	const getSelectedFilterFNs = () =>
		selectedFilters.map( ( { key } ) => getProp( filterFNs, key ) as typeof filterFNs );
	const selectedFilterFNs = React.useMemo( getSelectedFilterFNs, [ selectedFilters ] );

	const [ moduleInsts, setModuleInsts ] = React.useState( getModuleInsts );

	const moduleCardProps = selectedFilterFNs
		.reduce( ( acc, fn ) => acc.filter( fn[ TreeNodeVal ] ), Array.from( Object.values( moduleInsts ) ) )
		.filter( moduleInst => {
			const { name, tags, authors } = moduleInst.metadata;
			const searchFiels = [ name, ...tags, ...authors ];
			return searchFiels.some( f => f.toLowerCase().includes( search.toLowerCase() ) );
		} )
		.sort( ( a, b ) => sortFn?.( a.metadata, b.metadata ) as number );

	const [ selectedModule, selectModule ] = React.useState<Module | null>( null );
	const _unselect = () => selectModule( null );
	const [ , _refresh ] = React.useReducer( n => n + 1, 0 );

	React.useEffect( () => {
		unselect = _unselect;
		refresh = _refresh;
		return () => {
			unselect = undefined;
			refresh = undefined;
		};
	}, [] );

	const { panelSend } = usePanelAPI();

	return (
		<>
			<section className="contentSpacing">
				<div className="marketplace-header items-center flex justify-between pb-2 flex-row z-10">
					<div className="marketplace-header__left flex gap-2">{ chipFilter }</div>
					<div className="marketplace-header__right flex gap-2 items-center">
						<p className="inline-flex self-center font-bold text-sm">{ t( "pages.marketplace.sort.label" ) }</p>
						{ sortbox }
						{ searchbar }
						{ settingsButton }
					</div>
				</div>
				<div className="marketplace-grid iKwGKEfAfW7Rkx2_Ba4E soGhxDX6VjS7dBxX9Hbd">
					{ moduleCardProps.map( moduleInst => {
						const module = moduleInst.getModule();
						const moduleIdentifier = module.getIdentifier();
						const isSelected = module === selectedModule;
						return <ModuleCard
							key={ moduleIdentifier }
							moduleInst={ moduleInst }
							isSelected={ isSelected }
							selectVersion={ ( v: Version ) => {
								const mis = { ...moduleInsts, [ moduleIdentifier ]: module.instances.get( v )! };
								setModuleInsts( mis );
							} }
							onClick={ () => {
								if ( isSelected ) {
									panelSend( "panel_close_click_or_collapse" );
								} else {
									if ( !selectedModule && hash ) {
										panelSend?.( hash.event );
									}
									selectModule( module );
								}
							}
							}
						/>;
					} ) }
				</div>
			</section>
		</>
	);
}
