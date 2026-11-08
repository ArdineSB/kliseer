import type { CSSProperties } from 'react';

type Props = { size?: number; style?: CSSProperties };

/**
 * Official lockup: purple rounded tile + white lens mark + two-color wordmark
 * ("kli" #302B49, "seer" #6D28D9), paths from logo-concepts/kliseer-lockup.svg
 * (same vector as the brand/lockup component in FigCraft).
 */
export function BrandLockup({ size = 28, style }: Props) {
  // Lockup viewBox 593×257; symbol tile 165×165 at (24,46). Render symbol at `size`, wordmark to its right at 0.475×.
  const w = size * 2.68;
  const h = size * 1.164;
  return (
    <svg className="brand-lockup" width={w} height={h} viewBox="0 0 593 257" role="img" aria-label="Kliseer" style={style}>
      <rect x="24" y="46" width="165" height="165" rx="41.25" fill="var(--action-primary)" />
      <g fill="#FFFFFF" transform="translate(35.6 56.3) scale(0.5543)">
        <path d="M62 44v168" fill="none" stroke="#FFFFFF" strokeWidth="40" strokeLinecap="round" />
        <path d="M212 44 128 128 212 212" fill="none" stroke="#FFFFFF" strokeWidth="40" strokeLinejoin="bevel" />
        <circle cx="212" cy="44" r="20" />
        <circle cx="212" cy="212" r="20" />
      </g>
      <g transform="translate(230 166.65) scale(0.1)">
        <path fill="var(--text-brand)" d="M174.50 0L70 0L70-720L174.50-720L174.50-384L476-720L606-720L287.50-368.50L629.50 0L495.50 0L174.50-344L174.50 0ZM814 0L709.50 0L709.50-735L814-735L814 0ZM1078.50-628.50L974-628.50L974-730L1078.50-730L1078.50-628.50ZM1078.50 0L974 0L974-540L1078.50-540L1078.50 0Z" />
        <path fill="var(--action-primary)" d="M1489.50 15Q1412 15 1349.75-11.75Q1287.50-38.50 1247.25-88.25Q1207-138 1195-206.50L1304-223Q1320.50-157 1373-120.25Q1425.50-83.50 1495.50-83.50Q1539.50-83.50 1575.50-97.25Q1612-111 1634.25-136.75Q1656.50-162.50 1656.50-198.50Q1656.50-218 1649.75-233Q1643-248 1631.25-259.25Q1619.50-270.50 1602.75-278.75Q1586-287 1566-293L1381.50-347.50Q1354.50-355.50 1326.50-368.25Q1298.50-381 1275.25-401.75Q1252-422.50 1237.50-453.25Q1223-484 1223-528Q1223-594.50 1257.25-640.75Q1291.50-687 1350-710.75Q1408.50-734.50 1481-734.50Q1554-733.50 1611.75-708.50Q1669.50-683.50 1707.75-636.75Q1746-590 1760.50-523.50L1648.50-504.50" />
      </g>
    </svg>
  );
}
