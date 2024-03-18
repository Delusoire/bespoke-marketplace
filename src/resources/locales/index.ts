import type { ResourceLanguage } from "i18next";
import { fetchJSON } from "/hooks/util.js";

export default {
	"en-US": await fetchJSON<ResourceLanguage>("/modules/Delusoire/marketplace/src/resources/locales/en-US.json"),
	en: await fetchJSON<ResourceLanguage>("/modules/Delusoire/marketplace/src/resources/locales/en.json"),
};
