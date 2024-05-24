import type { Module } from "/hooks/module.js";
import { React } from "/modules/official/stdlib/src/expose/React.js";
import {
   PanelContent,
   PanelHeader,
   PanelSkeleton,
} from "/modules/official/stdlib/src/webpack/ReactComponents.js";

export interface VersionListProps { }
export default function ( props: VersionListProps ) {
   const [ ref, setRef ] = React.useState<HTMLDivElement | null>( null );

   const m = React.useMemo( () => import( "../../pages/Marketplace.js" ), [] );

   React.useEffect( () => void m.then( m => m.refresh?.() ), [ ref ] );
   React.useEffect( () => () => void m.then( m => m.unselect?.() ), [] );

   return (
      <PanelSkeleton label="Marketplace">
         <PanelContent>
            <PanelHeader title="greetings" />
            <div id="MarketplacePanel" ref={ r => setRef( r ) } >
               <VersionListContentPlaceholder />
            </div>
         </PanelContent>
      </PanelSkeleton>
   );
};

const VersionListContentPlaceholder = () => {
   return "Loading ...";
};

export interface VersionListContentProps {
   module: Module;
}
export const VersionListContent = ( props: VersionListContentProps ) => {
   return <div>Content for: { props.module.getIdentifier() }</div>;
};
