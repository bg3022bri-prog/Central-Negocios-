import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PackageCheck, Calendar } from 'lucide-react';
import { BusinessConfig, Order } from '../types';

interface MonthlyRevenueChartProps {
  orders: Order[];
  businessConfig: BusinessConfig;
}

interface MonthlyDataPoint {
  monthKey: string; // YYYY-MM
  label: string; // e.g. "May", "Jun"
  fullLabel: string; // e.g. "Mayo 2026"
  revenue: number;
  orderCount: number;
  isCurrentMonth: boolean;
}

const MONTH_NAMES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const MONTH_SHORT_ES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

export const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({
  orders,
  businessConfig,
}) => {
  const [viewMetric, setViewMetric] = useState<'revenue' | 'count'>('revenue');
  const [rangeMonths, setRangeMonths] = useState<number>(6); // 6 or 12

  // Current date
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIdx = now.getMonth(); // 0-11
  const currentMonthKey = `${currentYear}-${String(currentMonthIdx + 1).padStart(2, '0')}`;

  // Filter completed orders (status === 'entregado')
  const completedOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'entregado');
  }, [orders]);

  // Aggregate monthly data for the selected range of months
  const monthlyData: MonthlyDataPoint[] = useMemo(() => {
    // Generate the last N months sequence
    const monthsList: MonthlyDataPoint[] = [];

    for (let i = rangeMonths - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonthIdx - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth();
      const mKey = `${y}-${String(m + 1).padStart(2, '0')}`;

      monthsList.push({
        monthKey: mKey,
        label: MONTH_SHORT_ES[m],
        fullLabel: `${MONTH_NAMES_ES[m]} ${y}`,
        revenue: 0,
        orderCount: 0,
        isCurrentMonth: mKey === currentMonthKey,
      });
    }

    // Map completed orders into their respective month bucket
    completedOrders.forEach((ord) => {
      if (!ord.deliveryDate) return;
      const [ordY, ordM] = ord.deliveryDate.split('-');
      if (!ordY || !ordM) return;

      const key = `${ordY}-${ordM}`;
      const bucket = monthsList.find((b) => b.monthKey === key);
      if (bucket) {
        bucket.revenue += Number(ord.totalAmount) || 0;
        bucket.orderCount += 1;
      }
    });

    return monthsList;
  }, [completedOrders, currentYear, currentMonthIdx, currentMonthKey, rangeMonths]);

  // Current month vs previous month calculations
  const currentMonthData = monthlyData.find((d) => d.isCurrentMonth) || monthlyData[monthlyData.length - 1];
  const prevMonthIndex = monthlyData.findIndex((d) => d.isCurrentMonth) - 1;
  const prevMonthData = prevMonthIndex >= 0 ? monthlyData[prevMonthIndex] : null;

  const currentRevenue = currentMonthData ? currentMonthData.revenue : 0;
  const currentOrderCount = currentMonthData ? currentMonthData.orderCount : 0;
  const prevRevenue = prevMonthData ? prevMonthData.revenue : 0;

  const revenueGrowth =
    prevRevenue > 0
      ? Math.round(((currentRevenue - prevRevenue) / prevRevenue) * 100)
      : null;

  const totalPeriodRevenue = useMemo(() => {
    return monthlyData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [monthlyData]);

  const totalPeriodOrders = useMemo(() => {
    return monthlyData.reduce((acc, curr) => acc + curr.orderCount, 0);
  }, [monthlyData]);

  // Format YAxis ticks
  const formatYAxis = (val: number) => {
    if (viewMetric === 'count') return `${val}`;
    if (val >= 1000) return `$${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`;
    return `$${val}`;
  };

  return (
    <div className="p-5 bg-white rounded-lg border border-neutral-200 space-y-5">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Rendimiento Financiero</span>
            <span aria-hidden="true">·</span>
            <span>Órdenes Completadas</span>
          </div>
          <h2 className="text-base font-bold text-neutral-900 mt-0.5">
            Ingresos Mensuales por Órdenes Entregadas
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitorea el dinero real cobrado de pedidos cerrados y entregados con éxito a tus clientes.
          </p>
        </div>

        {/* View Segmented Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-md">
            <button
              onClick={() => setViewMetric('revenue')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                viewMetric === 'revenue'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Ingresos ($)
            </button>
            <button
              onClick={() => setViewMetric('count')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                viewMetric === 'count'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Órdenes (#)
            </button>
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-md">
            <button
              onClick={() => setRangeMonths(6)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                rangeMonths === 6
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              6 meses
            </button>
            <button
              onClick={() => setRangeMonths(12)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                rangeMonths === 12
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              12 meses
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlights Strip (Responsive stacking: 1 col on mobile, 2 on tablet, 4 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3 bg-neutral-50/80 rounded-lg border border-neutral-100 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Ingresos Este Mes</div>
            <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
              {revenueGrowth !== null ? (
                revenueGrowth >= 0 ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    +{revenueGrowth}% vs mes anterior
                  </span>
                ) : (
                  <span className="text-rose-700 font-medium flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    {revenueGrowth}% vs mes anterior
                  </span>
                )
              ) : (
                <span>Mes en curso</span>
              )}
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-neutral-900 tabular-nums shrink-0 sm:mt-1">
            ${currentRevenue.toLocaleString()} <span className="text-xs font-sans font-normal text-neutral-500">MXN</span>
          </div>
        </div>

        <div className="p-3 bg-neutral-50/80 rounded-lg border border-neutral-100 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Órdenes Entregadas (Mes)</div>
            <div className="text-xs text-neutral-500 mt-0.5">
              Completadas con éxito
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-neutral-900 tabular-nums shrink-0 sm:mt-1">
            {currentOrderCount} {currentOrderCount === 1 ? 'orden' : 'órdenes'}
          </div>
        </div>

        <div className="p-3 bg-neutral-50/80 rounded-lg border border-neutral-100 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Total en el Período</div>
            <div className="text-xs text-neutral-500 mt-0.5">
              Últimos {rangeMonths} meses
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-neutral-900 tabular-nums shrink-0 sm:mt-1">
            ${totalPeriodRevenue.toLocaleString()} <span className="text-xs font-sans font-normal text-neutral-500">MXN</span>
          </div>
        </div>

        <div className="p-3 bg-neutral-50/80 rounded-lg border border-neutral-100 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Ticket Promedio</div>
            <div className="text-xs text-neutral-500 mt-0.5">
              Por orden completada
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-neutral-900 tabular-nums shrink-0 sm:mt-1">
            ${totalPeriodOrders > 0 ? Math.round(totalPeriodRevenue / totalPeriodOrders).toLocaleString() : 0} <span className="text-xs font-sans font-normal text-neutral-500">MXN</span>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F3F4F6"
            />
            <XAxis
              dataKey="label"
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              tickFormatter={formatYAxis}
              tabular-nums="true"
            />
            <Tooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload as MonthlyDataPoint;
                return (
                  <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-md text-xs space-y-1.5 min-w-44">
                    <div className="font-bold text-neutral-900 pb-1 border-b border-neutral-100 flex items-center justify-between">
                      <span>{data.fullLabel}</span>
                      {data.isCurrentMonth && (
                        <span className="text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded font-normal">
                          Actual
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-neutral-600">
                      <span>Ingresos Totales:</span>
                      <strong className="font-mono text-neutral-900 tabular-nums">
                        ${data.revenue.toLocaleString()} MXN
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-neutral-600">
                      <span>Órdenes Completadas:</span>
                      <span className="font-mono text-neutral-800 tabular-nums font-semibold">
                        {data.orderCount}
                      </span>
                    </div>
                    {data.orderCount > 0 && (
                      <div className="flex justify-between items-center text-neutral-500 pt-0.5 border-t border-neutral-100 text-[11px]">
                        <span>Ticket promedio:</span>
                        <span className="font-mono tabular-nums">
                          ${Math.round(data.revenue / data.orderCount).toLocaleString()} MXN
                        </span>
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <Bar
              dataKey={viewMetric === 'revenue' ? 'revenue' : 'orderCount'}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            >
              {monthlyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isCurrentMonth
                      ? '#171717' // Current month: prominent dark neutral
                      : '#9CA3AF' // Historical months: calm structural neutral
                  }
                  className="transition-opacity hover:opacity-85"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Context Footer */}
      <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-neutral-900 inline-block" />
            <span className="text-neutral-700 font-medium">Mes en Curso ({MONTH_NAMES_ES[currentMonthIdx]})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-neutral-400 inline-block" />
            <span>Meses Anteriores</span>
          </div>
        </div>

        <div className="text-neutral-400">
          Solo contabiliza órdenes con estado <span className="font-medium text-neutral-600">"Entregado"</span>.
        </div>
      </div>
    </div>
  );
};
