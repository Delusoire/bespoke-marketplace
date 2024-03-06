import { fetchJSON } from "/hooks/util.js";
export default {
    ca: await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/ca.json"),
    en: await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/en.json"),
    "en-US": await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/en-US.json"),
    es: await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/es.json"),
    fr: await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/fr.json"),
    ru: await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/ru.json"),
    "zh-TW": await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/zh-TW.json"),
    "zh-CN": await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/zh-CN.json"),
    et: await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/et.json"),
    pl: await fetchJSON("/modules/Delusoire/spicetify-marketplace/src/resources/locales/pl.json"),
};
