import React, { useState } from 'react';
import { Calendar, Plus, Search, MessageSquare, Trash2, Clock, User, Check, X } from 'lucide-react';
import { Appointment, AppointmentStatus, BusinessConfig } from '../types';
import { getRelativeDate } from '../data/mockData';

interface AppointmentsTabProps {
  businessConfig: BusinessConfig;
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onDeleteAppointment: (id: string) => void;
  onOpenNewModal: () => void;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  businessConfig,
  appointments,
  onAddAppointment,
  onUpdateStatus,
  onDeleteAppointment,
  onOpenNewModal,
}) => {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');

  const todayStr = getRelativeDate(0);
  const tomorrowStr = getRelativeDate(1);

  const filteredAppointments = appointments.filter((apt) => {
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = apt.clientName.toLowerCase().includes(q);
      const matchService = apt.service.toLowerCase().includes(q);
      const matchPhone = apt.clientPhone.includes(q);
      if (!matchName && !matchService && !matchPhone) return false;
    }

    // Date
    if (dateFilter === 'today' && apt.date !== todayStr) return false;
    if (dateFilter === 'tomorrow' && apt.date !== tomorrowStr) return false;

    // Status
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;

    // Staff
    if (staffFilter !== 'all' && apt.staff !== staffFilter) return false;

    return true;
  });

  // Sort chronologically by date and time
  filteredAppointments.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  const handleSendWhatsAppReminder = (apt: Appointment) => {
    const isToday = apt.date === todayStr;
    const isTomorrow = apt.date === tomorrowStr;
    const when = isToday ? 'hoy' : isTomorrow ? 'mañana' : `el día ${apt.date}`;

    const text = encodeURIComponent(
      `Hola ${apt.clientName}! Te saludamos de ${businessConfig.name}. Te recordamos tu ${businessConfig.appointmentTerm.toLowerCase()} para ${when} a las ${apt.time} (${apt.service}). ¿Nos confirmas tu asistencia? ¡Te esperamos!`
    );
    const cleanPhone = apt.clientPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Agenda y Control de {businessConfig.appointmentTerm}s
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Centraliza los turnos agendados por WhatsApp, llamadas o presencial. Envía recordatorios para evitar ausencias.
          </p>
        </div>
        <button
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva {businessConfig.appointmentTerm}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={`Buscar por cliente, servicio o teléfono...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {/* Date Segmented Controls */}
          <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-md shrink-0">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                dateFilter === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Todas las fechas
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                dateFilter === 'today'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setDateFilter('tomorrow')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                dateFilter === 'tomorrow'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Mañana
            </button>
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md text-neutral-700 focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmada">Confirmadas</option>
            <option value="en_proceso">En Atención</option>
            <option value="completada">Completadas</option>
            <option value="cancelada">Canceladas</option>
          </select>

          {/* Staff Dropdown */}
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md text-neutral-700 focus:outline-none"
          >
            <option value="all">Todo el personal</option>
            {businessConfig.staffList.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-neutral-200">
          <Calendar className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-neutral-800">
            No se encontraron {businessConfig.appointmentTerm.toLowerCase()}s con los filtros seleccionados
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Intenta cambiar los filtros de fecha o búsqueda, o registra una nueva {businessConfig.appointmentTerm.toLowerCase()}.
          </p>
          <button
            onClick={onOpenNewModal}
            className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            + Registrar {businessConfig.appointmentTerm}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 divide-y divide-neutral-100 overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 bg-neutral-50 text-xs font-semibold text-neutral-500">
            <div className="col-span-2">Fecha y Hora</div>
            <div className="col-span-3">Cliente & Contacto</div>
            <div className="col-span-3">Servicio y Asignado</div>
            <div className="col-span-2">Monto y Estado</div>
            <div className="col-span-2 text-right">Acciones</div>
          </div>

          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 md:px-4 md:py-3.5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center hover:bg-neutral-50/50 transition-colors"
            >
              {/* Date & Time */}
              <div className="col-span-2 space-y-0.5">
                <div className="text-xs font-bold text-neutral-900 font-mono tabular-nums">
                  {apt.time} hrs
                </div>
                <div className="text-xs text-neutral-500 font-mono tabular-nums">
                  {apt.date === todayStr ? 'Hoy' : apt.date === tomorrowStr ? 'Mañana' : apt.date}
                </div>
                {apt.durationMinutes > 0 && (
                  <div className="text-xs text-neutral-400">
                    {apt.durationMinutes} min
                  </div>
                )}
              </div>

              {/* Client & Phone */}
              <div className="col-span-3 space-y-0.5">
                <div className="text-sm font-semibold text-neutral-900">
                  {apt.clientName}
                </div>
                <div className="text-xs text-neutral-500 font-mono">
                  {apt.clientPhone || 'Sin teléfono registrado'}
                </div>
                {apt.notes && (
                  <div className="text-xs text-neutral-500 italic truncate max-w-xs">
                    "{apt.notes}"
                  </div>
                )}
              </div>

              {/* Service & Staff */}
              <div className="col-span-3 space-y-0.5">
                <div className="text-xs font-medium text-neutral-900">
                  {apt.service}
                </div>
                <div className="text-xs text-neutral-500 flex items-center gap-1">
                  <span>Atiende:</span>
                  <span className="font-medium text-neutral-700">{apt.staff}</span>
                </div>
              </div>

              {/* Price & Status */}
              <div className="col-span-2 space-y-1">
                <div className="text-xs font-mono font-semibold text-neutral-900 tabular-nums">
                  {apt.price > 0 ? `$${apt.price} MXN` : 'Sin costo'}
                </div>
                <select
                  value={apt.status}
                  onChange={(e) => onUpdateStatus(apt.id, e.target.value as AppointmentStatus)}
                  className={`text-xs py-0.5 px-1.5 rounded border focus:outline-none ${
                    apt.status === 'confirmada'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : apt.status === 'en_proceso'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : apt.status === 'completada'
                      ? 'bg-neutral-100 text-neutral-600 border-neutral-200'
                      : apt.status === 'cancelada'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="en_proceso">En Atención</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                <button
                  onClick={() => handleSendWhatsAppReminder(apt)}
                  title="Enviar recordatorio automático por WhatsApp"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Recordar</span>
                </button>
                <button
                  onClick={() => onDeleteAppointment(apt.id)}
                  title="Eliminar cita"
                  className="p-1 text-neutral-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
