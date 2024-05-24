import { useUpdate } from "../../util/index.js";
import { refresh } from "../ModuleCard/index.js";
import { ModuleInstance, type Module, type Version } from "/hooks/module.js";
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

   const m1 = React.useMemo( () => import( "../../pages/Marketplace.js" ), [] );
   const m2 = React.useMemo( () => import( "../ModuleCard/index.js" ), [] );

   React.useEffect( () => void m2.then( m => m.refresh?.() ), [ ref ] );
   React.useEffect( () => () => void m1.then( m => m.unselect?.() ), [] );

   return (
      <PanelSkeleton label="Marketplace">
         <PanelContent>
            <PanelHeader title="greetings" />
            <div
               id="MarketplacePanel"
               ref={ r => setRef( r ) }
            />
         </PanelContent>
      </PanelSkeleton>
   );
}

export interface VersionListContentProps {
   module: Module;
   selectVersion: ( version: Version ) => void;
}
export const VersionListContent = ( { module }: VersionListContentProps ) => {
   const instEntries = Array.from( module.instances.entries() );
   return (
      <ul>
         { instEntries.map( ( [ version, inst ] ) => (
            <VersionItem
               key={ version }
               moduleInst={ inst }
            />
         ) ) }
      </ul>
   );
};

interface VersionProps {
   moduleInst: ModuleInstance;
}
const VersionItem = ( props: VersionProps ) => {
   return (
      <li>
         { props.moduleInst.getVersion() }
         <RAB moduleInst={ props.moduleInst } />
         <DEB moduleInst={ props.moduleInst } />
      </li>
   );
};

interface BProps {
   moduleInst: ModuleInstance;
}

const RAB = ( props: BProps ) => {
   const isInstalled = React.useCallback( () => props.moduleInst.isInstalled(), [ props.moduleInst ] );
   const [ installed, setInstalled, updateInstalled ] = useUpdate( isInstalled );
   const B = installed ? RemoveButton : AddButton;
   return (
      <B
         { ...props }
         setInstalled={ setInstalled }
         updateInstalled={ updateInstalled }
      />
   );
};

interface RABProps {
   moduleInst: ModuleInstance;
   setInstalled: ( installed: boolean ) => void;
   updateInstalled: () => void;
}

const RemoveButton = ( props: RABProps ) => {
   return (
      <button
         onClick={ async () => {
            props.setInstalled( false );
            if ( !( await props.moduleInst.remove() ) ) {
               props.updateInstalled();
            }
         } }
      >
         del
      </button>
   );
};

const AddButton = ( props: RABProps ) => {
   return (
      <button
         onClick={ async () => {
            props.setInstalled( true );
            if ( !( await props.moduleInst.add() ) ) {
               props.updateInstalled();
            }
         } }
      >
         ins
      </button>
   );
};

const DEB = ( props: BProps ) => {
   const isEnabled = React.useCallback( () => props.moduleInst.isEnabled(), [ props.moduleInst ] );
   const [ enabled, setEnabled, updateEnabled ] = useUpdate( isEnabled );
   const B = enabled ? DisableButton : EnableButton;
   return (
      <B
         { ...props }
         setEnabled={ ( enabled: boolean ) => setEnabled( enabled ) }
         updateEnabled={ updateEnabled }
      />
   );
};

interface DEBProps {
   moduleInst: ModuleInstance;
   setEnabled: ( installed: boolean ) => void;
   updateEnabled: () => void;
}

const DisableButton = ( props: DEBProps ) => {
   const m2 = React.useMemo( () => import( "../ModuleCard/index.js" ), [] );

   return (
      <button
         onClick={ async () => {
            props.setEnabled( false );
            if ( ( await props.moduleInst.getModule().disable() ) ) {
               ( await m2 ).refresh?.();
            } else {
               props.updateEnabled();
            }
         } }
      >
         dis
      </button>
   );
};

const EnableButton = ( props: DEBProps ) => {
   const m2 = React.useMemo( () => import( "../ModuleCard/index.js" ), [] );

   return (
      <button
         onClick={ async () => {
            props.setEnabled( true );
            if ( await props.moduleInst.enable() ) {
               ( await m2 ).refresh?.();
            } else {
               props.updateEnabled();
            }
         } }
      >
         ena
      </button>
   );
};
