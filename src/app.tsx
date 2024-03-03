import { S } from "/modules/Delusoire/std/index.js";
import i18n, { t } from "https://esm.sh/i18next";
import { withTranslation, initReactI18next } from "https://esm.sh/react-i18next";
import LanguageDetector from "https://esm.sh/i18next-browser-languagedetector";

import "./styles/styles.scss";
import locales from "./resources/locales";
import Grid from "./components/Grid.js";
import ReadmePage from "./components/ReadmePage.js";

i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		resources: locales,
		detection: {
			order: ["navigator", "htmlTag"],
		},
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
	});

const Marketplace = () => {
	const match = S.useMatch("/marketplace/:module");
	const selectedModule = match?.params?.module;

	return (
		<div id="stats-app">
			<S.ReactComponents.Routes>
				<S.ReactComponents.Route path="/" element={<Grid title={t("grid.spicetifyMarketplace")} />} />
				<S.ReactComponents.Route path=":module" element={<ReadmePage title={t("readmePage.title")} module={selectedModule} />} />
			</S.ReactComponents.Routes>
		</div>
	);
};

export default withTranslation()(App);
