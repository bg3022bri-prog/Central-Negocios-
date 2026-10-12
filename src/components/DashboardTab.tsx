import React from 'react';
import { Calendar, ShoppingBag, CheckSquare, Clock, MessageSquare, AlertCircle, CheckCircle, ArrowRight, DollarSign } from 'lucide-react';
import { Appointment, BusinessConfig, Order, Task } from '../types';
import { getRelativeDate } from '../data/mockData';
import { MonthlyRevenueChart } from './MonthlyRevenueChart';

interface DashboardTabProps {
  businessConfig: BusinessConfig;
  appointments: Appointment[];
  orders: Order[];
  tasks: Task[];
  onOpenNewModal: (initialTab?: 'appointment' | 'order' | 'task') => void;
  onOpenImporter: () => void;
  onSelectTab: (tab: string) => void;
  onToggleTask: (taskId: string) => void;
  onUpdateAppointmentStatus: (id: string, status: any) => void;
  onUpdateOrderStatus: (id: string, status: any) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  businessConfig,
  appointments,
  orders,
  tasks,
  onOpenNewModal,
  onOpenImporter,
  onSelectTab,
  onToggleTask,
  onUpdateAppointmentStatus,
  onUpdateOrderStatus,
}) => {
  const todayStr = getRelativeDate(0);

  // Filter for today
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const todayOrders = orders.filter((o) => o.deliveryDate === todayStr);
  const urgentTasks = tasks.filter((t) => !t.completed);

  // Calculate pending balances to collect
  const pendingCollections = todayOrders.reduce((acc, curr) => {
    const remaining = curr.totalAmount - curr.depositPaid;
    return acc + (remaining > 0 ? remaining : 0);
  }, 0);

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  // Format today date in Spanish
  const todayFormatted = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const handleSendWhatsAppReminder = (apt: Appointment) => {
    const text = encodeURIComponent(
      `Hola ${apt.clientName}! Te saludamos de ${businessConfig.name}. Te recordamos tu ${businessConfig.appointmentTerm.toLowerCase()} programada para hoy a las ${apt.time} (${apt.service}). ¿Nos confirmas tu asistencia? ¡Te esperamos!`
    );
    const cleanPhone = apt.clientPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleSendWhatsAppOrderUpdate = (ord: Order) => {
    const balance = ord.totalAmount - ord.depositPaid;
    const balanceText = balance > 0 ? ` Saldo pendiente por liquidar: $${balance} MXN.` : ' Pedido totalmente liquidado.';
    const text = encodeURIComponent(
      `Hola ${ord.clientName}! Te informamos de ${businessConfig.name} que tu pedido ${ord.orderNumber} está listo para entrega a las ${ord.deliveryTime}.${balanceText} Muchas gracias por tu preferencia!`
    );
    const cleanPhone = ord.clientPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span className="capitalize">{todayFormatted}</span>
            <span aria-hidden="true">·</span>
            <span>Turno Operativo Activo</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-neutral-700">{businessConfig.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            {businessConfig.name}
          </h1>
          <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
            Centro de operaciones diario para centralizar citas, pedidos por entregar y responsabilidades en un solo lugar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
          <button
            onClick={onOpenImporter}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-800 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span className="truncate">Pegar WhatsApp / Libreta</span>
          </button>
          <button
            onClick={() => onOpenNewModal('appointment')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <span className="whitespace-nowrap">+ Agendar Hoy</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Counters (Responsive layout: stacks cleanly on mobile, 2 cols on tablet, 4 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Citas */}
        <div className="p-4 sm:p-4.5 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors shadow-xs flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{businessConfig.appointmentTerm}s Hoy</span>
            </div>
            <div className="text-xs text-neutral-500 sm:mt-1">
              <span className="text-emerald-700 font-medium">
                {todayAppointments.filter((a) => a.status === 'confirmada').length} confirmadas
              </span>
              <span className="mx-1 text-neutral-300" aria-hidden="true">·</span>
              <span>{todayAppointments.filter((a) => a.status === 'pendiente').length} pendientes</span>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-mono tabular-nums sm:mt-2 shrink-0">
            {todayAppointments.length}
          </div>
        </div>

        {/* Card 2: Pedidos */}
        <div className="p-4 sm:p-4.5 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors shadow-xs flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{businessConfig.orderTerm}s a Entregar</span>
            </div>
            <div className="text-xs text-neutral-500 sm:mt-1">
              <span className="text-emerald-700 font-medium">
                {todayOrders.filter((o) => o.status === 'listo').length} listos
              </span>
              <span className="mx-1 text-neutral-300" aria-hidden="true">·</span>
              <span>{todayOrders.filter((o) => o.status === 'en_preparacion').length} en preparación</span>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-mono tabular-nums sm:mt-2 shrink-0">
            {todayOrders.length}
          </div>
        </div>

        {/* Card 3: Saldos por Cobrar */}
        <div className="p-4 sm:p-4.5 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors shadow-xs flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Saldos por Cobrar Hoy</span>
            </div>
            <div className="text-xs text-neutral-500 sm:mt-1">
              Contra entrega de pedidos
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 font-mono tabular-nums sm:mt-2 text-right sm:text-left shrink-0">
            ${pendingCollections.toLocaleString()} <span className="text-xs font-sans font-normal text-neutral-500">MXN</span>
          </div>
        </div>

        {/* Card 4: Tareas Pendientes */}
        <div className="p-4 sm:p-4.5 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors shadow-xs flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <CheckSquare className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Tareas Pendientes Turno</span>
            </div>
            <div className="text-xs text-neutral-500 sm:mt-1">
              {completedTasksCount} completadas hoy
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-mono tabular-nums sm:mt-2 shrink-0">
            {urgentTasks.length}
          </div>
        </div>
      </div>

      {/* Gráfico de Barras: Total de Ingresos Mensuales por Órdenes Completadas */}
      <MonthlyRevenueChart orders={orders} businessConfig={businessConfig} />

      {/* Quick Chaos-to-Order Feature Callout */}
      <div className="p-4 sm:p-5 bg-neutral-900 text-white rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span>Herramienta Destacada</span>
            <span aria-hidden="true">·</span>
            <span>Convertidor de WhatsApp y Libreta</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold">
            ¿Te mandaron un mensaje en WhatsApp o tienes un apunte en libreta?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl">
            Pega el texto tal como te llegó. El sistema extraerá el nombre, teléfono, servicio o pedido, fecha y montos automáticamente para que no se pierda nada en el chat.
          </p>
        </div>
        <button
          onClick={onOpenImporter}
          className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-white rounded-lg hover:bg-neutral-100 transition-colors whitespace-nowrap shrink-0 self-start md:self-auto"
        >
          Probar Captura Rápida
        </button>
      </div>

      {/* Main Grid: Citas Hoy & Pedidos Hoy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section: Citas Programadas Hoy */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                {businessConfig.appointmentTerm}s de Hoy
              </h2>
              <div className="text-xs text-neutral-500">
                Agenda organizada cronológicamente
              </div>
            </div>
            <button
              onClick={() => onSelectTab('appointments')}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 flex items-center gap-1"
            >
              <span>Ver agenda completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg border border-neutral-200">
              <p className="text-xs text-neutral-500">No hay {businessConfig.appointmentTerm.toLowerCase()}s agendadas para hoy.</p>
              <button
                onClick={() => onOpenNewModal('appointment')}
                className="mt-3 px-3 py-1.5 text-xs font-medium bg-neutral-900 text-white rounded-md"
              >
                Agendar primera cita
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 bg-white rounded-lg border border-neutral-200 transition-colors hover:border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                        {apt.time} hrs
                      </span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {apt.clientName}
                      </span>
                      <span aria-hidden="true" className="text-neutral-300">·</span>
                      <span className="text-xs text-neutral-500 capitalize">
                        {apt.status === 'confirmada' ? 'Confirmada' : apt.status === 'en_proceso' ? 'En proceso' : 'Por confirmar'}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-600">
                      <span>{apt.service}</span>
                      <span className="mx-1.5 text-neutral-300">·</span>
                      <span className="text-neutral-500">{apt.staff}</span>
                      {apt.price > 0 && (
                        <>
                          <span className="mx-1.5 text-neutral-300">·</span>
                          <span className="font-mono tabular-nums text-neutral-700 font-medium">${apt.price} MXN</span>
                        </>
                      )}
                    </div>

                    {apt.notes && (
                      <div className="text-xs text-neutral-400 italic">
                        "{apt.notes}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <button
                      onClick={() => handleSendWhatsAppReminder(apt)}
                      title="Enviar recordatorio por WhatsApp"
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <select
                      value={apt.status}
                      onChange={(e) => onUpdateAppointmentStatus(apt.id, e.target.value)}
                      className="text-xs py-1 px-2 bg-neutral-50 border border-neutral-200 rounded-md text-neutral-800"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="en_proceso">En Atención</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Pedidos y Entregas Hoy */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                {businessConfig.orderTerm}s para Hoy
              </h2>
              <div className="text-xs text-neutral-500">
                Entregas, anticipos y saldos por cobrar
              </div>
            </div>
            <button
              onClick={() => onSelectTab('orders')}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 flex items-center gap-1"
            >
              <span>Ver todos los pedidos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayOrders.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg border border-neutral-200">
              <p className="text-xs text-neutral-500">No hay entregas programadas para hoy.</p>
              <button
                onClick={() => onOpenNewModal('order')}
                className="mt-3 px-3 py-1.5 text-xs font-medium bg-neutral-900 text-white rounded-md"
              >
                Registrar nuevo pedido
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayOrders.map((ord) => {
                const balance = ord.totalAmount - ord.depositPaid;
                return (
                  <div
                    key={ord.id}
                    className="p-3.5 bg-white rounded-lg border border-neutral-200 transition-colors hover:border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-700">
                          {ord.orderNumber}
                        </span>
                        <span aria-hidden="true" className="text-neutral-300">·</span>
                        <span className="text-sm font-semibold text-neutral-900">
                          {ord.clientName}
                        </span>
                        <span aria-hidden="true" className="text-neutral-300">·</span>
                        <span className="text-xs font-mono text-neutral-600">
                          {ord.deliveryTime} hrs
                        </span>
                      </div>

                      <div className="text-xs text-neutral-600">
                        {ord.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span>Total: <strong className="font-mono text-neutral-800 tabular-nums">${ord.totalAmount}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Anticipo: <strong className="font-mono text-neutral-800 tabular-nums">${ord.depositPaid}</strong></span>
                        {balance > 0 ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-700 font-semibold font-mono tabular-nums">
                              Por cobrar: ${balance} MXN
                            </span>
                          </>
                        ) : (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-700 font-medium">Liquidado</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                      <button
                        onClick={() => handleSendWhatsAppOrderUpdate(ord)}
                        title="Notificar cliente por WhatsApp"
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Avisar</span>
                      </button>

                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value)}
                        className="text-xs py-1 px-2 bg-neutral-50 border border-neutral-200 rounded-md text-neutral-800"
                      >
                        <option value="nuevo">Nuevo</option>
                        <option value="en_preparacion">En Preparación</option>
                        <option value="listo">Listo</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Operational Checklist & Urgent Tasks */}
      <div className="p-5 bg-white rounded-lg border border-neutral-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Responsabilidades y Checklist del Turno
            </h2>
            <p className="text-xs text-neutral-500">
              Tareas operativas asignadas para evitar olvidos de apertura, cierre, caja y compras
            </p>
          </div>
          <button
            onClick={() => onSelectTab('tasks')}
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 flex items-center gap-1"
          >
            <span>Administrar todas las tareas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tasks.slice(0, 4).map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                task.completed
                  ? 'bg-neutral-50/60 border-neutral-200 opacity-60'
                  : 'bg-white border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                className="mt-0.5 rounded text-neutral-900 focus:ring-neutral-900"
              />
              <div className="space-y-0.5 flex-1 min-w-0">
                <div
                  className={`text-xs font-medium ${
                    task.completed ? 'line-through text-neutral-400' : 'text-neutral-900'
                  }`}
                >
                  {task.title}
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span>{task.assignee}</span>
                  <span aria-hidden="true">·</span>
                  <span className={task.priority === 'urgente' ? 'text-amber-700 font-semibold' : 'text-neutral-500'}>
                    {task.priority === 'urgente' ? 'Prioridad Urgente' : 'Prioridad Normal'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
