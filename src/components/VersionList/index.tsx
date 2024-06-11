import { classnames } from "/modules/official/stdlib/src/webpack/ClassNames.ts";
import { MI } from "../../pages/Marketplace.tsx";
import { useUpdate } from "../../util/index.ts";
import { LocalModuleInstance, Version } from "/hooks/module.ts";
import { RemoteModuleInstance } from "/hooks/module.ts";
import { type Module } from "/hooks/module.ts";
import { React } from "/modules/official/stdlib/src/expose/React.ts";
import { useLocation, usePanelAPI } from "/modules/official/stdlib/src/webpack/CustomHooks.ts";
import {
	PanelContent,
	PanelHeader,
	PanelSkeleton,
} from "/modules/official/stdlib/src/webpack/ReactComponents.ts";
import { ScrollableText } from "/modules/official/stdlib/src/webpack/ReactComponents.js";

export interface VersionListProps {}
export default function (props: VersionListProps) {
	const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

	const m = React.useMemo(() => import("../../pages/Marketplace.js"), []);

	React.useEffect(() => void m.then((m) => m.refresh?.()), [ref]);
	React.useEffect(() => () => void m.then((m) => m.unselect?.()), []);

	const location = useLocation();
	const { panelSend } = usePanelAPI();
	if (location.pathname !== "/bespoke/marketplace") {
		panelSend("panel_close_click_or_collapse");
	}

	return (
		<PanelSkeleton label="Marketplace">
			<PanelContent>
				<div
					id="MarketplacePanel"
					ref={(r) => setRef(r)}
				/>
			</PanelContent>
		</PanelSkeleton>
	);
}

export interface VersionListContentProps {
	modules: Array<Module<Module<any>>>;
	selectedInstance: MI;
	selectInstance: (moduleInstance: MI) => void;
	cardUpdateEnabled: () => void;
}
export const VersionListContent = (props: VersionListContentProps) => {
	return (
		<>
			<PanelHeader title={props.selectedInstance.getModuleIdentifier()} />
			<div className="p-4 flex flex-col rounded-lg shadow-md">
				{props.modules.map((module) => (
					<ModuleSection
						key={module.getHeritage().join("\x00")}
						module={module}
						selectedInstance={props.selectedInstance}
						selectInstance={props.selectInstance}
						cardUpdateEnabled={props.cardUpdateEnabled}
					/>
				))}
			</div>
		</>
	);
};

interface ModuleSectionProps {
	module: Module<Module<any>>;
	selectedInstance: MI;
	selectInstance: (moduleInstance: MI) => void;
	cardUpdateEnabled: () => void;
}
const ModuleSection = (props: ModuleSectionProps) => {
	const { module, selectedInstance } = props;
	const heritage = module.getHeritage().join("▶");

	return (
		<div className="mb-4">
			<h3 className="text-lg font-semibold mb-2 overflow-x-auto whitespace-nowrap">{heritage}</h3>
			<ul>
				{Array.from(module.instances).map(([version, inst]) => (
					<ModuleInstance
						key={version}
						isSelected={inst === selectedInstance}
						moduleInstance={inst as MI}
						selectInstance={props.selectInstance}
						cardUpdateEnabled={props.cardUpdateEnabled}
					/>
				))}
			</ul>
		</div>
	);
};

interface VersionProps {
	isSelected: boolean;
	moduleInstance: MI;
	selectInstance: (moduleInstance: MI) => void;
	cardUpdateEnabled: () => void;
}
const ModuleInstance = (props: VersionProps) => {
	return (
		<li
			onClick={() => props.selectInstance(props.moduleInstance)}
			className={classnames(
				"p-2 rounded-md cursor-pointer flex items-center justify-between",
				props.isSelected ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-200",
			)}
		>
			<ScrollableText>
				<span className="font-medium">{props.moduleInstance.getVersion()}</span>
			</ScrollableText>
			<div className="flex items-center gap-2">
				<RAB {...props} />
				<DEB {...props} />
			</div>
		</li>
	);
};

interface BProps {
	moduleInstance: MI;
	cardUpdateEnabled: () => void;
}

const RAB = (props: BProps) => {
	const { moduleInstance } = props;

	const isInstalled = React.useCallback(
		() => "isInstalled" in moduleInstance && moduleInstance.isInstalled(),
		[moduleInstance],
	);
	const [installed, setInstalled, updateInstalled] = useUpdate(isInstalled);
	const B = installed ? RemoveButton : AddButton;

	return (
		<B
			{...props as any}
			setInstalled={setInstalled}
			updateInstalled={updateInstalled}
		/>
	);
};

interface RABProps<M extends MI> {
	moduleInstance: M;
	setInstalled: (installed: boolean) => void;
	updateInstalled: () => void;
}

const RemoveButton = (props: RABProps<LocalModuleInstance>) => {
	return (
		<button
			onClick={async () => {
				props.setInstalled(false);
				if (!(await props.moduleInstance.remove())) {
					props.updateInstalled();
				}
			}}
			className="px-2 py-1 text-xs font-semibold text-red-500 bg-red-100 rounded hover:bg-red-200"
		>
			del
		</button>
	);
};

const AddButton = (props: RABProps<RemoteModuleInstance>) => {
	return (
		<button
			onClick={async () => {
				props.setInstalled(true);
				if (!(await props.moduleInstance.add())) {
					props.updateInstalled();
				}
			}}
			className="px-2 py-1 text-xs font-semibold text-green-500 bg-green-100 rounded hover:bg-green-200"
		>
			ins
		</button>
	);
};

const DEB = (props: BProps) => {
	const isEnabled = React.useCallback(() => props.moduleInstance.isEnabled(), [props.moduleInstance]);
	const [enabled, setEnabled, updateEnabled] = useUpdate(isEnabled);
	const B = enabled ? DisableButton : EnableButton;

	return (
		<B
			{...props}
			setEnabled={(enabled: boolean) => setEnabled(enabled)}
			updateEnabled={updateEnabled}
			cardUpdateEnabled={props.cardUpdateEnabled}
		/>
	);
};

interface DEBProps {
	moduleInstance: MI;
	setEnabled: (installed: boolean) => void;
	updateEnabled: () => void;
	cardUpdateEnabled: () => void;
}

const DisableButton = (props: DEBProps) => {
	return (
		<button
			onClick={async () => {
				props.setEnabled(false);
				if ((await props.moduleInstance.getModule().disable())) {
					props.cardUpdateEnabled();
				} else {
					props.updateEnabled();
				}
			}}
			className="px-2 py-1 text-xs font-semibold text-yellow-500 bg-yellow-100 rounded hover:bg-yellow-200"
		>
			dis
		</button>
	);
};

const EnableButton = (props: DEBProps) => {
	return (
		<button
			onClick={async () => {
				props.setEnabled(true);
				if (await props.moduleInstance.enable()) {
					props.cardUpdateEnabled();
				} else {
					props.updateEnabled();
				}
			}}
			className="px-2 py-1 text-xs font-semibold text-blue-500 bg-blue-100 rounded hover:bg-blue-200"
		>
			ena
		</button>
	);
};
