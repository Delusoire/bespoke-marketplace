import { S } from "/modules/official/stdlib/index.js";
import AuthorsDiv from "./AuthorsDiv.js";
import TagsDiv from "./TagsDiv.js";
import { startCase } from "/modules/official/stdlib/deps.js";
import { useModule } from "../../pages/Module.js";
import Dropdown from "/modules/official/stdlib/lib/components/Dropdown.js";
const History = S.Platform.getHistory();
const useMetaSelector = ({ metaURL, setMetaURL, metaURLList }) => {
	const parseMeta = metaURL => {
		const moduleURL = metaURL.replace(/\/metadata\.json$/, "");
		{
			const match = moduleURL.match(/^\/modules(?<modulePath>\/.*)$/);
			if (match) {
				const { modulePath } = match.groups ?? {};
				return {
					type: "local",
					path: modulePath,
				};
			}
		}
		try {
			const url = new URL(moduleURL);
			switch (url.hostname) {
				case "raw.githubusercontent.com": {
					return {
						type: "github",
						path: url.pathname,
					};
				}
			}
		} catch (_) {}
		return {
			type: "unknown",
			path: moduleURL,
		};
	};
	const prettifyMeta = (metaURL, short = true) => {
		const { type, path } = parseMeta(metaURL);
		if (short) {
			return `@${type}`;
		}
		return /*#__PURE__*/ S.React.createElement(
			S.ReactComponents.ScrollableText,
			{
				title: "abc",
			},
			`@${type}: ${path}`,
		);
	};
	const options = Object.fromEntries(metaURLList.map(metaURL => [metaURL, ({ preview }) => prettifyMeta(metaURL, preview ?? false)]));
	const dropdown = /*#__PURE__*/ S.React.createElement(
		"div",
		{
			className: "min-w-fit",
		},
		/*#__PURE__*/ S.React.createElement(Dropdown, {
			options: options,
			activeOption: metaURL,
			onSwitch: metaURL => setMetaURL(metaURL),
		}),
	);
	return dropdown;
};
const fallbackImage = () =>
	/*#__PURE__*/ S.React.createElement(
		"svg",
		{
			"data-encore-id": "icon",
			role: "img",
			"aria-hidden": "true",
			"data-testid": "card-image-fallback",
			viewBox: "0 0 24 24",
			className: "fill-current",
			style: {
				width: "64px",
				height: "64px",
			},
		},
		/*#__PURE__*/ S.React.createElement("path", {
			d: "M20.929,1.628A1,1,0,0,0,20,1H4a1,1,0,0,0-.929.628l-2,5A1.012,1.012,0,0,0,1,7V22a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V7a1.012,1.012,0,0,0-.071-.372ZM4.677,3H19.323l1.2,3H3.477ZM3,21V8H21V21Zm8-3a1,1,0,0,1-1,1H6a1,1,0,0,1,0-2h4A1,1,0,0,1,11,18Z",
		}),
	);
export default function ({ identifier, metadata, metaURL, setMetaURL, metaURLList, showTags }) {
	const { module, installed, enabled, updateEnabled, outdated, localOnly } = useModule(identifier);
	const metaSelector = useMetaSelector({
		metaURL,
		setMetaURL,
		metaURLList,
	});
	const { name, description, tags, authors, preview } = metadata;
	const cardClasses = S.classnames("LunqxlFIupJw_Dkx6mNx", {
		"border-[var(--essential-warning)]": !localOnly && outdated,
	});
	const href = metaURL.startsWith("http") ? metaURL : null;
	const previewHref = `${metaURL}/../${preview}`;
	// TODO: add more important tags
	const importantTags = [].filter(Boolean);
	return /*#__PURE__*/ S.React.createElement(
		"div",
		{
			className: cardClasses,
		},
		/*#__PURE__*/ S.React.createElement(
			"div",
			{
				className: "flex flex-col h-full",
				draggable: "true",
			},
			/*#__PURE__*/ S.React.createElement(
				"div",
				{
					onClick: () => {
						History.push(`/bespoke/marketplace/${encodeURIComponent(metaURL)}`);
					},
					style: {
						pointerEvents: "all",
						cursor: "pointer",
						marginBottom: "16px",
					},
				},
				/*#__PURE__*/ S.React.createElement(S.ReactComponents.Cards.CardImage, {
					images: [
						{
							url: previewHref,
						},
					],
					FallbackComponent: fallbackImage,
				}),
			),
			/*#__PURE__*/ S.React.createElement(
				"div",
				{
					className: "flex flex-col gap-2 flex-grow",
				},
				/*#__PURE__*/ S.React.createElement(
					"a",
					{
						draggable: "false",
						title: name,
						className: "hover:underline",
						dir: "auto",
						href: href,
						target: "_blank",
						rel: "noopener noreferrer",
						onClick: e => e.stopPropagation(),
					},
					/*#__PURE__*/ S.React.createElement(
						"div",
						{
							className: "main-type-balladBold",
						},
						startCase(name),
					),
				),
				/*#__PURE__*/ S.React.createElement(
					"div",
					{
						className: "text-sm mx-0 whitespace-normal color-[var(--spice-subtext)] flex flex-col gap-2",
					},
					/*#__PURE__*/ S.React.createElement(AuthorsDiv, {
						authors: authors,
					}),
				),
				/*#__PURE__*/ S.React.createElement(
					"p",
					{
						className: "text-sm mx-0 overflow-hidden line-clamp-3 mb-auto",
					},
					description || "No description for this package",
				),
				/*#__PURE__*/ S.React.createElement(
					"div",
					{
						className: "text-[var(--spice-subtext)] whitespace-normal main-type-mestoBold",
					},
					/*#__PURE__*/ S.React.createElement(TagsDiv, {
						tags: tags,
						showTags: showTags,
						importantTags: importantTags,
					}),
				),
				/*#__PURE__*/ S.React.createElement(
					"div",
					{
						className: "flex justify-between",
					},
					metaSelector,
					installed &&
						/*#__PURE__*/ S.React.createElement(S.ReactComponents.SettingToggle, {
							className: "rFFJg1UIumqUUFDgo6n7 justify-end",
							value: enabled,
							onSelected: async checked => {
								const hasChanged = checked ? module.enable(true, true) : module.disable(true);
								hasChanged && updateEnabled();
							},
						}),
				),
			),
		),
	);
}
