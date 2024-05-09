import { S } from "/modules/official/stdlib/index.js";
const { React, ReactDOM } = S;
import Button from "../components/Button/index.js";
import DownloadIcon from "../components/icons/DownloadIcon.js";
import LoadingIcon from "../components/icons/LoadingIcon.js";
import TrashIcon from "../components/icons/TrashIcon.js";
import { t } from "../i18n.js";
import { renderMarkdown } from "../api/github.js";
import { logger } from "../../index.js";
import { LoadableModule, type Metadata, Module } from "/hooks/module.js";
import { fetchJSON } from "/hooks/util.js";
import { useUpdate } from "../util/index.js";

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

export default function ({ murl }: { murl: string }) {
	const { data: metadata } = S.ReactQuery.useSuspenseQuery({
		queryKey: ["modulePage", murl],
		queryFn: () => fetchJSON<Metadata>(murl),
	});

	const author = metadata.authors[0];
	const name = metadata.name;
	const version = metadata.version;

	const moduleIdentifier = `${author}/${name}`;

	const getLoadableModule = () => {
		const module = Module.registry.get(moduleIdentifier);
		const loadableModule = module?.loadableModuleByVersion[metadata.version];
		return { module, loadableModule };
	};

	const [{ module, loadableModule }, updateLoadableModule] = useUpdate(getLoadableModule);

	const installed = Boolean(loadableModule?.installed);
	const hasRemote = Boolean(loadableModule?.remoteMetadataURL);

	const outdated = installed && hasRemote && false;

	const readmeURL = `${murl}/../${metadata.readme}`;

	const label = t(installed ? "pages.module.remove" : "pages.module.install");

	const installedAndUpdated = installed && !outdated;

	return (
		<section className="contentSpacing">
			<div className="marketplace-header items-center flex justify-between pb-2 flex-row z-10">
				<div className="marketplace-header__left flex gap-2">
					<h1>{t("pages.module.title")}</h1>
				</div>
				<div className="marketplace-header__right flex gap-2">
					{hasRemote && (
						<Button
							onClick={async e => {
								e.preventDefault();

								const hasChanged = installedAndUpdated
									? loadableModule.remove(true)
									: new LoadableModule(metadata, true, murl).add(true);
								if (await hasChanged) {
									updateLoadableModule();
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
