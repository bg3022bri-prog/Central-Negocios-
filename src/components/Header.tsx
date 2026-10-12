import React from 'react';
import { Calendar, ShoppingBag, CheckSquare, Sparkles, HelpCircle, Plus, Users, Calculator } from 'lucide-react';
import { BusinessType } from '../types';
import { BUSINESS_CONFIGS } from '../data/mockData';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentBusinessType: BusinessType;
  onChangeBusinessType: (type: BusinessType) => void;
  onOpenNewModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currentBusinessType,
  onChangeBusinessType,
  onOpenNewModal,
}) => {
  const currentConfig = BUSINESS_CONFIGS[currentBusinessType];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      {/* Primary Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-lg tracking-tight">
              CN
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 block">
                CentralNegocio
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentTab === 'dashboard'
                ? 'text-neutral-950 font-semibold border-neutral-900'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Tablero Hoy
          </button>
          <button
            onClick={() => onSelectTab('appointments')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentTab === 'appointments'
                ? 'text-neutral-950 font-semibold border-neutral-900'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Agenda & Horarios
          </button>
          <button
            onClick={() => onSelectTab('orders')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentTab === 'orders'
                ? 'text-neutral-950 font-semibold border-neutral-900'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Pedidos & Ventas
          </button>
          <button
            onClick={() => onSelectTab('tasks')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentTab === 'tasks'
                ? 'text-neutral-950 font-semibold border-neutral-900'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Tareas del Equipo
          </button>
          <button
            onClick={() => onSelectTab('importer')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentTab === 'importer'
                ? 'text-neutral-950 font-semibold border-neutral-900'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Captura WhatsApp
          </button>
          <button
            onClick={() => onSelectTab('clients')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentTab === 'clients'
                ? 'text-neutral-950 font-semibold border-neutral-900'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Clientes
          </button>
          <button
            onClick={() => onSelectTab('calculator')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentTab === 'calculator'
                ? 'text-neutral-950 font-semibold border-neutral-900'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Diagnóstico
          </button>
          <button
            onClick={() => onSelectTab('about')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentTab === 'about'
                ? 'text-neutral-950 font-semibold border-neutral-900'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Sobre el Servicio
          </button>
        </nav>

        {/* Zone 3: 1 primary action & PWA install */}
        <div className="flex items-center gap-2.5 shrink-0">
          <PWAInstallButton />
          <button
            onClick={onOpenNewModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Registro</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Workspace business type profile switcher and mobile quick nav */}
      <div className="border-t border-neutral-100 bg-neutral-50/70 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Business Vertical Preset Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 font-medium whitespace-nowrap">Modo de Negocio:</span>
            <div className="flex items-center gap-1 p-0.5 bg-neutral-200/70 rounded-md">
              {(['barberia', 'comida', 'tienda', 'servicios'] as BusinessType[]).map((type) => {
                const conf = BUSINESS_CONFIGS[type];
                const isActive = currentBusinessType === type;
                return (
                  <button
                    key={type}
                    onClick={() => onChangeBusinessType(type)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Active Business info kicker */}
          <div className="hidden sm:flex items-center gap-2 text-neutral-500">
            <span className="font-semibold text-neutral-800">{currentConfig.name}</span>
            <span>·</span>
            <span className="truncate max-w-xs">{currentConfig.slogan}</span>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="flex lg:hidden w-full overflow-x-auto gap-2 pt-1 border-t border-neutral-200/60 pb-1">
            {[
              { id: 'dashboard', label: 'Tablero' },
              { id: 'appointments', label: 'Citas' },
              { id: 'orders', label: 'Pedidos' },
              { id: 'tasks', label: 'Tareas' },
              { id: 'importer', label: 'WhatsApp' },
              { id: 'clients', label: 'Clientes' },
              { id: 'calculator', label: 'Diagnóstico' },
              { id: 'about', label: 'Servicio' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTab(t.id)}
                className={`px-2.5 py-1 rounded text-xs whitespace-nowrap shrink-0 ${
                  currentTab === t.id
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'bg-white text-neutral-700 border border-neutral-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
