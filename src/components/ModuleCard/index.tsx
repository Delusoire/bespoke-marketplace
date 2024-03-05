import { S } from "/modules/Delusoire/std/index.js";

import AuthorsDiv from "./AuthorsDiv.js";
import TagsDiv from "./TagsDiv.js";
import { Module } from "/hooks/module.js";

const History = S.Platform.getHistory();

// TODO: add remoteMetaList support, add more importantTags
interface ModuleCardProps {}
export default function ({ identifier, metadata, remoteMeta, setRemoteMeta, remoteMetaList, shouldShowTags }) {
	const { name, description, tags, authors, preview } = metadata;

	const module = Module.registry.get(identifier);
	const installed = module !== undefined;

	const cardClasses = S.classnames("main-card-card", `marketplace-card--${this.props.type}`, {
		"marketplace-card--installed": installed,
	});

	const importantTags = [installed && "installed"].filter(Boolean);

	return (
		<div
			className={cardClasses}
			onClick={() => {
				History.push(`spotify:app:marketplace:${identifier}`);
			}}
		>
			<div className="main-card-draggable" draggable="true">
				<div className="main-card-imageContainer">
					<div className="main-cardImage-imageWrapper">
						<div>
							<img
								alt="ur blind haha *points finger*"
								aria-hidden="false"
								draggable="false"
								loading="lazy"
								src={preview}
								className="main-image-image main-cardImage-image"
								onError={e => {
									// https://png-pixel.com
									e.currentTarget.setAttribute(
										"src",
										"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII",
									);

									e.currentTarget.closest(".main-cardImage-imageWrapper")?.classList.add("main-cardImage-imageWrapper--error");
								}}
							/>
						</div>
					</div>
				</div>
				<div className="main-card-cardMetadata">
					<a
						draggable="false"
						title={name}
						className="main-cardHeader-link"
						dir="auto"
						href={remoteReadme}
						target="_blank"
						rel="noopener noreferrer"
						onClick={e => e.stopPropagation()}
					>
						<div className="main-cardHeader-text main-type-balladBold">{name}</div>
					</a>
					<div className="main-cardSubHeader-root main-type-mestoBold marketplace-cardSubHeader">
						<AuthorsDiv authors={authors} />
					</div>
					<p className="marketplace-card-desc">{description}</p>
					<div className="marketplace-card__bottom-meta main-type-mestoBold">
						<TagsDiv tags={tags} shouldShowTags={shouldShowTags} importantTags={importantTags} />
					</div>
				</div>
			</div>
		</div>
	);
}
