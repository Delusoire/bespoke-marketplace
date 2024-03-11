import { S } from "/modules/Delusoire/std/index.js";
const { React, ReactDOM } = S;
import Button from "../components/Button/index.js";
import DownloadIcon from "../components/icons/DownloadIcon.js";
import LoadingIcon from "../components/icons/LoadingIcon.js";
import TrashIcon from "../components/icons/TrashIcon.js";
import { t } from "../i18n.js";
import { renderMarkdown } from "../api/github.js";
import { logger } from "../index.js";
import { type Metadata, Module, ModuleManager } from "/hooks/module.js";
import { fetchJSON } from "/hooks/util.js";
import { fetchMetaURL } from "./Marketplace.js";

const ShadowContent = ({ root, children }) => ReactDOM.createPortal(children, root);

interface ShadowRootProps {
	mode: "open" | "closed";
	delegatesFocus: boolean;
	styleSheets: CSSStyleSheet[];
	children: React.ReactNode;
}
const ShadowRoot = ({ mode, delegatesFocus, styleSheets, children }: ShadowRootProps) => {
	const node = React.useRef<HTMLDivElement>(null);
	const [root, setRoot] = React.useState<ShadowRoot>(null);

	React.useLayoutEffect(() => {
		if (node.current) {
			const root = node.current.attachShadow({
				mode,
				delegatesFocus,
			});
			if (styleSheets.length > 0) {
				root.adoptedStyleSheets = styleSheets;
			}
			setRoot(root);
		}
	}, [node, styleSheets]);

	return <div ref={node}>{root && <ShadowContent root={root}>{children}</ShadowContent>}</div>;
};

const RemoteMarkdown = React.memo(({ url }: { url: string }) => {
	const {
		status,
		error,
		data: markdown,
	} = S.ReactQuery.useQuery({
		queryKey: ["markdown", url],
		queryFn: () =>
			fetch(url)
				.then(res => res.text())
				.then(markdown => renderMarkdown(markdown)),
	});

	const fixRelativeImports = (markdown: string) => markdown.replace(/(src|href)="\.\//g, `$1="${url}/../`);

	switch (status) {
		case "pending": {
			return (
				<footer className="m-auto text-center">
					<LoadingIcon />
				</footer>
			);
		}
		case "success": {
			return (
				<ShadowRoot mode="open" delegatesFocus={true} styleSheets={[]}>
					<style>@import "https://cdn.jsdelivr.xyz/npm/water.css@2/out/water.css";</style>
					<div id="module-readme" className="select-text" dangerouslySetInnerHTML={{ __html: fixRelativeImports(markdown) }} />
				</ShadowRoot>
			);
		}
		case "error": {
			logger.error(error);
			return "Something went wrong.";
		}
	}
});

const useUpdate = <S,>(updater: () => S) => {
	const [state, setState] = React.useState(updater);
	const update = React.useCallback(() => setState(updater), [updater]);
	React.useEffect(update, [update]);
	return [state, update] as const;
};

export const useModule = (identifier: string) => {
	const moduleUpdater = React.useCallback(() => Module.registry.get(identifier), [identifier]);

	const [module, updateModule] = useUpdate(moduleUpdater);

	const enabledUpdater = React.useCallback(() => installed && module.isEnabled(), [module]);

	const installed = module !== undefined;
	const [enabled, updateEnabled] = useUpdate(enabledUpdater);
	const [outdated, setOutdated] = React.useState(false);
	const localOnly = installed && module.remoteMetadataURL === undefined;

	React.useEffect(() => {
		let expired = false;
		const updateOutdated = async (remoteMetadataURL: string) => {
			const remoteMetadata = await fetchMetaURL(remoteMetadataURL);
			if (expired) {
				return;
			}
			const outdated = module.metadata.version !== remoteMetadata.version;
			setOutdated(outdated);
		};

		if (installed && !localOnly) {
			updateOutdated(module.remoteMetadataURL!);
		}
		return () => {
			expired = true;
		};
	}, [module]);

	return { module, updateModule, installed, enabled, updateEnabled, outdated, localOnly };
};

export default function ({ murl }: { murl: string }) {
	const { data: metadata } = S.ReactQuery.useSuspenseQuery({
		queryKey: ["modulePage", murl],
		queryFn: () => fetchJSON<Metadata>(murl),
	});

	const identifier = `${metadata.authors[0]}/${metadata.name}`;

	// TODO: add visual indicator & toggle for enabled
	const { module, updateModule, installed, enabled, outdated, localOnly } = useModule(identifier);

	const readmeURL = `${murl}/../${metadata.readme}`;

	const label = t(installed ? "pages.module.remove" : "pages.module.install");

	const installedAndUpdated = installed && !outdated;

	return (
		<section className="contentSpacing">
			<div className="marketplace-header items-center flex justify-between pb-2 flex-row top-16 z-10">
				<div className="marketplace-header__left flex gap-2">
					<h1>{t("pages.module.title")}</h1>
				</div>
				<div className="marketplace-header__right flex gap-2">
					{!localOnly && (
						<Button
							onClick={e => {
								e.preventDefault();

								// TODO: these are optimistic updates, they may cause de-sync
								if (installedAndUpdated) {
									module.dispose(true);
									updateModule();
								} else {
									ModuleManager.add(murl);
									new Module(metadata, `/modules/${identifier}/metadata.json`, murl, false);
									updateModule();
								}
							}}
							label={label}
						>
							{installedAndUpdated ? <TrashIcon /> : <DownloadIcon />} {label}
						</Button>
					)}
				</div>
			</div>
			<RemoteMarkdown url={readmeURL} />
		</section>
	);
}
