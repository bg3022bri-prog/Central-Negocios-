import React, { useState } from 'react';
import { X, Calendar, ShoppingBag, CheckSquare } from 'lucide-react';
import { Appointment, BusinessConfig, DeliveryType, Order, OrderChannel, Task, TaskCategory, TaskPriority } from '../types';
import { getRelativeDate } from '../data/mockData';

interface NewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'appointment' | 'order' | 'task';
  businessConfig: BusinessConfig;
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onAddOrder: (order: Omit<Order, 'id'>) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

export const NewRecordModal: React.FC<NewRecordModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'appointment',
  businessConfig,
  onAddAppointment,
  onAddOrder,
  onAddTask,
}) => {
  const [activeTab, setActiveTab] = useState<'appointment' | 'order' | 'task'>(initialTab);

  // Appointment State
  const [aptName, setAptName] = useState('');
  const [aptPhone, setAptPhone] = useState('');
  const [aptService, setAptService] = useState(businessConfig.serviceCatalog[0]?.name || '');
  const [aptPrice, setAptPrice] = useState(businessConfig.serviceCatalog[0]?.price || 0);
  const [aptDate, setAptDate] = useState(getRelativeDate(0));
  const [aptTime, setAptTime] = useState('11:00');
  const [aptStaff, setAptStaff] = useState(businessConfig.staffList[0] || 'Personal');
  const [aptNotes, setAptNotes] = useState('');

  // Order State
  const [ordName, setOrdName] = useState('');
  const [ordPhone, setOrdPhone] = useState('');
  const [ordItemName, setOrdItemName] = useState(businessConfig.serviceCatalog[0]?.name || '');
  const [ordQuantity, setOrdQuantity] = useState(1);
  const [ordUnitPrice, setOrdUnitPrice] = useState(businessConfig.serviceCatalog[0]?.price || 100);
  const [ordDeposit, setOrdDeposit] = useState(0);
  const [ordDate, setOrdDate] = useState(getRelativeDate(0));
  const [ordTime, setOrdTime] = useState('15:00');
  const [ordDeliveryType, setOrdDeliveryType] = useState<DeliveryType>('recogida_en_tienda');
  const [ordAddress, setOrdAddress] = useState('');
  const [ordChannel, setOrdChannel] = useState<OrderChannel>('whatsapp');
  const [ordNotes, setOrdNotes] = useState('');

  // Task State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState(businessConfig.staffList[0] || 'Equipo');
  const [taskDueDate, setTaskDueDate] = useState(getRelativeDate(0));
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('normal');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('apertura_cierre');

  if (!isOpen) return null;

  const handleSubmitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptName.trim()) return;

    onAddAppointment({
      clientName: aptName.trim(),
      clientPhone: aptPhone.trim(),
      service: aptService,
      price: Number(aptPrice),
      date: aptDate,
      time: aptTime,
      durationMinutes: 45,
      staff: aptStaff,
      status: 'confirmada',
      notes: aptNotes.trim() || undefined,
    });
    onClose();
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ordName.trim()) return;

    const total = Number(ordQuantity) * Number(ordUnitPrice);
    const deposit = Number(ordDeposit);

    onAddOrder({
      orderNumber: `PED-${Math.floor(100 + Math.random() * 900)}`,
      clientName: ordName.trim(),
      clientPhone: ordPhone.trim(),
      items: [
        {
          name: ordItemName || 'Artículo por encargo',
          quantity: Number(ordQuantity),
          unitPrice: Number(ordUnitPrice),
        },
      ],
      totalAmount: total,
      depositPaid: deposit,
      deliveryDate: ordDate,
      deliveryTime: ordTime,
      deliveryType: ordDeliveryType,
      address: ordAddress.trim() || undefined,
      status: 'nuevo',
      paymentStatus: deposit >= total ? 'liquidado' : deposit > 0 ? 'anticipo_pagado' : 'pendiente',
      channel: ordChannel,
      notes: ordNotes.trim() || undefined,
    });
    onClose();
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddTask({
      title: taskTitle.trim(),
      assignee: taskAssignee,
      dueDate: taskDueDate,
      priority: taskPriority,
      category: taskCategory,
      completed: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-neutral-900">Nuevo Registro</h3>
            <span className="text-xs text-neutral-400">· {businessConfig.name}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('appointment')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'appointment' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{businessConfig.appointmentTerm}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('order')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'order' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{businessConfig.orderTerm}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('task')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'task' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tarea</span>
          </button>
        </div>

        {/* 1. Appointment Form */}
        {activeTab === 'appointment' && (
          <form onSubmit={handleSubmitAppointment} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Nombre del Cliente *</label>
                <input
                  type="text"
                  required
                  value={aptName}
                  onChange={(e) => setAptName(e.target.value)}
                  placeholder="Ej. Mateo Ramos"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">WhatsApp / Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={aptPhone}
                  onChange={(e) => setAptPhone(e.target.value)}
                  placeholder="+52 55 1234 5678"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Servicio *</label>
                <input
                  type="text"
                  required
                  value={aptService}
                  onChange={(e) => setAptService(e.target.value)}
                  placeholder="Ej. Corte y Barba"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Precio Estimado (MXN)</label>
                <input
                  type="number"
                  value={aptPrice}
                  onChange={(e) => setAptPrice(Number(e.target.value))}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Fecha *</label>
                <input
                  type="date"
                  required
                  value={aptDate}
                  onChange={(e) => setAptDate(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Hora *</label>
                <input
                  type="time"
                  required
                  value={aptTime}
                  onChange={(e) => setAptTime(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Personal Asignado</label>
                <select
                  value={aptStaff}
                  onChange={(e) => setAptStaff(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                >
                  {businessConfig.staffList.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">Notas de la cita</label>
              <textarea
                rows={2}
                value={aptNotes}
                onChange={(e) => setAptNotes(e.target.value)}
                placeholder="Preferencias del cliente, indicaciones especiales..."
                className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 text-white font-semibold rounded-md hover:bg-neutral-800"
              >
                Guardar {businessConfig.appointmentTerm}
              </button>
            </div>
          </form>
        )}

        {/* 2. Order Form */}
        {activeTab === 'order' && (
          <form onSubmit={handleSubmitOrder} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Nombre del Cliente *</label>
                <input
                  type="text"
                  required
                  value={ordName}
                  onChange={(e) => setOrdName(e.target.value)}
                  placeholder="Ej. Fernanda Ortiz"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">WhatsApp / Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={ordPhone}
                  onChange={(e) => setOrdPhone(e.target.value)}
                  placeholder="+52 55 9988 7766"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block font-medium text-neutral-700 mb-1">Producto o Encargo *</label>
                <input
                  type="text"
                  required
                  value={ordItemName}
                  onChange={(e) => setOrdItemName(e.target.value)}
                  placeholder="Ej. Pastel Tres Leches / Vestido Lino"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={ordQuantity}
                  onChange={(e) => setOrdQuantity(Number(e.target.value))}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Precio Unitario ($ MXN)</label>
                <input
                  type="number"
                  value={ordUnitPrice}
                  onChange={(e) => setOrdUnitPrice(Number(e.target.value))}
                  className="w-full p-2 border border-neutral-300 rounded-md bg-white font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Anticipo Pagado ($ MXN)</label>
                <input
                  type="number"
                  value={ordDeposit}
                  onChange={(e) => setOrdDeposit(Number(e.target.value))}
                  className="w-full p-2 border border-neutral-300 rounded-md bg-white font-mono tabular-nums"
                />
              </div>
              <div className="col-span-2 flex justify-between text-xs pt-1 border-t border-neutral-200 font-medium">
                <span>Total: ${(ordQuantity * ordUnitPrice).toLocaleString()} MXN</span>
                <span className="text-amber-800">
                  Saldo pendiente: ${Math.max(0, ordQuantity * ordUnitPrice - ordDeposit).toLocaleString()} MXN
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Fecha Entrega *</label>
                <input
                  type="date"
                  required
                  value={ordDate}
                  onChange={(e) => setOrdDate(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Hora Entrega *</label>
                <input
                  type="time"
                  required
                  value={ordTime}
                  onChange={(e) => setOrdTime(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Tipo Entrega</label>
                <select
                  value={ordDeliveryType}
                  onChange={(e) => setOrdDeliveryType(e.target.value as DeliveryType)}
                  className="w-full p-2 border border-neutral-300 rounded-md bg-white"
                >
                  <option value="recogida_en_tienda">Recoge en local</option>
                  <option value="domicilio">A Domicilio</option>
                  <option value="envio">Paquetería</option>
                </select>
              </div>
            </div>

            {ordDeliveryType !== 'recogida_en_tienda' && (
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Dirección de Entrega</label>
                <input
                  type="text"
                  value={ordAddress}
                  onChange={(e) => setOrdAddress(e.target.value)}
                  placeholder="Calle, número, colonia, referencias"
                  className="w-full p-2 border border-neutral-300 rounded-md"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Canal de Pedido</label>
                <select
                  value={ordChannel}
                  onChange={(e) => setOrdChannel(e.target.value as OrderChannel)}
                  className="w-full p-2 border border-neutral-300 rounded-md bg-white"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="mostrador">Mostrador / Local</option>
                  <option value="telefono">Llamada Telefónica</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Notas especiales</label>
                <input
                  type="text"
                  value={ordNotes}
                  onChange={(e) => setOrdNotes(e.target.value)}
                  placeholder="Dedicatoria, detalles, etc."
                  className="w-full p-2 border border-neutral-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 text-white font-semibold rounded-md hover:bg-neutral-800"
              >
                Guardar {businessConfig.orderTerm}
              </button>
            </div>
          </form>
        )}

        {/* 3. Task Form */}
        {activeTab === 'task' && (
          <form onSubmit={handleSubmitTask} className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Descripción de la Tarea *</label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Ej. Revisar inventario de tintes o comprar fresas"
                className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Responsable Asignado</label>
                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md bg-white"
                >
                  {businessConfig.staffList.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Fecha Límite</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Categoría</label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as TaskCategory)}
                  className="w-full p-2 border border-neutral-300 rounded-md bg-white"
                >
                  <option value="apertura_cierre">Apertura & Cierre</option>
                  <option value="proveedores">Proveedores & Compras</option>
                  <option value="clientes">Clientes</option>
                  <option value="administracion">Administración & Finanzas</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Prioridad</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                  className="w-full p-2 border border-neutral-300 rounded-md bg-white"
                >
                  <option value="urgente">Urgente</option>
                  <option value="normal">Normal</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 text-white font-semibold rounded-md hover:bg-neutral-800"
              >
                Guardar Tarea
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
