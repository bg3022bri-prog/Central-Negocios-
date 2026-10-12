import React, { useState } from 'react';
import { Calculator, AlertTriangle, Clock, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { BusinessConfig } from '../types';

interface DiagnosticCalculatorProps {
  businessConfig: BusinessConfig;
  onGoToAbout: () => void;
}

export const DiagnosticCalculator: React.FC<DiagnosticCalculatorProps> = ({
  businessConfig,
  onGoToAbout,
}) => {
  const [scatteredChannels, setScatteredChannels] = useState<number>(3); // 1 = 1 canal, 2 = 2-3, 3 = 4+
  const [weeklyHoursLost, setWeeklyHoursLost] = useState<number>(5); // 2 to 15 hrs
  const [monthlyIncidents, setMonthlyIncidents] = useState<number>(2); // 0 to 6
  const [averageTicket, setAverageTicket] = useState<number>(350); // in MXN

  // Calculations
  const monthlyHoursLost = weeklyHoursLost * 4;
  const lostRevenueFromIncidents = monthlyIncidents * averageTicket;
  const lostLaborValue = monthlyHoursLost * 80; // Estimated $80/hr owner time opportunity cost
  const totalMonthlyLoss = lostRevenueFromIncidents + lostLaborValue;
  const annualLoss = totalMonthlyLoss * 12;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
          <span>Herramienta de Diagnóstico</span>
          <span aria-hidden="true">·</span>
          <span>Evaluación de Fugas Administrativas</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Diagnóstico: ¿Cuánto le Cuesta el Desorden a tu Negocio?
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-3xl">
          Llevar notas en chats de WhatsApp, libretas de papel y archivos sueltos no solo causa estrés: provoca citas empalmadas, pedidos olvidados y horas de tiempo desperdiciadas. Calcula tu impacto real.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 4 Interactive Question Sliders / Choices */}
        <div className="lg:col-span-7 bg-white p-5 rounded-lg border border-neutral-200 space-y-6">
          <h2 className="text-sm font-bold text-neutral-900 pb-2 border-b border-neutral-100">
            Preguntas de Diagnóstico Operativo
          </h2>

          {/* Q1: Dispersión */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-neutral-800">
                1. ¿En cuántos lugares anotas pedidos, citas y pendientes?
              </label>
              <span className="font-mono text-neutral-600">
                {scatteredChannels === 1 ? '1 sistema ordenado' : scatteredChannels === 2 ? '2 o 3 (WhatsApp + Libreta)' : '4 o más (Varios chats, notas, papel)'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={scatteredChannels}
              onChange={(e) => setScatteredChannels(parseInt(e.target.value, 10))}
              className="w-full accent-neutral-900"
            />
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Todo en 1 lugar</span>
              <span>WhatsApp + Libreta</span>
              <span>Completamente disperso</span>
            </div>
          </div>

          {/* Q2: Horas semanales buscando información */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-neutral-800">
                2. ¿Cuántas horas a la semana dedicas a buscar chats o confirmar pendientes?
              </label>
              <span className="font-mono font-bold text-neutral-900 tabular-nums">
                {weeklyHoursLost} horas / semana
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={weeklyHoursLost}
              onChange={(e) => setWeeklyHoursLost(parseInt(e.target.value, 10))}
              className="w-full accent-neutral-900"
            />
            <div className="flex justify-between text-xs text-neutral-400">
              <span>1 hora</span>
              <span>7 horas</span>
              <span>15 horas o más</span>
            </div>
          </div>

          {/* Q3: Incidentes mensuales (citas empalmadas / pedidos olvidados) */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-neutral-800">
                3. ¿Cuántas citas olvidadas, empalmadas o reclamos de entrega ocurren al mes?
              </label>
              <span className="font-mono font-bold text-neutral-900 tabular-nums">
                {monthlyIncidents} incidentes al mes
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              step="1"
              value={monthlyIncidents}
              onChange={(e) => setMonthlyIncidents(parseInt(e.target.value, 10))}
              className="w-full accent-neutral-900"
            />
            <div className="flex justify-between text-xs text-neutral-400">
              <span>0 incidentes</span>
              <span>4 incidentes</span>
              <span>8 o más incidentes</span>
            </div>
          </div>

          {/* Q4: Ticket promedio */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-neutral-800">
                4. ¿Cuál es el ticket o valor promedio de cada venta o servicio?
              </label>
              <span className="font-mono font-bold text-neutral-900 tabular-nums">
                ${averageTicket} MXN
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={averageTicket}
              onChange={(e) => setAverageTicket(parseInt(e.target.value, 10))}
              className="w-full accent-neutral-900"
            />
            <div className="flex justify-between text-xs text-neutral-400">
              <span>$100 MXN</span>
              <span>$1,000 MXN</span>
              <span>$2,000 MXN</span>
            </div>
          </div>
        </div>

        {/* Right: Diagnosis Results Card */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-neutral-200 space-y-5">
          <div className="pb-3 border-b border-neutral-100">
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              Resultado de tu Diagnóstico
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mt-0.5">
              Impacto del Desorden Administrativo
            </h3>
          </div>

          {/* Key Metrics */}
          <div className="space-y-3">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-500 font-medium">Tiempo perdido al mes</div>
                <div className="text-xl font-bold font-mono tabular-nums text-neutral-900 mt-0.5">
                  {monthlyHoursLost} horas
                </div>
              </div>
              <Clock className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-500 font-medium">Pérdida mensual estimada</div>
                <div className="text-xl font-bold font-mono tabular-nums text-rose-700 mt-0.5">
                  ${totalMonthlyLoss.toLocaleString()} MXN
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-rose-500" />
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-500 font-medium">Fuga anual proyectada</div>
                <div className="text-xl font-bold font-mono tabular-nums text-neutral-900 mt-0.5">
                  ${annualLoss.toLocaleString()} MXN / año
                </div>
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          {/* Actionable recommendation */}
          <div className="p-3.5 bg-neutral-900 text-white rounded-lg space-y-2">
            <div className="text-xs font-semibold text-emerald-400">
              Solución Recomendada
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Centralizar citas, pedidos y tareas en esta herramienta digital económica recupera hasta el 90% de esas horas y elimina por completo los reclamos por pedidos olvidados.
            </p>
            <button
              onClick={onGoToAbout}
              className="mt-2 w-full py-2 px-3 text-xs font-semibold bg-white text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ver Planes y Servicio de Implementación</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
