import { S } from "/modules/Delusoire/std/index.js";

import Marketplace from "./pages/Marketplace.js";
import ModulePage from "./pages/Module.js";

export default function () {
	const match = S.useMatch("/marketplace/:module");
	const selectedModule = match?.params?.module;

	return (
		<div id="stats-app">
			<S.ReactComponents.Routes>
				<S.ReactComponents.Route path="/" element={<Marketplace />} />
				<S.ReactComponents.Route path=":module" element={<ModulePage module={selectedModule} />} />
			</S.ReactComponents.Routes>
		</div>
	);
}
