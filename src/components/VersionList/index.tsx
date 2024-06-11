import { MI } from "../../pages/Marketplace.tsx";
import { useUpdate } from "../../util/index.ts";
import { LocalModuleInstance } from "/hooks/module.ts";
import { RemoteModuleInstance } from "/hooks/module.ts";
import { type Module, ModuleInstance } from "/hooks/module.ts";
import { React } from "/modules/official/stdlib/src/expose/React.ts";
import { useLocation, usePanelAPI } from "/modules/official/stdlib/src/webpack/CustomHooks.ts";
import {
	PanelContent,
	PanelHeader,
	PanelSkeleton,
} from "/modules/official/stdlib/src/webpack/ReactComponents.ts";

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
				<PanelHeader title="greetings" />
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
	const { selectedInstance } = props;

	return props.modules.map((module) => (
		<ul key={module.getHeritage().join("\x00")}>
			{Array.from(module.instances).map(([version, inst]) => (
				<VersionItem
					key={version}
					moduleInstance={inst as MI}
					selectInstance={props.selectInstance}
					cardUpdateEnabled={props.cardUpdateEnabled}
				/>
			))}
		</ul>
	));
};

interface VersionProps {
	moduleInstance: MI;
	selectInstance: (moduleInstance: MI) => void;
	cardUpdateEnabled: () => void;
}
const VersionItem = (props: VersionProps) => {
	return (
		<li onClick={() => props.selectInstance(props.moduleInstance)}>
			{props.moduleInstance.getVersion()}
			<RAB {...props} />
			<DEB {...props} />
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
		>
			ena
		</button>
	);
};
