export type BusinessType = 'barberia' | 'comida' | 'tienda' | 'servicios';

export type AppointmentStatus = 'confirmada' | 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  staff: string;
  price: number;
  status: AppointmentStatus;
  notes?: string;
}

export type OrderStatus = 'nuevo' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado';
export type PaymentStatus = 'pendiente' | 'anticipo_pagado' | 'liquidado';
export type DeliveryType = 'recogida_en_tienda' | 'domicilio' | 'envio';
export type OrderChannel = 'whatsapp' | 'instagram' | 'mostrador' | 'telefono';

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  items: OrderItem[];
  totalAmount: number;
  depositPaid: number;
  deliveryDate: string; // YYYY-MM-DD
  deliveryTime: string; // HH:MM
  deliveryType: DeliveryType;
  address?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  channel: OrderChannel;
  notes?: string;
}

export type TaskPriority = 'urgente' | 'normal' | 'baja';
export type TaskCategory = 'apertura_cierre' | 'proveedores' | 'clientes' | 'administracion';

export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  businessType: BusinessType;
  notes: string;
  totalSpent: number;
  lastInteraction: string;
}

export interface BusinessConfig {
  id: BusinessType;
  label: string;
  badge: string;
  name: string;
  slogan: string;
  staffList: string[];
  serviceCatalog: { name: string; price: number; duration: number }[];
  appointmentTerm: string; // "Cita", "Reserva", "Turno", "Sesión"
  orderTerm: string; // "Pedido", "Encargo", "Venta", "Proyecto"
}
