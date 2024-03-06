import { fetchJSON } from "/hooks/util.js";
export default {
    ca: await fetchJSON("./ca.json"),
    en: await fetchJSON("./en.json"),
    "en-US": await fetchJSON("./en-US.json"),
    es: await fetchJSON("./es.json"),
    fr: await fetchJSON("./fr.json"),
    ru: await fetchJSON("./ru.json"),
    "zh-TW": await fetchJSON("./zh-TW.json"),
    "zh-CN": await fetchJSON("./zh-CN.json"),
    et: await fetchJSON("./et.json"),
    pl: await fetchJSON("./pl.json"),
};
