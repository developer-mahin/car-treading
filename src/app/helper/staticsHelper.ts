/* eslint-disable @typescript-eslint/no-explicit-any */
export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const statisticHelper = (year: string) => {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31T23:59:59`);

  return {
    startDate,
    endDate,
  };
};

const formattedResult = (
  result: any[],
  baseOn: string,
  keyField: string,
  keys: string[],
) => {
  return months.map((month, index) => {
    const monthData = result.find((r: any) => r.month === index + 1);

    // Create an object to store counts dynamically
    const counts: Record<string, number> = {};

    keys.forEach((key) => {
      counts[key] =
        monthData?.[baseOn]?.find((r: any) => r[keyField] === key)?.count || 0;
    });

    return {
      month: month,
      ...counts,
    };
  });
};

export const StatisticHelper = {
  statisticHelper,
  formattedResult,
};
