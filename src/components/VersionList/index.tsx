import type { Module, ModuleInstance } from "/hooks/module.js";
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
   return;
};

export interface VersionListContentProps {
   module: Module;
}
export const VersionListContent = ( { module }: VersionListContentProps ) => {
   const instEntries = Array.from( module.instances.entries() );
   return <ul>{ instEntries.map( ( [ version, inst ] ) => <Version key={ version } moduleInst={ inst } /> ) }</ul>;
};

interface VersionProps {
   moduleInst: ModuleInstance;
}
const Version = ( { moduleInst }: VersionProps ) => {

   return <li>
      { moduleInst.getVersion() }
      <button>E/D</button>
      <button>I/R</button>
   </li>;
};
