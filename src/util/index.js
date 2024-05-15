import { React } from "/modules/official/stdlib/src/expose/React.js";
// updates state using latest updater if updater changed or if update is called
export const useUpdate = (updater)=>{
    const [state, setState] = React.useState(updater);
    const update = React.useCallback(()=>setState(updater), [
        updater
    ]);
    React.useEffect(update, [
        update
    ]);
    return [
        state,
        update
    ];
};
