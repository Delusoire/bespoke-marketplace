import { S } from "/modules/Delusoire/std/index.js";
const { React } = S;
import { t } from "../../i18n.js";

import { SNIPPETS_PAGE_URL } from "../../static.js";
import TrashIcon from "../icons/TrashIcon.js";
import DownloadIcon from "../icons/DownloadIcon.js";
import AuthorsDiv from "./AuthorsDiv.js";
import TagsDiv from "./TagsDiv.js";
import Button from "../Button/index.js";

export default function () {
	const cardClasses = S.classnames("main-card-card", `marketplace-card--${this.props.type}`, {
		"marketplace-card--installed": installed,
	});

	const detail: string[] = [];
	if (this.props.type !== "snippet" && this.props.visual.stars) {
		detail.push(`★ ${this.state.stars}`);
	}

	return (
		<div
			className={cardClasses}
			onClick={() => {
				// FIXME: open module page
			}}
		>
			<div className="main-card-draggable" draggable="true">
				<div className="main-card-imageContainer">
					<div className="main-cardImage-imageWrapper">
						<div>
							<img
								alt=""
								aria-hidden="false"
								draggable="false"
								loading="lazy"
								src={this.props.item.imageURL}
								className="main-image-image main-cardImage-image"
								onError={e => {
									// Set to transparent PNG to remove the placeholder icon
									// https://png-pixel.com
									e.currentTarget.setAttribute(
										"src",
										"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII",
									);

									// Add class for styling
									e.currentTarget.closest(".main-cardImage-imageWrapper")?.classList.add("main-cardImage-imageWrapper--error");
								}}
							/>
						</div>
					</div>
				</div>
				<div className="main-card-cardMetadata">
					<a
						draggable="false"
						title={this.props.type === "snippet" ? this.props.item.title : this.props.item.manifest?.name}
						className="main-cardHeader-link"
						dir="auto"
						href={this.props.type !== "snippet" ? this.state.externalUrl : SNIPPETS_PAGE_URL}
						target="_blank"
						rel="noopener noreferrer"
						onClick={e => e.stopPropagation()}
					>
						<div className="main-cardHeader-text main-type-balladBold">{this.props.item.title}</div>
					</a>
					<div className="main-cardSubHeader-root main-type-mestoBold marketplace-cardSubHeader">
						{/* Add authors if they exist */}
						{this.props.item.authors && <AuthorsDiv authors={this.props.item.authors} />}
						<span>{detail.join(" ‒ ")}</span>
					</div>
					<p className="marketplace-card-desc">
						{this.props.type === "snippet" ? this.props.item.description : this.props.item.manifest?.description}
					</p>
					{this.props.item.lastUpdated && (
						<p className="marketplace-card-desc">
							{t("grid.lastUpdated", {
								val: new Date(this.props.item.lastUpdated),
								formatParams: {
									val: { year: "numeric", month: "long", day: "numeric" },
								},
							})}
						</p>
					)}
					{this.tags.length && (
						<div className="marketplace-card__bottom-meta main-type-mestoBold">
							<TagsDiv tags={this.tags} showTags={this.props.CONFIG.visual.tags} />
						</div>
					)}
					{installed && <div className="marketplace-card__bottom-meta main-type-mestoBold">✓ {t("grid.installed")}</div>}
					<S.ReactComponents.Tooltip label={t(installed ? "remove" : "install")} renderInline={true}>
						<div className="main-card-PlayButtonContainer">
							<Button
								classes={["marketplace-installButton"]}
								type="circle"
								label={t(installed ? "remove" : "install")}
								onClick={e => {
									e.stopPropagation();
									if (installed) {
										this.removeExtension();
									} else {
										this.installExtension();
									}
									openModal("RELOAD");
								}}
							>
								{installed ? <TrashIcon /> : <DownloadIcon />}
							</Button>
						</div>
					</S.ReactComponents.Tooltip>
				</div>
			</div>
		</div>
	);
}
