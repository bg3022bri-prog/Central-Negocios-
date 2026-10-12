/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { AppointmentsTab } from './components/AppointmentsTab';
import { OrdersTab } from './components/OrdersTab';
import { TasksTab } from './components/TasksTab';
import { TextImporterModal } from './components/TextImporterModal';
import { ClientsTab } from './components/ClientsTab';
import { DiagnosticCalculator } from './components/DiagnosticCalculator';
import { AboutServiceSection } from './components/AboutServiceSection';
import { NewRecordModal } from './components/NewRecordModal';
import { Appointment, AppointmentStatus, BusinessType, Client, Order, OrderStatus, Task } from './types';
import { BUSINESS_CONFIGS, INITIAL_DATA } from './data/mockData';
import { ParsedRecord } from './utils/textParser';
import { Download, RefreshCw, Sparkles, FolderArchive } from 'lucide-react';

const STORAGE_KEY_PREFIX = 'centralnegocio_data_v1';

export default function App() {
  const [businessType, setBusinessType] = useState<BusinessType>('barberia');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newModalTab, setNewModalTab] = useState<'appointment' | 'order' | 'task'>('appointment');

  // Load state from localStorage or fallback to initial data
  const [appointments, setAppointments] = useState<Record<BusinessType, Appointment[]>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_appointments`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DATA.appointments;
  });

  const [orders, setOrders] = useState<Record<BusinessType, Order[]>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_orders`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...INITIAL_DATA.orders };
        (Object.keys(INITIAL_DATA.orders) as BusinessType[]).forEach((bt) => {
          const savedList: Order[] = parsed[bt] || [];
          const initialList = INITIAL_DATA.orders[bt] || [];
          const missing = initialList.filter((initOrd) => !savedList.some((s) => s.id === initOrd.id));
          merged[bt] = [...savedList, ...missing];
        });
        return merged;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DATA.orders;
  });

  const [tasks, setTasks] = useState<Record<BusinessType, Task[]>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_tasks`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DATA.tasks;
  });

  const [clients, setClients] = useState<Record<BusinessType, Client[]>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_clients`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DATA.clients;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_appointments`, JSON.stringify(appointments));
    } catch (e) {
      console.error(e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_orders`, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_tasks`, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_clients`, JSON.stringify(clients));
    } catch (e) {
      console.error(e);
    }
  }, [clients]);

  const currentConfig = BUSINESS_CONFIGS[businessType];
  const currentAppointments = appointments[businessType] || [];
  const currentOrders = orders[businessType] || [];
  const currentTasks = tasks[businessType] || [];
  const currentClients = clients[businessType] || [];

  // Handlers for Appointments
  const handleAddAppointment = (newApt: Omit<Appointment, 'id'>) => {
    const item: Appointment = {
      ...newApt,
      id: `apt-${Date.now()}`,
    };
    setAppointments((prev) => ({
      ...prev,
      [businessType]: [item, ...(prev[businessType] || [])],
    }));

    // Auto add or update client in directory if not present
    if (newApt.clientName && newApt.clientPhone) {
      setClients((prev) => {
        const list = prev[businessType] || [];
        const exists = list.find((c) => c.phone === newApt.clientPhone);
        if (!exists) {
          const newC: Client = {
            id: `cli-${Date.now()}`,
            name: newApt.clientName,
            phone: newApt.clientPhone,
            businessType: businessType,
            notes: `Servicio preferido: ${newApt.service}`,
            totalSpent: newApt.price,
            lastInteraction: newApt.date,
          };
          return { ...prev, [businessType]: [newC, ...list] };
        }
        return prev;
      });
    }
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) => ({
      ...prev,
      [businessType]: (prev[businessType] || []).map((a) => (a.id === id ? { ...a, status } : a)),
    }));
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments((prev) => ({
      ...prev,
      [businessType]: (prev[businessType] || []).filter((a) => a.id !== id),
    }));
  };

  // Handlers for Orders
  const handleAddOrder = (newOrder: Omit<Order, 'id'>) => {
    const item: Order = {
      ...newOrder,
      id: `ord-${Date.now()}`,
    };
    setOrders((prev) => ({
      ...prev,
      [businessType]: [item, ...(prev[businessType] || [])],
    }));

    // Auto add client if not present
    if (newOrder.clientName && newOrder.clientPhone) {
      setClients((prev) => {
        const list = prev[businessType] || [];
        const exists = list.find((c) => c.phone === newOrder.clientPhone);
        if (!exists) {
          const newC: Client = {
            id: `cli-${Date.now()}`,
            name: newOrder.clientName,
            phone: newOrder.clientPhone,
            address: newOrder.address,
            businessType: businessType,
            notes: `Pedido #${item.orderNumber}`,
            totalSpent: newOrder.totalAmount,
            lastInteraction: newOrder.deliveryDate,
          };
          return { ...prev, [businessType]: [newC, ...list] };
        }
        return prev;
      });
    }
  };

  const handleUpdateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => ({
      ...prev,
      [businessType]: (prev[businessType] || []).map((o) => (o.id === id ? { ...o, status } : o)),
    }));
  };

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => ({
      ...prev,
      [businessType]: (prev[businessType] || []).filter((o) => o.id !== id),
    }));
  };

  // Handlers for Tasks
  const handleToggleTask = (id: string) => {
    setTasks((prev) => ({
      ...prev,
      [businessType]: (prev[businessType] || []).map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }));
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const item: Task = {
      ...newTask,
      id: `tsk-${Date.now()}`,
    };
    setTasks((prev) => ({
      ...prev,
      [businessType]: [item, ...(prev[businessType] || [])],
    }));
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => ({
      ...prev,
      [businessType]: (prev[businessType] || []).filter((t) => t.id !== id),
    }));
  };

  // Handlers for Clients
  const handleAddClient = (newClient: Omit<Client, 'id'>) => {
    const item: Client = {
      ...newClient,
      id: `cli-${Date.now()}`,
    };
    setClients((prev) => ({
      ...prev,
      [businessType]: [item, ...(prev[businessType] || [])],
    }));
  };

  // Save parsed record from WhatsApp / text importer
  const handleSaveParsedAsAppointment = (rec: ParsedRecord) => {
    handleAddAppointment({
      clientName: rec.clientName,
      clientPhone: rec.clientPhone,
      service: rec.itemOrService,
      price: rec.amount || (currentConfig.serviceCatalog[0]?.price ?? 150),
      date: rec.date,
      time: rec.time,
      durationMinutes: 45,
      staff: currentConfig.staffList[0] || 'Personal',
      status: 'confirmada',
      notes: `Capturado desde chat: "${rec.notes.slice(0, 80)}..."`,
    });
  };

  const handleSaveParsedAsOrder = (rec: ParsedRecord) => {
    const total = rec.amount > 0 ? rec.amount : 350;
    const deposit = rec.deposit > 0 ? rec.deposit : 0;
    handleAddOrder({
      orderNumber: `PED-${Math.floor(100 + Math.random() * 900)}`,
      clientName: rec.clientName,
      clientPhone: rec.clientPhone,
      items: [
        {
          name: rec.itemOrService || 'Pedido Especial',
          quantity: 1,
          unitPrice: total,
        },
      ],
      totalAmount: total,
      depositPaid: deposit,
      deliveryDate: rec.date,
      deliveryTime: rec.time,
      deliveryType: rec.address ? 'domicilio' : 'recogida_en_tienda',
      address: rec.address || undefined,
      status: 'nuevo',
      paymentStatus: deposit >= total ? 'liquidado' : deposit > 0 ? 'anticipo_pagado' : 'pendiente',
      channel: 'whatsapp',
      notes: `Capturado desde WhatsApp. Mensaje original: "${rec.notes.slice(0, 100)}"`,
    });
  };

  // Export current business data to CSV
  const handleExportCSV = () => {
    const headers = ['Tipo', 'ID/Folio', 'Cliente', 'Telefono', 'Concepto', 'Fecha', 'Hora', 'Monto_Total', 'Estado'];
    const rows: string[][] = [];

    // Add appointments
    currentAppointments.forEach((a) => {
      rows.push(['Cita', a.id, a.clientName, a.clientPhone, a.service, a.date, a.time, a.price.toString(), a.status]);
    });

    // Add orders
    currentOrders.forEach((o) => {
      const items = o.items.map((i) => `${i.quantity}x ${i.name}`).join('; ');
      rows.push(['Pedido', o.orderNumber, o.clientName, o.clientPhone, items, o.deliveryDate, o.deliveryTime, o.totalAmount.toString(), o.status]);
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_${businessType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer los datos de ejemplo predeterminados para este negocio?')) {
      setAppointments(INITIAL_DATA.appointments);
      setOrders(INITIAL_DATA.orders);
      setTasks(INITIAL_DATA.tasks);
      setClients(INITIAL_DATA.clients);
      try {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}_appointments`);
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}_orders`);
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}_tasks`);
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}_clients`);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openNewModalWithTab = (tab: 'appointment' | 'order' | 'task' = 'appointment') => {
    setNewModalTab(tab);
    setIsNewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentBusinessType={businessType}
        onChangeBusinessType={setBusinessType}
        onOpenNewModal={() => openNewModalWithTab('appointment')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'dashboard' && (
          <DashboardTab
            businessConfig={currentConfig}
            appointments={currentAppointments}
            orders={currentOrders}
            tasks={currentTasks}
            onOpenNewModal={openNewModalWithTab}
            onOpenImporter={() => setCurrentTab('importer')}
            onSelectTab={setCurrentTab}
            onToggleTask={handleToggleTask}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {currentTab === 'appointments' && (
          <AppointmentsTab
            businessConfig={currentConfig}
            appointments={currentAppointments}
            onAddAppointment={handleAddAppointment}
            onUpdateStatus={handleUpdateAppointmentStatus}
            onDeleteAppointment={handleDeleteAppointment}
            onOpenNewModal={() => openNewModalWithTab('appointment')}
          />
        )}

        {currentTab === 'orders' && (
          <OrdersTab
            businessConfig={currentConfig}
            orders={currentOrders}
            onAddOrder={handleAddOrder}
            onUpdateStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onOpenNewModal={() => openNewModalWithTab('order')}
          />
        )}

        {currentTab === 'tasks' && (
          <TasksTab
            businessConfig={currentConfig}
            tasks={currentTasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onOpenNewModal={() => openNewModalWithTab('task')}
          />
        )}

        {currentTab === 'importer' && (
          <TextImporterModal
            businessConfig={currentConfig}
            onSaveAsAppointment={handleSaveParsedAsAppointment}
            onSaveAsOrder={handleSaveParsedAsOrder}
          />
        )}

        {currentTab === 'clients' && (
          <ClientsTab
            businessConfig={currentConfig}
            clients={currentClients}
            onAddClient={handleAddClient}
          />
        )}

        {currentTab === 'calculator' && (
          <DiagnosticCalculator
            businessConfig={currentConfig}
            onGoToAbout={() => setCurrentTab('about')}
          />
        )}

        {currentTab === 'about' && <AboutServiceSection />}
      </main>

      {/* Bottom Utility Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-12 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">CentralNegocio</span>
            <span aria-hidden="true">·</span>
            <span>Misión: Digitalizar y ordenar pequeños comercios con herramientas accesibles</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/centralnegocio-codigo-completo.zip"
              download="centralnegocio-codigo-completo.zip"
              className="flex items-center gap-1.5 text-neutral-800 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-md transition-colors font-medium border border-neutral-200"
              title="Descargar todos los archivos fuente del proyecto en formato ZIP"
            >
              <FolderArchive className="w-3.5 h-3.5 text-neutral-700" />
              <span>Descargar Proyecto (.ZIP)</span>
            </a>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Reporte CSV</span>
            </button>

            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restablecer Demo</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Unified New Record Modal */}
      <NewRecordModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        initialTab={newModalTab}
        businessConfig={currentConfig}
        onAddAppointment={handleAddAppointment}
        onAddOrder={handleAddOrder}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
