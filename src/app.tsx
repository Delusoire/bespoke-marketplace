import { S } from "/modules/official/stdlib/index.js";

import Marketplace from "./pages/Marketplace.js";
import ModulePage from "./pages/Module.js";

export default function () {
	const match = S.ReactRouter.useMatch("/bespoke/marketplace/:murl");
	const murl = decodeURIComponent(match?.params?.murl);

	return (
		<div id="marketplace">
			<S.ReactComponents.Routes>
				<S.ReactComponents.Route path="/" element={<Marketplace />} />
				<S.ReactComponents.Route path=":murl" element={<ModulePage murl={murl} />} />
			</S.ReactComponents.Routes>
		</div>
	);
}
