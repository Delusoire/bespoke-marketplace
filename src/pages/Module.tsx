import { React } from "/modules/official/stdlib/src/expose/React.ts";
import { ReactDOM } from "/modules/official/stdlib/src/webpack/React.ts";
import Button from "../components/Button/index.tsx";
import LoadingIcon from "../components/icons/LoadingIcon.tsx";
import TrashIcon from "../components/icons/TrashIcon.tsx";
import { t } from "../i18n.ts";
import { renderMarkdown } from "../api/github.ts";
import { logger } from "../../index.tsx";
import { type Metadata, Module, type ModuleInstance } from "/hooks/module.ts";
import { fetchJSON } from "/hooks/util.ts";
import { useUpdate } from "../util/index.ts";
import { useQuery, useSuspenseQuery } from "/modules/official/stdlib/src/webpack/ReactQuery.ts";

const ShadowContent = ({ root, children }) => ReactDOM.createPortal(children, root);

interface ShadowRootProps {
	mode: "open" | "closed";
	delegatesFocus: boolean;
	styleSheets: CSSStyleSheet[];
	children: React.ReactNode;
}
const ShadowRoot = ({ mode, delegatesFocus, styleSheets, children }: ShadowRootProps) => {
	const node = React.useRef<HTMLDivElement>(null);
	const [root, setRoot] = React.useState<ShadowRoot>(null!);

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

const RemoteMarkdown = React.memo(({ url }: { url: string; }) => {
	const {
		status,
		error,
		data: markdown,
	} = useQuery({
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

export default function ({ aurl }: { aurl: string; }) {
	const murl = aurl.replace(/\.zip$/, ".metadata.json");
	const { data: metadata } = useSuspenseQuery({
		queryKey: ["modulePage", murl],
		queryFn: () => fetchJSON<Metadata>(murl),
	});

	// !
	const author = metadata.authors[0];
	const name = metadata.name;
	const moduleIdentifier = `${author}/${name}`;

	const getModuleInst = React.useCallback(() => {
		const module = Module.get(moduleIdentifier);
		const moduleInst = module?.instances.get(metadata.version);
		return { module, moduleInst };
	}, [moduleIdentifier, metadata.version]);

	const [{ moduleInst }, _, updateModuleInst] = useUpdate(getModuleInst);

	const installed = moduleInst?.isInstalled();

	const outdated = installed && false;

	const label = t(installed ? "pages.module.remove" : "pages.module.install");

	const Button = installed && !outdated ? TrashButton : DownloadButton;

	return (
		<section className="contentSpacing">
			<div className="marketplace-header items-center flex justify-between pb-2 flex-row z-10">
				<div className="marketplace-header__left flex gap-2">
					<h1>{t("pages.module.title")}</h1>
				</div>
				<div className="marketplace-header__right flex gap-2">
					<Button label={label} moduleInst={moduleInst!} metadata={metadata} onUpdate={updateModuleInst} />
				</div>
			</div>
			<RemoteMarkdown url={readmeURL} />
		</section>
	);
}

interface TrashButtonProps {
	label: string;
	moduleInst: ModuleInstance;
	onUpdate: () => void;
}
const TrashButton = (props: TrashButtonProps) => {
	return <Button label={props.label} onClick={async e => {
		e.preventDefault();

		if (await props.moduleInst!.remove()) {
			props.onUpdate();
		}
	}}>
		<TrashIcon />
		{props.label}
	</Button>;
};

interface DownloadButtonProps {
	label: string;
	metadata: Metadata;
	onUpdate: () => void;
}
const DownloadButton = (props: DownloadButtonProps) => {
	return <Button label={props.label} onClick={async e => {
		e.preventDefault();

		const module = Module.getOrCreate(`${props.metadata.authors[0]}/${props.metadata.name}`);
		const moduleInst = await module.getInstanceOrCreate(props.metadata.version);
		if (await moduleInst.add()) {
			props.onUpdate();
		}
	}}>
		<TrashIcon />
		{props.label}
	</Button>;
};
