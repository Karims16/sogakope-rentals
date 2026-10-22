export function getUnitCounts(
  availableUnits: number | null | undefined,
  totalUnits: number | null | undefined,
) {
  return {
    available: availableUnits ?? 1,
    total: totalUnits ?? 1,
  };
}

export function unitAvailabilityLabel(
  availableUnits: number | null | undefined,
  totalUnits: number | null | undefined,
): string {
  const { available, total } = getUnitCounts(availableUnits, totalUnits);

  if (available <= 0) return "Fully Occupied";
  if (available === 1) return "Only 1 unit left";
  if (available < total) return `${available} of ${total} available`;
  return `${available} units left`;
}
