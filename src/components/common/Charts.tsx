import React from 'react';
import { formatINR } from '../../utils/format';

export interface BarDatum {
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
}

export const SimpleBarChart: React.FC<{
  data: BarDatum[];
  height?: number;
  formatValue?: (v: number) => string;
  defaultColor?: string;
}> = ({
  data,
  height = 200,
  formatValue = formatINR,
  defaultColor = '#172D4D',
}) => {
  const maxVal = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="w-full">
      <div
        className="flex items-end gap-2 sm:gap-3 pt-4 pb-2 border-b border-slate-200"
        style={{ height }}
      >
        {data.map((d, idx) => {
          const pct = Math.max(4, Math.round((d.value / maxVal) * 100));
          return (
            <div
              key={`${d.label}-${idx}`}
              className="flex-1 flex flex-col items-center justify-end h-full group min-w-0"
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 text-[11px] font-mono-tabular text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap pointer-events-none">
                {formatValue(d.value)}
              </div>
              <div className="w-full max-w-[38px] flex-1 flex items-end">
                <div
                  className="w-full rounded-t-[4px] transition-all duration-200 group-hover:opacity-85"
                  style={{
                    height: `${pct}%`,
                    backgroundColor: d.color || defaultColor,
                  }}
                  title={`${d.label}: ${formatValue(d.value)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 sm:gap-3 pt-2">
        {data.map((d, idx) => (
          <div
            key={`lbl-${d.label}-${idx}`}
            className="flex-1 text-center text-[11px] text-slate-500 truncate"
          >
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ServiceSplitBar: React.FC<{
  items: { label: string; amount: number; color: string; countLabel: string }[];
}> = ({ items }) => {
  const total = Math.max(
    1,
    items.reduce((sum, i) => sum + i.amount, 0)
  );

  return (
    <div className="space-y-4">
      <div className="h-3 w-full bg-slate-100 rounded-sm overflow-hidden flex">
        {items.map((item) => {
          const widthPct = Math.round((item.amount / total) * 100);
          return (
            <div
              key={item.label}
              style={{ width: `${widthPct}%`, backgroundColor: item.color }}
              className="h-full transition-all"
              title={`${item.label}: ${formatINR(item.amount)}`}
            />
          );
        })}
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const pct = Math.round((item.amount / total) * 100);
          return (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-[2px] shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-800">{item.label}</span>
                <span className="text-xs text-slate-500">· {item.countLabel}</span>
              </div>
              <div className="flex items-center gap-3 tabular-nums">
                <span className="text-xs text-slate-500">{pct}%</span>
                <span className="font-semibold text-slate-900 font-mono-tabular">
                  {formatINR(item.amount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TrendSparkLine: React.FC<{
  data: { label: string; value: number }[];
  strokeColor?: string;
  height?: number;
}> = ({ data, strokeColor = '#172D4D', height = 140 }) => {
  if (!data.length) return null;
  const w = 520;
  const h = height;
  const padX = 16;
  const padY = 16;
  const maxVal = Math.max(1, ...data.map((d) => d.value));

  const points = data.map((d, i) => {
    const x =
      data.length === 1
        ? w / 2
        : padX + (i / (data.length - 1)) * (w - padX * 2);
    const y = h - padY - (d.value / maxVal) * (h - padY * 2);
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${
    h - padY
  } L ${points[0].x.toFixed(1)} ${h - padY} Z`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="Trend line chart"
      >
        <line
          x1={padX}
          y1={h - padY}
          x2={w - padX}
          y2={h - padY}
          stroke="#E2E8F0"
          strokeWidth="1"
        />
        <path d={areaPath} fill={strokeColor} fillOpacity="0.08" />
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#FFFFFF" stroke={strokeColor} strokeWidth="2">
              <title>{`${p.label}: ${p.value}`}</title>
            </circle>
          </g>
        ))}
      </svg>
      <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-500">
        {data.map((d, i) => (
          <span key={i} className="truncate">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
};
