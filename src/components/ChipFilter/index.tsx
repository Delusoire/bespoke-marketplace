import { _ } from "/modules/Delusoire/stdlib/deps.js";
import { S } from "/modules/Delusoire/stdlib/index.js";
const { React } = S;

export const ChipFilter = React.memo(({ availableFilters, selectedFilters, toggleFilter, className }) => {
	const XXX = isSelected => (filter, index) => (
		<S.ReactComponents.Chip
			onClick={() => toggleFilter(filter)}
			selectedColorSet="invertedLight"
			selected={isSelected}
			secondary={isSelected && index > 0}
			style={{ marginBlockEnd: 0, willChange: "transform, opacity" }}
			tabIndex={-1}
			index={index}
			key={filter.key}
		>
			{filter.filter[""]}
		</S.ReactComponents.Chip>
	);

	return (
		selectedFilters.length + availableFilters.length > 0 && (
			<S.ReactComponents.ScrollableContainer className={className} ariaLabel={"Filter options"}>
				{selectedFilters.map(XXX(true))}
				{availableFilters.map(XXX(false))}
			</S.ReactComponents.ScrollableContainer>
		)
	);
});

export const getProp = (obj: any, path: string) => {
	if (path.startsWith(".")) {
		return _.get(obj, path.slice(1));
	}
	return obj;
};

export const useChipFilter = filters => {
	const [selectedFilterFullKey, setSelectedFilterFullKey] = React.useState(".");

	const selectedFilters = React.useMemo(
		() =>
			selectedFilterFullKey
				.split(".")
				.slice(1, -1)
				.reduce(
					(selectedFilters, selectedFilterFullKeyPart) => {
						const prevSelectedFilter = selectedFilters.at(-1);
						const selectedFilter = {
							key: `${prevSelectedFilter.key}${selectedFilterFullKeyPart}.`,
							filter: prevSelectedFilter.filter[selectedFilterFullKeyPart],
						};
						selectedFilters.push(selectedFilter);
						return selectedFilters;
					},
					[{ key: ".", filter: filters }],
				),
		[filters, selectedFilterFullKey],
	);

	const lastSelectedFilter = selectedFilters.at(-1);
	const availableFilters = [];
	for (const [k, v] of Object.entries(lastSelectedFilter.filter)) {
		if (k === "") continue;
		availableFilters.push({ key: `${lastSelectedFilter.key}${k}.`, filter: v });
	}

	const exclusiveSelectedFilters = selectedFilters.slice(1);

	const toggleFilter = React.useCallback(
		filter => setSelectedFilterFullKey(filter.key === selectedFilterFullKey ? "." : filter.key),
		[selectedFilterFullKey],
	);

	const chipFilter = <ChipFilter selectedFilters={exclusiveSelectedFilters} availableFilters={availableFilters} toggleFilter={toggleFilter} />;

	return [chipFilter, exclusiveSelectedFilters, selectedFilterFullKey, setSelectedFilterFullKey] as const;
};
