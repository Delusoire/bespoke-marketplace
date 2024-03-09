import { fetchJSON } from "/hooks/util.js";

export default {
	ar: await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/ar.json"),
	"en-US": await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/en-US.json"),
	en: await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/en.json"),
	fr: await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/fr.json"),
};
