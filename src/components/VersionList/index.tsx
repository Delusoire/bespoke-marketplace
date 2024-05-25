import { useUpdate } from "../../util/index.js";
import { ModuleInstance, type Module, type Version } from "/hooks/module.js";
import { React } from "/modules/official/stdlib/src/expose/React.js";
import { useLocation, usePanelAPI } from "/modules/official/stdlib/src/webpack/CustomHooks.js";
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

   const location = useLocation();
   const { panelSend } = usePanelAPI();
   if ( location.pathname !== "/bespoke/marketplace" ) {
      panelSend( "panel_close_click_or_collapse" );
   }

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
   cardUpdateEnabled: () => void;
}
export const VersionListContent = ( props: VersionListContentProps ) => {
   const instEntries = Array.from( props.module.instances.entries() );
   return (
      <ul>
         { instEntries.map( ( [ version, inst ] ) => (
            <VersionItem
               key={ version }
               moduleInst={ inst }
               selectVersion={ props.selectVersion }
               cardUpdateEnabled={ props.cardUpdateEnabled }
            />
         ) ) }
      </ul>
   );
};

interface VersionProps {
   moduleInst: ModuleInstance;
   selectVersion: ( version: Version ) => void;
   cardUpdateEnabled: () => void;
}
const VersionItem = ( props: VersionProps ) => {
   return (
      <li onClick={ () => props.selectVersion( props.moduleInst.getVersion() ) }>
         { props.moduleInst.getVersion() }
         <RAB { ...props } />
         <DEB { ...props } />
      </li>
   );
};

interface BProps {
   moduleInst: ModuleInstance;
   cardUpdateEnabled: () => void;
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
         cardUpdateEnabled={ props.cardUpdateEnabled }
      />
   );
};

interface DEBProps {
   moduleInst: ModuleInstance;
   setEnabled: ( installed: boolean ) => void;
   updateEnabled: () => void;
   cardUpdateEnabled: () => void;
}

const DisableButton = ( props: DEBProps ) => {
   return (
      <button
         onClick={ async () => {
            props.setEnabled( false );
            if ( ( await props.moduleInst.getModule().disable() ) ) {
               props.cardUpdateEnabled();
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
   return (
      <button
         onClick={ async () => {
            props.setEnabled( true );
            if ( await props.moduleInst.enable() ) {
               props.cardUpdateEnabled();
            } else {
               props.updateEnabled();
            }
         } }
      >
         ena
      </button>
   );
};
