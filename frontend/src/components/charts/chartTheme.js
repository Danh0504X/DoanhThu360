// Shared Recharts styling so every chart in the app reads the same way
// instead of each screen re-declaring its own axis/grid colors.
export const chartAxisTick = { fontSize: 11, fill: '#8c8579' };

export const chartCartesianGridProps = {
  strokeDasharray: '3 3',
  stroke: '#e7e3dc',
  vertical: false,
};

export const chartAxisProps = {
  tick: chartAxisTick,
  tickLine: false,
  axisLine: false,
};
