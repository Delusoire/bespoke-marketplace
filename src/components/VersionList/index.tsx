import { React } from "/modules/official/stdlib/src/expose/React.js";
import {
   PanelContent,
   PanelHeader,
   PanelSkeleton,
} from "/modules/official/stdlib/src/webpack/ReactComponents.js";

export interface VersionListProps { }
export default function ( props: VersionListProps ) {

   return (
      <PanelSkeleton label="Marketplace">
         <PanelContent>
            <PanelHeader title="greetings" />
            Hello World!
            <div id="MarketplacePanel" />
         </PanelContent>
      </PanelSkeleton>
   );
};
