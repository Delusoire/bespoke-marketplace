import { S } from "/modules/Delusoire/std/index.js";
import AuthorsDiv from "./AuthorsDiv.js";
import TagsDiv from "./TagsDiv.js";
import type { Metadata } from "/hooks/module.js";
import { _ } from "/modules/Delusoire/std/deps.js";
import { useModule } from "../../pages/Module.js";
import Dropdown from "/modules/Delusoire/std/api/components/Dropdown.js";

const History = S.Platform.getHistory();

interface UseMetaSelectorOpts {
	metaURL: string;
	setMetaURL: (metaURL: string) => void;
	metaURLList: string[];
}

const useMetaSelector = ({ metaURL, setMetaURL, metaURLList }: UseMetaSelectorOpts) => {
	const prettifyMeta = (metaURL: string) => {
		const moduleURL = metaURL.replace(/\/metadata\.json$/, "");
		try {
			const url = new URL(moduleURL);
			switch (url.hostname) {
				case "raw.githubusercontent.com": {
					return `@github: ${url.pathname}`;
				}
			}
		} catch (e) {
			const match = moduleURL.match(/^\/modules(?<modulePath>\/.*)$/);
			const { modulePath } = match.groups ?? {};
			return `@local: ${modulePath}`;
		}

		return moduleURL;
	};

	const options = Object.fromEntries(metaURLList.map(metaURL => [metaURL, prettifyMeta(metaURL)] as const)) as { [K in string]: K };

	const dropdown = (
		<div className="min-w-fit">
			<Dropdown options={options} activeOption={metaURL} onSwitch={metaURL => setMetaURL(metaURL)} />
		</div>
	);

	return dropdown;
};

interface ModuleCardProps {
	identifier: string;
	metadata: Metadata;
	metaURL: string;
	setMetaURL: (metaURL: string) => void;
	metaURLList: string[];
	showTags: boolean;
}

export default function ({ identifier, metadata, metaURL, setMetaURL, metaURLList, showTags }: ModuleCardProps) {
	const { module, installed, enabled, updateEnabled, outdated, localOnly } = useModule(identifier);
	const metaSelector = useMetaSelector({ metaURL, setMetaURL, metaURLList });

	const { name, description, tags, authors, preview } = metadata;

	const cardClasses = S.classnames("main-card-card", {
		"border border-solid": installed,
		"border-[var(--essential-announcement)]": localOnly,
		"border-[var(--essential-warning)]": !localOnly && outdated,
		"border-[var(--essential-bright-accent)]": !localOnly && !outdated && enabled,
		"border-[var(--essential-negative)]": !localOnly && !outdated && !enabled && installed,
	});

	const href = metaURL.startsWith("http") ? metaURL : null;
	const previewHref = `${metaURL}/../${preview}`;

	// TODO: add more important tags
	const importantTags = [].filter(Boolean);

	return (
		<div className={cardClasses}>
			<div className="flex flex-col" draggable="true">
				<div>
					<div className="main-cardImage-imageWrapper">
						<div
							onClick={() => {
								History.push(`/marketplace/${encodeURIComponent(metaURL)}`);
							}}
							style={{ pointerEvents: "all", cursor: "pointer" }}
						>
							<img
								alt=""
								aria-hidden="false"
								draggable="false"
								loading="lazy"
								src={previewHref}
								className="main-cardImage-image"
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
				<div className="flex-grow flex flex-col">
					<div
						style={{
							display: "flex",
							alignItems: "center",
							flexDirection: "row",
						}}
					>
						<a
							draggable="false"
							title={name}
							className="hover:underline"
							dir="auto"
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							onClick={e => e.stopPropagation()}
						>
							<div className="main-type-balladBold">{name}</div>
						</a>
						{metaSelector}
					</div>
					<div className="main-type-mestoBold mt-1 whitespace-normal color-[var(--spice-subtext)] flex flex-col gap-2">
						<AuthorsDiv authors={authors} />
					</div>
					{installed && (
						<S.ReactComponents.SettingToggle
							className="x-settings-button"
							value={enabled}
							onSelected={(checked: boolean) => {
								if (checked) {
									module.enable();
								} else {
									module.disable();
								}
								updateEnabled();
							}}
						/>
					)}
					<p className="text-sm my-3 mx-0 overflow-hidden line-clamp-3">{description}</p>
					<div className="text-[var(--spice-subtext)] whitespace-normal main-type-mestoBold mt-auto mb-0 ">
						<TagsDiv tags={tags} showTags={showTags} importantTags={importantTags} />
					</div>
				</div>
			</div>
		</div>
	);
}
