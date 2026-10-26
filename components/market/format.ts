export const formatPrice = (value: number, digits = 2): string =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const formatSigned = (value: number): string =>
  `${value > 0 ? '+' : ''}${formatPrice(value)}`;

export const formatQuantity = (value: number): string => value.toFixed(4);

export const formatTime = (timestamp: number, withMilliseconds = false): string =>
  new Date(timestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    ...(withMilliseconds ? { fractionalSecondDigits: 3 as const } : {}),
  });

export const formatLatency = (ms: number | null): string =>
  ms === null ? '—' : `${Math.round(ms)} ms`;
