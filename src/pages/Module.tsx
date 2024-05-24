import { React } from "/modules/official/stdlib/src/expose/React.js";
import { ReactDOM } from "/modules/official/stdlib/src/webpack/React.js";
import Button from "../components/Button/index.js";
import DownloadIcon from "../components/icons/DownloadIcon.js";
import LoadingIcon from "../components/icons/LoadingIcon.js";
import TrashIcon from "../components/icons/TrashIcon.js";
import { t } from "../i18n.js";
import { renderMarkdown } from "../api/github.js";
import { logger } from "../../index.js";
import { type Metadata, Module, type ModuleInstance } from "/hooks/module.js";
import { fetchJSON } from "/hooks/util.js";
import { useUpdate } from "../util/index.js";
import { useQuery, useSuspenseQuery } from "/modules/official/stdlib/src/webpack/ReactQuery.js";

const ShadowContent = ( { root, children } ) => ReactDOM.createPortal( children, root );

interface ShadowRootProps {
	mode: "open" | "closed";
	delegatesFocus: boolean;
	styleSheets: CSSStyleSheet[];
	children: React.ReactNode;
}
const ShadowRoot = ( { mode, delegatesFocus, styleSheets, children }: ShadowRootProps ) => {
	const node = React.useRef<HTMLDivElement>( null );
	const [ root, setRoot ] = React.useState<ShadowRoot>( null! );

	React.useLayoutEffect( () => {
		if ( node.current ) {
			const root = node.current.attachShadow( {
				mode,
				delegatesFocus,
			} );
			if ( styleSheets.length > 0 ) {
				root.adoptedStyleSheets = styleSheets;
			}
			setRoot( root );
		}
	}, [ node, styleSheets ] );

	return <div ref={ node }>{ root && <ShadowContent root={ root }>{ children }</ShadowContent> }</div>;
};

const RemoteMarkdown = React.memo( ( { url }: { url: string; } ) => {
	const {
		status,
		error,
		data: markdown,
	} = useQuery( {
		queryKey: [ "markdown", url ],
		queryFn: () =>
			fetch( url )
				.then( res => res.text() )
				.then( markdown => renderMarkdown( markdown ) ),
	} );

	const fixRelativeImports = ( markdown: string ) => markdown.replace( /(src|href)="\.\//g, `$1="${ url }/../` );

	switch ( status ) {
		case "pending": {
			return (
				<footer className="m-auto text-center">
					<LoadingIcon />
				</footer>
			);
		}
		case "success": {
			return (
				<ShadowRoot mode="open" delegatesFocus={ true } styleSheets={ [] }>
					<style>@import "https://cdn.jsdelivr.xyz/npm/water.css@2/out/water.css";</style>
					<div id="module-readme" className="select-text" dangerouslySetInnerHTML={ { __html: fixRelativeImports( markdown ) } } />
				</ShadowRoot>
			);
		}
		case "error": {
			logger.error( error );
			return "Something went wrong.";
		}
	}
} );

export default function ( { aurl }: { aurl: string; } ) {
	const murl = aurl.replace( /\.zip$/, ".metadata.json" );
	const { data: metadata } = useSuspenseQuery( {
		queryKey: [ "modulePage", murl ],
		queryFn: () => fetchJSON<Metadata>( murl ),
	} );

	// !
	const author = metadata.authors[ 0 ];
	const name = metadata.name;
	const moduleIdentifier = `${ author }/${ name }`;

	const getModuleInst = React.useCallback( () => {
		const module = Module.get( moduleIdentifier );
		const moduleInst = module?.instances.get( metadata.version );
		return { module, moduleInst };
	}, [ moduleIdentifier, metadata.version ] );

	const [ { moduleInst }, _, updateModuleInst ] = useUpdate( getModuleInst );

	const installed = moduleInst?.isInstalled();

	const outdated = installed && false;

	const label = t( installed ? "pages.module.remove" : "pages.module.install" );

	const Button = installed && !outdated ? TrashButton : DownloadButton;

	return (
		<section className="contentSpacing">
			<div className="marketplace-header items-center flex justify-between pb-2 flex-row z-10">
				<div className="marketplace-header__left flex gap-2">
					<h1>{ t( "pages.module.title" ) }</h1>
				</div>
				<div className="marketplace-header__right flex gap-2">
					<Button label={ label } moduleInst={ moduleInst! } metadata={ metadata } onUpdate={ updateModuleInst } />
				</div>
			</div>
			<RemoteMarkdown url={ readmeURL } />
		</section>
	);
}

interface TrashButtonProps {
	label: string;
	moduleInst: ModuleInstance;
	onUpdate: () => void;
}
const TrashButton = ( props: TrashButtonProps ) => {
	return <Button label={ props.label } onClick={ async e => {
		e.preventDefault();

		if ( await props.moduleInst!.remove() ) {
			props.onUpdate();
		}
	} }>
		<TrashIcon />
		{ props.label }
	</Button>;
};

interface DownloadButtonProps {
	label: string;
	metadata: Metadata;
	onUpdate: () => void;
}
const DownloadButton = ( props: DownloadButtonProps ) => {
	return <Button label={ props.label } onClick={ async e => {
		e.preventDefault();

		const module = Module.getOrCreate( `${ props.metadata.authors[ 0 ] }/${ props.metadata.name }` );
		const moduleInst = await module.getInstanceOrCreate( props.metadata.version );
		if ( await moduleInst.add() ) {
			props.onUpdate();
		}
	} }>
		<TrashIcon />
		{ props.label }
	</Button>;
};
