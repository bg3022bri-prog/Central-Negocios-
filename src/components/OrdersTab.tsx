import React, { useState } from 'react';
import { ShoppingBag, Plus, Search, MessageSquare, Trash2, MapPin, CheckCircle, Clock } from 'lucide-react';
import { BusinessConfig, DeliveryType, Order, OrderStatus } from '../types';
import { getRelativeDate } from '../data/mockData';

interface OrdersTabProps {
  businessConfig: BusinessConfig;
  orders: Order[];
  onAddOrder: (order: Omit<Order, 'id'>) => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onDeleteOrder: (id: string) => void;
  onOpenNewModal: () => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  businessConfig,
  orders,
  onAddOrder,
  onUpdateStatus,
  onDeleteOrder,
  onOpenNewModal,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('all');

  const todayStr = getRelativeDate(0);

  const filteredOrders = orders.filter((ord) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = ord.clientName.toLowerCase().includes(q);
      const matchNum = ord.orderNumber.toLowerCase().includes(q);
      const matchItems = ord.items.some((i) => i.name.toLowerCase().includes(q));
      if (!matchName && !matchNum && !matchItems) return false;
    }

    if (statusFilter !== 'all' && ord.status !== statusFilter) return false;
    if (channelFilter !== 'all' && ord.channel !== channelFilter) return false;
    if (deliveryFilter !== 'all' && ord.deliveryType !== deliveryFilter) return false;

