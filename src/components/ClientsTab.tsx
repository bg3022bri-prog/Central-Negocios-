import React, { useState } from 'react';
import { Users, Search, MessageSquare, Plus, Phone, DollarSign, Calendar, MapPin } from 'lucide-react';
import { BusinessConfig, Client } from '../types';

interface ClientsTabProps {
  businessConfig: BusinessConfig;
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id'>) => void;
}

export const ClientsTab: React.FC<ClientsTabProps> = ({
  businessConfig,
  clients,
  onAddClient,
}) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredClients = clients.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.notes.toLowerCase().includes(q)
    );
  });

  const handleOpenWhatsApp = (client: Client) => {
    const text = encodeURIComponent(
      `Hola ${client.name}! Te saludamos de ${businessConfig.name}. ¿Cómo estás? Esperamos que estés teniendo un excelente día.`
    );
    const cleanPhone = client.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddClient({
      name: newName.trim(),
      phone: newPhone.trim(),
      address: newAddress.trim() || undefined,
      notes: newNotes.trim(),
      businessType: businessConfig.id,
      totalSpent: 0,
      lastInteraction: new Date().toISOString().split('T')[0],
    });

    setNewName('');
    setNewPhone('');
    setNewAddress('');
    setNewNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Directorio de Clientes
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Historial de compras, preferencias, alergias y contacto directo por WhatsApp en un solo clic.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3.5 bg-white rounded-lg border border-neutral-200">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o notas de preferencia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-neutral-200">
          <Users className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-neutral-800">No se encontraron clientes</h3>
          <p className="text-xs text-neutral-500 mt-1">Registra tu primer cliente para tener su ficha organizada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-4 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">{client.name}</h3>
                    <div className="text-xs font-mono text-neutral-500">{client.phone}</div>
                  </div>
                  <button
                    onClick={() => handleOpenWhatsApp(client)}
                    className="p-1.5 text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
                    title="Chatear por WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>

                {client.address && (
                  <div className="text-xs text-neutral-500 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-neutral-400" />
                    <span>{client.address}</span>
                  </div>
                )}

                {client.notes && (
                  <div className="text-xs bg-neutral-50 p-2 rounded border border-neutral-100 text-neutral-600">
                    <strong className="text-neutral-700 font-medium">Preferencia:</strong> {client.notes}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>Historial:</span>
                <span className="font-mono tabular-nums font-bold text-neutral-900">
                  ${client.totalSpent.toLocaleString()} MXN
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Client */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900">Registrar Nuevo Cliente</h3>
            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Nombre completo *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Roberto Gómez"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Ej. +52 55 1234 5678"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Dirección (Opcional)</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Colonia, calle, no. interior"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Notas especiales o preferencias</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ej. Alérgica a fresas / Pide corte degrafilado"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-neutral-900 text-white font-semibold rounded-md hover:bg-neutral-800"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
