import { React } from "/modules/official/stdlib/src/expose/React.js";
import { _ } from "/modules/official/stdlib/deps.js";
import { t } from "../i18n.js";
import { type ModuleInstance, type Metadata, Module } from "/hooks/module.js";
import ModuleCard from "../components/ModuleCard/index.js";
import { settingsButton } from "../../index.js";
import { CONFIG } from "../settings.js";
import { getProp, useChipFilter, useDropdown, useSearchBar } from "/modules/official/stdlib/lib/components/index.js";

const SortOptions = { default: () => t( "sort.default" ), "a-z": () => t( "sort.a-z" ), "z-a": () => t( "sort.z-a" ), random: () => t( "sort.random" ) };
const SortFns: Record<keyof typeof SortOptions, null | ( ( a: Metadata, b: Metadata ) => number | boolean )> = {
	default: null,
	"a-z": ( a, b ) => ( b.name > a.name ? 1 : a.name > b.name ? -1 : 0 ),
	"z-a": ( a, b ) => ( a.name > b.name ? 1 : b.name > a.name ? -1 : 0 ),
	random: () => Math.random() - 0.5,
};

const enabled = { enabled: { "": t( "filter.enabled" ) } };

const getFilters = () => ( {
	"": null,
	themes: { "": t( "filter.themes" ), ...enabled },
	extensions: { "": t( "filter.extensions" ), ...enabled },
	apps: { "": t( "filter.apps" ), ...enabled },
	snippets: { "": t( "filter.snippets" ), ...enabled },
	libs: { "": CONFIG.showLibs && t( "filter.libs" ) },
} );

const libTags = new Set( [ "lib", "npm", "internal" ] );
const isModLib = ( mod: ModuleInstance ) => new Set( mod.metadata.tags ).intersection( libTags ).size > 0;
const enabledFn = { enabled: { "": ( { moduleInst: mod } ) => mod.isLoaded() } };

const filterFNs = {
	"": ( { moduleInst: mod } ) => CONFIG.showLibs || !isModLib( mod ),
	themes: { "": ( { moduleInst: mod } ) => mod.metadata.tags.includes( "theme" ), ...enabledFn },
	apps: { "": ( { moduleInst: mod } ) => mod.metadata.tags.includes( "app" ), ...enabledFn },
	extensions: { "": ( { moduleInst: mod } ) => mod.metadata.tags.includes( "extension" ), ...enabledFn },
	snippets: { "": ( { moduleInst: mod } ) => mod.metadata.tags.includes( "snippet" ), ...enabledFn },
	libs: { "": isModLib },
};

export default function () {
	const [ searchbar, search ] = useSearchBar( { placeholder: t( "pages.marketplace.search_modules" ), expanded: true } );

	const [ sortbox, sortOption ] = useDropdown( { options: SortOptions } );
	const sortFn = SortFns[ sortOption ];

	const [ chipFilter, selectedFilters ] = useChipFilter( getFilters() );
	const selectedFilterFNs = selectedFilters.map( ( { key } ) => getProp( filterFNs, key ) );

	const propsList = React.useMemo(
		() =>
			Module.getAll().flatMap( module => {
				const selectedVersion = module.getEnabledVersion() || module.instances.keys().next().value;
				const moduleInst = module.instances.get( selectedVersion );
				return moduleInst ? [ { moduleInst, showTags: true } ] : [];
			} ),
		[],
	);

	return (
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
			<>
				<div className="marketplace-grid iKwGKEfAfW7Rkx2_Ba4E soGhxDX6VjS7dBxX9Hbd">
					{ selectedFilterFNs
						.reduce( ( acc, fn ) => acc.filter( fn ), propsList )
						.filter( ( { moduleInst }: ( typeof propsList )[ number ] ) => {
							const { name, tags, authors } = moduleInst.metadata;
							const searchFiels = [ name, ...tags, ...authors ];
							return searchFiels.some( f => f.toLowerCase().includes( search.toLowerCase() ) );
						} )
						.sort( ( a, b ) => sortFn?.( a.moduleInst.metadata, b.moduleInst.metadata ) as number )
						.map( props => (
							<ModuleCard key={ props.moduleInst.getModuleIdentifier() } { ...props } />
						) ) }
				</div>
			</>
		</section>
	);
}
