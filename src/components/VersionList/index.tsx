import { useUpdate } from "../../util/index.js";
import { ModuleInstance, type Module } from "/hooks/module.js";
import { ModuleManager } from "/hooks/protocol.js";
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
const Version = ( props: VersionProps ) => {
   return <li>
      { props.moduleInst.getVersion() }
      <RAB moduleInst={ props.moduleInst } />
      <DEB moduleInst={ props.moduleInst } />
   </li>;
};

interface BProps {
   moduleInst: ModuleInstance;
}

const RAB = ( props: BProps ) => {
   const [ installed, setInstalled, updateInstalled ] = useUpdate( () => props.moduleInst.isInstalled() );
   const B = installed ? RemoveButton : AddButton;
   return <B  { ...props } setInstalled={ setInstalled } updateInstalled={ updateInstalled } />;
};

interface RABProps {
   moduleInst: ModuleInstance;
   setInstalled: ( installed: boolean ) => void;
   updateInstalled: () => void;
}

const RemoveButton = ( props: RABProps ) => {
   return <button onClick={ async () => {
      props.setInstalled( true );
      if ( !await props.moduleInst.remove() ) {
         props.updateInstalled();
      }
   } } >del</button>;
};

const AddButton = ( props: RABProps ) => {
   return <button onClick={ async () => {
      props.setInstalled( false );
      if ( !await props.moduleInst.add() ) {
         props.updateInstalled();
      }
   } }>ins</button>;
};

const DEB = ( props: BProps ) => {
   const [ enabled, setEnabled, updateEnabled ] = useUpdate( () => props.moduleInst.isEnabled() );
   const B = enabled ? DisableButton : EnableButton;
   return <B  { ...props } setEnabled={ setEnabled } updateEnabled={ updateEnabled } />;
};

interface DEBProps {
   moduleInst: ModuleInstance;
   setEnabled: ( installed: boolean ) => void;
   updateEnabled: () => void;
}

const DisableButton = ( props: DEBProps ) => {
   return <button onClick={ async () => {
      props.setEnabled( true );
      if ( !await ModuleManager.disable( props.moduleInst.getModule() ) ) {
         props.updateEnabled();
      }
   } }>dis</button>;
};

const EnableButton = ( props: DEBProps ) => {
   return <button onClick={ async () => {
      props.setEnabled( false );
      if ( !await ModuleManager.enable( props.moduleInst ) ) {
         props.updateEnabled();
      }
   } }>ena</button>;
};
