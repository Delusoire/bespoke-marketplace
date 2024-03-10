import { fetchJSON } from "/hooks/util.js";
export default {
    "en-US": await fetchJSON("/modules/Delusoire/marketplace/src/resources/locales/en-US.json"),
    en: await fetchJSON("/modules/Delusoire/marketplace/src/resources/locales/en.json")
};
