
import Marketplace from "./pages/Marketplace.js";
import ModulePage from "./pages/Module.js";
import { Routes, Route } from "/modules/official/stdlib/src/webpack/ReactComponents.js";
import { useMatch } from "/modules/official/stdlib/src/webpack/ReactRouter.js";
import { React } from "/modules/official/stdlib/src/expose/React.js";


export default function () {
	const match = useMatch( "/bespoke/marketplace/:aurl" );
	const aurl = decodeURIComponent( match?.params?.aurl );

	return (
		<div id="marketplace">
			<Routes>
				<Route path="/" element={ <Marketplace /> } />
				<Route path=":murl" element={ <ModulePage aurl={ aurl } /> } />
			</Routes>
		</div>
	);
}
