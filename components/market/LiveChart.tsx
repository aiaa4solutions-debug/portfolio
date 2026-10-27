"use client";
import { Translated, useLanguage } from "@/components/language-provider";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatTime } from "./format";

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
  dash?: string;
}

export interface LiveChartProps<T extends { t: number }> {
  data: T[];
  series: ChartSeries[];
  hidden: Record<string, boolean>;
  onToggleSeries: (key: string) => void;
  formatValue: (value: number) => string;
  ariaLabel: string;
  /** Margin added above and below the values on the Y axis. */
  yPad?: number;
  yWidth?: number;
  /** Draws a horizontal line at this value (for example 0 for a spread). */
  referenceY?: number;
  footnote?: string;
}

/**
 * Live curves with a custom tooltip. The tooltip follows the mouse, but its values are
 * read from `data` at the hovered index: the vertical marker and the colored dots show
 * exactly which data point is displayed. Keyboard: arrows, Home, End and Escape.
 */
export function LiveChart<T extends { t: number }>({
  data,
  series,
  hidden,
  onToggleSeries,
  formatValue,
  ariaLabel,
  yPad = 10,
  yWidth = 84,
  referenceY,
  footnote,
}: LiveChartProps<T>) {
  const hintId = useId();
  const { t } = useLanguage();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [keyboardMode, setKeyboardMode] = useState(false);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const valueAt = (point: T, key: string): number | undefined => {
    const value = (point as unknown as Record<string, unknown>)[key];
    return typeof value === "number" ? value : undefined;
  };

  // Places the tooltip near the cursor, flipping it when it would overflow. The style
  // is set directly: no React render on every mouse move.
  const positionTooltip = () => {
    const tip = tooltipRef.current;
    const box = boxRef.current;
    if (!tip || !box) return;

    const offset = 16;
    const { x, y } = mouseRef.current;

    let left = x + offset;
    let top = y + offset;
    if (left + tip.offsetWidth > box.clientWidth)
      left = x - tip.offsetWidth - offset;
    if (top + tip.offsetHeight > box.clientHeight)
      top = y - tip.offsetHeight - offset;

    tip.style.transform = `translate(${Math.max(0, left)}px, ${Math.max(0, top)}px)`;
  };

  const handleBoxMove = (event: MouseEvent<HTMLDivElement>) => {
    const box = boxRef.current;
    if (!box) return;

    const rect = box.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    if (keyboardMode) setKeyboardMode(false);
    positionTooltip();
  };

  // Index of the point under the cursor, provided by Recharts (versions 2 and 3).
  const handleChartMove = (state: unknown) => {
    const s = state as {
      activeTooltipIndex?: number | string | null;
      activeIndex?: number | string | null;
    };
    const raw = s?.activeTooltipIndex ?? s?.activeIndex;
    const index = raw === null || raw === undefined ? Number.NaN : Number(raw);
    setHoverIdx(Number.isInteger(index) && index >= 0 ? index : null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (data.length === 0) return;

    if (event.key === "Escape") {
      setHoverIdx(null);
      return;
    }
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    setKeyboardMode(true);

    const box = boxRef.current;
    if (box) mouseRef.current = { x: box.clientWidth / 2, y: 24 };

    const lastIndex = data.length - 1;
    setHoverIdx((previous) => {
      if (event.key === "Home") return 0;
      if (event.key === "End") return lastIndex;
      const current = previous ?? lastIndex;
      return Math.min(
        lastIndex,
        Math.max(0, current + (event.key === "ArrowRight" ? 1 : -1)),
      );
    });
  };

  const hoverPoint =
    hoverIdx !== null && hoverIdx < data.length
      ? (data[hoverIdx] ?? null)
      : null;

  const rows = hoverPoint
    ? series
        .filter((s) => !hidden[s.key])
        .flatMap((s) => {
          const value = valueAt(hoverPoint, s.key);
          return value === undefined ? [] : [{ ...s, value }];
        })
        .sort((a, b) => b.value - a.value) // same order as the curves on screen
    : [];

  return (
    <div>
      <div
        role="group"
        aria-label={t("Visible curves")}
        className="mb-3 flex flex-wrap gap-2"
      >
        {series.map((s) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={!hidden[s.key]}
            onClick={() => onToggleSeries(s.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${
              hidden[s.key]
                ? "border-border text-muted-foreground opacity-60"
                : "border-border text-foreground"
            }`}
          >
            <svg width="22" height="6" aria-hidden="true">
              <line
                x1="0"
                y1="3"
                x2="22"
                y2="3"
                stroke={s.color}
                strokeWidth="2.5"
                strokeDasharray={s.dash}
              />
            </svg>
            <Translated text={s.label} />
          </button>
        ))}
      </div>

      <div
        ref={boxRef}
        role="group"
        aria-label={t(ariaLabel)}
        aria-describedby={hintId}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseMove={handleBoxMove}
        className="relative h-80 overflow-hidden rounded-lg bg-slate-950 p-3 sm:h-96"
      >
        {data.length < 2 ? (
          <div
            className="flex h-full flex-col justify-end gap-2"
            aria-hidden="true"
          >
            <p className="font-mono text-xs text-slate-500">
              <Translated text={"Collecting the first points..."} />
            </p>
            {[40, 65, 50, 80].map((width) => (
              <div
                key={width}
                style={{ width: `${width}%` }}
                className="h-2 rounded bg-slate-800 motion-safe:animate-pulse"
              />
            ))}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 16, bottom: 0, left: 8 }}
              onMouseMove={handleChartMove}
              onMouseLeave={() => setHoverIdx(null)}
            >
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis
                dataKey="t"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(value: number) => formatTime(value)}
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                minTickGap={48}
              />
              <YAxis
                domain={[`dataMin - ${yPad}`, `dataMax + ${yPad}`]}
                tickFormatter={(value: number) => formatValue(value)}
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                width={yWidth}
              />

              {/* Kept active to track the mouse, but renders nothing:
                  the display is handled below. */}
              <Tooltip content={() => null} cursor={false} />

              {referenceY !== undefined && (
                <ReferenceLine y={referenceY} stroke="#475569" />
              )}

              {series.map((s) => (
                <Line
                  key={s.key}
                  type="linear"
                  dataKey={s.key}
                  name={t(s.label)}
                  stroke={s.color}
                  strokeWidth={2}
                  strokeDasharray={s.dash}
                  dot={false}
                  activeDot={false}
                  hide={hidden[s.key]}
                  connectNulls
                  isAnimationActive={false}
                />
              ))}

              {hoverPoint && (
                <ReferenceLine
                  x={hoverPoint.t}
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                />
              )}
              {hoverPoint &&
                rows.map((row) => (
                  <ReferenceDot
                    key={row.key}
                    x={hoverPoint.t}
                    y={row.value}
                    r={4}
                    fill={row.color}
                    stroke="#0f172a"
                    strokeWidth={1.5}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        )}

        {hoverPoint && rows.length > 0 && (
          <div
            ref={(element) => {
              tooltipRef.current = element;
              // Reposition on mount and after every render (the size can change).
              if (element) positionTooltip();
            }}
            aria-live={keyboardMode ? "polite" : "off"}
            className="pointer-events-none absolute left-0 top-0 z-10 rounded-lg border border-slate-700 bg-slate-900/95 px-3 py-2 font-mono text-xs shadow-lg"
          >
            <div className="mb-1 text-slate-400">
              {formatTime(hoverPoint.t)}
            </div>
            {rows.map((row) => (
              <div
                key={row.key}
                className="flex items-center justify-between gap-4"
              >
                <span className="flex items-center gap-1.5 text-slate-300">
                  <svg width="14" height="6" aria-hidden="true">
                    <line
                      x1="0"
                      y1="3"
                      x2="14"
                      y2="3"
                      stroke={row.color}
                      strokeWidth="2.5"
                      strokeDasharray={row.dash}
                    />
                  </svg>
                  <Translated text={row.label} />
                </span>
                <span className="font-bold text-slate-100">
                  {formatValue(row.value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p id={hintId} className="mt-2 text-xs text-muted-foreground">
        {footnote && (
          <>
            <Translated text={footnote} />{" "}
          </>
        )}
        <Translated
          text={
            "Keyboard: left and right arrows to browse the values, Escape to close."
          }
        />
      </p>
    </div>
  );
}
