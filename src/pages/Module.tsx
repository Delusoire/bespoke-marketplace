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

const RemoteMarkdown = React.memo(({ url }: { url: string }) => {
	const {
		status,
		error,
		data: markdown,
	} = S.ReactQuery.useQuery({
		queryKey: [url],
		queryFn: () =>
			fetch(url)
				.then(res => res.text())
				.then(markdown => renderMarkdown(markdown)),
	});

	switch (status) {
		case "pending": {
			return (
				<footer className="marketplace-footer">
					<LoadingIcon />
				</footer>
			);
		}
		case "success": {
			return <div id="marketplace-readme" className="marketplace-readme__container" dangerouslySetInnerHTML={{ __html: markdown }} />;
		}
		case "error": {
			logger.error(error);
			return "Something went wrong.";
		}
	}
});

// TODO: Disable removing local-only modules (remoteMeta = undefined), update the azkjgdh oizaj d
export default function ({ identifier, remoteMeta }) {
	const module = Module.registry.get(identifier);
	const installed = module !== undefined;

	const label = t(installed ? "remove" : "install");

	return (
		<section className="contentSpacing">
			<div className="marketplace-header">
				<div className="marketplace-header__left">
					<h1>{t("readmePage.title")}</h1>
				</div>
				<div className="marketplace-header__right">
					<Button
						className="marketplace-header__button"
						onClick={e => {
							e.preventDefault();
							if (installed) {
								ModuleManager.remove(identifier);
							} else {
								ModuleManager.add(remoteMeta);
							}
						}}
						label={label}
					>
						{installed ? <TrashIcon /> : <DownloadIcon />} {label}
					</Button>
				</div>
			</div>
			// TODO: replace with github's get markdown api call
			<RemoteMarkdown url={remoteMeta.replace(/metadata\.json$/, "README.md")} />
		</section>
	);
}
