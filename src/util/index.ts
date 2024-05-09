import { S } from "/modules/official/stdlib/index.js";
const { React } = S;

// updates state using latest updater if updater changed or if update is called
export const useUpdate = <S>(updater: () => S) => {
	const [state, setState] = React.useState(updater);
	const update = React.useCallback(() => setState(updater), [updater]);
	React.useEffect(update, [update]);
	return [state, update] as const;
};
