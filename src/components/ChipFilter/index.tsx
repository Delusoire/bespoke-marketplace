import { S } from "/modules/Delusoire/stdlib/index.js";

const ChipComponentW = ({
	filterId,
	isPrimaryFilter,
	resetFilterIds,
	toggleFilterId,
	className,
	ChipComponent = S.ReactComponents.Chip,
	innerRef,
	...props
}) => {
	const selected = props.selected;
	const onClick = S.React.useCallback(() => {
		!filterId || (selected && isPrimaryFilter) ? resetFilterIds() : toggleFilterId(filterId);
	}, [filterId, selected, isPrimaryFilter, resetFilterIds, toggleFilterId]);

	return (
		<ChipComponent
			{...props}
			aria-label={props["aria-label"]}
			className={S.classnames(className)}
			onClick={onClick}
			selectedColorSet="invertedLight"
			secondary={selected && !isPrimaryFilter}
			style={{ marginBlockEnd: 0, willChange: "transform, opacity" }}
			ref={innerRef}
			tabIndex={-1}
		/>
	);
};

export const ChipFilter = S.React.memo(({ availableFilters, selectedFilters, toggleFilterId, resetFilterIds, className }) => {
	const filters = [selectedFilters, availableFilters].flat();
	// const innerRef = S.React.useRef(null)
	// const resetFilterIdsAndSaveFocus = S.React.useCallback(() => {
	//     const nextElementSibling = innerRef.current?.nextElementSibling
	//     if (nextElementSibling instanceof HTMLElement) {
	//         if (innerRef.current) {
	//             innerRef.current.removeAttribute("data-roving-interactive")
	//             innerRef.current.tabIndex = -1
	//         }
	//         nextElementSibling.tabIndex = 0
	//         nextElementSibling.setAttribute("data-roving-interactive", "1")
	//         nextElementSibling.focus({
	//             preventScroll: false,
	//         })
	//     }

	//     resetFilterIds()
	// }, [resetFilterIds])
	return (
		filters.length > 0 && (
			<S.ReactComponents.ScrollableContainer className={className} ariaLabel={"Filter options"}>
				{/* {selectedFilters?.length > 0 && (
                    <ChipComponentW
                        resetFilterIds={resetFilterIdsAndSaveFocus}
                        toggleFilterId={toggleFilterId}
                        allowedDropTargetMimeTypes={[]}
                        ChipComponent={S.ReactComponents.ChipClear}
                        aria-label="Clear filters"
                        innerRef={innerRef}
                    />
                )} */}
				{filters.map((filter, i) => (
					<ChipComponentW
						filterId={filter.id}
						isPrimaryFilter={i === 0}
						resetFilterIds={resetFilterIds}
						toggleFilterId={toggleFilterId}
						selected={selectedFilters.includes(filter)}
						index={i}
						key={filter.id}
					>
						{filter.name}
					</ChipComponentW>
				))}
			</S.ReactComponents.ScrollableContainer>
		)
	);
});
