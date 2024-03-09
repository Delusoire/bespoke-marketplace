import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;
import Button from "../components/Button/index.js";
import DownloadIcon from "../components/icons/DownloadIcon.js";
import LoadingIcon from "../components/icons/LoadingIcon.js";
import TrashIcon from "../components/icons/TrashIcon.js";
import { t } from "../i18n.js";
import { renderMarkdown } from "../api/github.js";
import { logger } from "../index.js";
import { Module, ModuleManager } from "/hooks/module.js";
import { fetchJSON } from "/hooks/util.js";
import { fetchMetaURL } from "./Marketplace.js";
const RemoteMarkdown = React.memo(({ url }) => {
    const { status, error, data: markdown, } = S.ReactQuery.useQuery({
        queryKey: ["markdown", url],
        queryFn: () => fetch(url)
            .then(res => res.text())
            .then(markdown => renderMarkdown(markdown)),
    });
    switch (status) {
        case "pending": {
            return (S.React.createElement("footer", { className: "marketplace-footer" },
                S.React.createElement(LoadingIcon, null)));
        }
        case "success": {
            return S.React.createElement("div", { id: "marketplace-readme", className: "marketplace-readme__container", dangerouslySetInnerHTML: { __html: markdown } });
        }
        case "error": {
            logger.error(error);
            return "Something went wrong.";
        }
    }
});
export const useModule = (identifier) => {
    const updateModule = () => Module.registry.get(identifier);
    const [module, setModule] = React.useState(updateModule);
    React.useEffect(() => {
        const module = updateModule();
        setModule(module);
    }, [identifier]);
    const installed = module !== undefined;
    const enabled = installed && module.isEnabled();
    const [outdated, setOutdated] = React.useState(false);
    const localOnly = installed && module.remoteMetadataURL === undefined;
    React.useEffect(() => {
        let expired = false;
        const updateOutdated = async (remoteMetadataURL) => {
            const remoteMetadata = await fetchMetaURL(remoteMetadataURL);
            if (expired) {
                return;
            }
            const outdated = module.metadata.version !== remoteMetadata.version;
            setOutdated(outdated);
        };
        if (installed && !localOnly) {
            updateOutdated(module.remoteMetadataURL);
        }
        return () => {
            expired = true;
        };
    }, [module]);
    return { module, setModule, installed, enabled, outdated, localOnly };
};
export default function ({ murl }) {
    const { data: metadata } = S.ReactQuery.useSuspenseQuery({
        queryKey: ["modulePage", murl],
        queryFn: () => fetchJSON(murl),
    });
    const identifier = `${metadata.authors[0]}/${metadata.name}`;
    // TODO: add visual indicator & toggle for enabled
    const { module, setModule, installed, enabled, outdated, localOnly } = useModule(identifier);
    const readmeURL = `${murl}/../${metadata.readme}`;
    const label = t(installed ? "pages.module.remove" : "pages.module.install");
    return (S.React.createElement("section", { className: "contentSpacing" },
        S.React.createElement("div", { className: "marketplace-header" },
            S.React.createElement("div", { className: "marketplace-header__left" },
                S.React.createElement("h1", null, t("pages.module.title"))),
            S.React.createElement("div", { className: "marketplace-header__right" }, !localOnly && (S.React.createElement(Button, { className: "marketplace-header__button", onClick: e => {
                    e.preventDefault();
                    // TODO: these are optimistic updates, they may cause de-sync
                    if (installed && !outdated) {
                        module.dispose(true);
                        setModule(undefined);
                    }
                    else {
                        ModuleManager.add(murl);
                        const module = new Module(metadata, `/modules/${identifier}/metadata.json`, murl, false);
                        setModule(module);
                    }
                }, label: label },
                installed ? S.React.createElement(TrashIcon, null) : S.React.createElement(DownloadIcon, null),
                " ",
                label)))),
        S.React.createElement(RemoteMarkdown, { url: readmeURL })));
}
