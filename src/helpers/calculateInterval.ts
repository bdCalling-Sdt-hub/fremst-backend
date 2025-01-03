export const calculateInspectionInterval = (
  startDate: Date,
  endDate: Date
): number => {
  // Calculate the month difference
  const monthDifference =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  // Ensure we return absolute value to handle both future and past dates
  return Math.abs(monthDifference);
};
