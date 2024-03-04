import { withTranslation } from "https://esm.sh/react-i18next";
import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;
import Button from "./Button.js";
import DownloadIcon from "./Icons/DownloadIcon.js";
import LoadingIcon from "./Icons/LoadingIcon.js";
import TrashIcon from "./Icons/TrashIcon.js";
import { t } from "https://esm.sh/i18next";

const ModulePage = ({ identifier, metadataURL, readmeURL, installed, setInstalled, enabled }) => {
	const [markdown, setMarkdown] = React.useState(null);

	React.useEffect(() => {
		fetch(readmeURL)
			.then(res => res.json())
			// FIXME
			.then(markdown => setMarkdown(markdown));
	}, []);

	const label = t(installed ? "remove" : "install");

	return (
		<section className="contentSpacing">
			<div className="marketplace-header">
				<div className="marketplace-header__left">
					<h1>{t("readmePage.title")}</h1>
				</div>
				<div className="marketplace-header__right">
					<Button
						classes={["marketplace-header__button"]}
						onClick={e => {
							e.preventDefault();
							setInstalled(!installed);
						}}
						label={label}
					>
						{installed ? <TrashIcon /> : <DownloadIcon />} {label}
					</Button>
				</div>
			</div>
			{markdown ? (
				<div id="marketplace-readme" className="marketplace-readme__container" dangerouslySetInnerHTML={{ __html: markdown }} />
			) : (
				<footer className="marketplace-footer">
					<LoadingIcon />
				</footer>
			)}
		</section>
	);
};

export default withTranslation()(ModulePage);
