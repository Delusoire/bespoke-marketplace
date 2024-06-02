import type { ResourceLanguage } from "https://esm.sh/v135/i18next";
import { fetchJSON } from "/hooks/util.js";

export default {
	en: await fetchJSON<ResourceLanguage>("/modules/Delusoire/marketplace/src/resources/locales/en.json"),
};