    return true;
  });

  filteredOrders.sort((a, b) => `${a.deliveryDate} ${a.deliveryTime}`.localeCompare(`${b.deliveryDate} ${b.deliveryTime}`));

  const handleNotifyWhatsApp = (ord: Order) => {
    const balance = ord.totalAmount - ord.depositPaid;
    let statusMsg = '';
    if (ord.status === 'listo') {
      statusMsg = `¡Tu ${businessConfig.orderTerm.toLowerCase()} ya está listo!`;
    } else if (ord.status === 'en_preparacion') {
      statusMsg = `¡Estamos preparando tu ${businessConfig.orderTerm.toLowerCase()}! Programado para entrega el ${ord.deliveryDate} a las ${ord.deliveryTime}.`;
    } else {
      statusMsg = `Hemos confirmado tu ${businessConfig.orderTerm.toLowerCase()} para el ${ord.deliveryDate}.`;
    }

    const balanceTxt = balance > 0 ? ` Recuerda que queda un saldo pendiente de $${balance} MXN al momento de entrega.` : ' Tu cuenta está 100% liquidada.';
    const text = encodeURIComponent(
      `Hola ${ord.clientName}! Te escribimos de ${businessConfig.name}. ${statusMsg}${balanceTxt} Si tienes alguna duda, estamos a tus órdenes.`
    );
    const cleanPhone = ord.clientPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Control de {businessConfig.orderTerm}s y Ventas
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Gestiona pedidos recibidos por WhatsApp, Instagram y mostrador con control riguroso de anticipos y saldos por cobrar.
          </p>
        </div>
        <button
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo {businessConfig.orderTerm}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={`Buscar por pedido #, cliente o producto...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md text-neutral-700 focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="nuevo">Nuevos</option>
            <option value="en_preparacion">En Preparación</option>
            <option value="listo">Listos para Entrega</option>
            <option value="entregado">Entregados</option>
            <option value="cancelado">Cancelados</option>
          </select>

          {/* Channel Dropdown */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md text-neutral-700 focus:outline-none"
          >
            <option value="all">Todos los canales</option>
            <option value="whatsapp">Canal: WhatsApp</option>
            <option value="instagram">Canal: Instagram</option>
            <option value="mostrador">Canal: Mostrador</option>
            <option value="telefono">Canal: Teléfono</option>
          </select>

          {/* Delivery type */}
          <select
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md text-neutral-700 focus:outline-none"
          >
            <option value="all">Cualquier entrega</option>
            <option value="recogida_en_tienda">Recoge en local</option>
            <option value="domicilio">A Domicilio</option>
            <option value="envio">Paquetería / Envío</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-neutral-200">
          <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-neutral-800">
            No se encontraron {businessConfig.orderTerm.toLowerCase()}s con los filtros seleccionados
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Intenta ajustar la búsqueda o registra un nuevo {businessConfig.orderTerm.toLowerCase()}.
          </p>
          <button
            onClick={onOpenNewModal}
            className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            + Registrar {businessConfig.orderTerm}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((ord) => {
            const balance = ord.totalAmount - ord.depositPaid;
            const isToday = ord.deliveryDate === todayStr;

            return (
              <div
                key={ord.id}
                className="p-4 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors space-y-3"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-neutral-100">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                      {ord.orderNumber}
                    </span>
                    <span aria-hidden="true" className="text-neutral-300">·</span>
                    <span className="font-semibold text-sm text-neutral-900">
                      {ord.clientName}
                    </span>
                    <span aria-hidden="true" className="text-neutral-300">·</span>
                    <span className="text-neutral-500 capitalize">
                      Origen: {ord.channel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={ord.status}
                      onChange={(e) => onUpdateStatus(ord.id, e.target.value as OrderStatus)}
                      className={`text-xs py-1 px-2 rounded border focus:outline-none ${
                        ord.status === 'listo'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                          : ord.status === 'en_preparacion'
                          ? 'bg-blue-50 text-blue-800 border-blue-200 font-semibold'
                          : ord.status === 'entregado'
                          ? 'bg-neutral-100 text-neutral-600 border-neutral-200'
                          : ord.status === 'cancelado'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200 font-semibold'
                      }`}
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="en_preparacion">En Preparación</option>
                      <option value="listo">Listo para Entrega</option>
                      <option value="entregado">Entregado y Cerrado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>

                    <button
                      onClick={() => handleNotifyWhatsApp(ord)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
                      title="Enviar actualización al cliente"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => onDeleteOrder(ord.id)}
                      className="p-1 text-neutral-400 hover:text-rose-600 transition-colors"
                      title="Eliminar pedido"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Items */}
                  <div className="space-y-1">
                    <div className="font-semibold text-neutral-700">Artículos del Pedido:</div>
                    <ul className="space-y-0.5 text-neutral-600">
                      {ord.items.map((it, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{it.quantity}x {it.name}</span>
                          <span className="font-mono tabular-nums text-neutral-500 font-medium">
                            ${it.unitPrice * it.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Financials: Anticipo & Saldo */}
                  <div className="space-y-1 bg-neutral-50/70 p-2.5 rounded-md border border-neutral-100">
                    <div className="flex justify-between text-neutral-600">
                      <span>Total Venta:</span>
                      <strong className="font-mono tabular-nums text-neutral-900">${ord.totalAmount} MXN</strong>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Anticipo Pagado:</span>
                      <span className="font-mono tabular-nums text-emerald-700 font-medium">${ord.depositPaid} MXN</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-neutral-200 text-neutral-900 font-semibold">
                      <span>Saldo Pendiente:</span>
                      <span className={`font-mono tabular-nums ${balance > 0 ? 'text-amber-700 font-bold' : 'text-neutral-500'}`}>
                        {balance > 0 ? `$${balance} MXN` : 'Liquidado'}
                      </span>
                    </div>
                  </div>

                  {/* Delivery & Schedule */}
                  <div className="space-y-1">
                    <div className="font-semibold text-neutral-700">Entrega y Logística:</div>
                    <div className="text-neutral-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="font-mono tabular-nums">
                        {isToday ? 'Hoy' : ord.deliveryDate} a las {ord.deliveryTime} hrs
                      </span>
                    </div>
                    <div className="text-neutral-600 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="capitalize">
                          {ord.deliveryType === 'recogida_en_tienda'
                            ? 'Recoge en el local'
                            : ord.deliveryType === 'domicilio'
                            ? 'Entrega a domicilio'
                            : 'Envío por paquetería'}
                        </span>
                        {ord.address && (
                          <div className="text-neutral-500 text-xs mt-0.5">
                            {ord.address}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes if any */}
                {ord.notes && (
                  <div className="text-xs bg-amber-50/50 text-neutral-700 p-2 rounded border border-amber-100/60">
                    <span className="font-semibold text-amber-900">Nota del pedido:</span> {ord.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
