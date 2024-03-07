import { S } from "/modules/Delusoire/std/index.js";

import Marketplace from "./pages/Marketplace.js";
import ModulePage from "./pages/Module.js";

export default function () {
	const match = S.useMatch("/marketplace/:murl");
	const murl = match?.params?.murl;

	return (
		<div id="stats-app">
			<S.ReactComponents.Routes>
				<S.ReactComponents.Route path="/" element={<Marketplace />} />
				<S.ReactComponents.Route path=":murl" element={<ModulePage murl={murl} />} />
			</S.ReactComponents.Routes>
		</div>
	);
}
