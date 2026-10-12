import React, { useState } from 'react';
import { MessageSquare, ArrowRight, Check, Sparkles, AlertCircle, Calendar, ShoppingBag, Edit3 } from 'lucide-react';
import { BusinessConfig } from '../types';
import { parseUnstructuredText, ParsedRecord, SAMPLE_UNSTRUCTURED_MESSAGES } from '../utils/textParser';

interface TextImporterModalProps {
  businessConfig: BusinessConfig;
  onSaveAsAppointment: (record: ParsedRecord) => void;
  onSaveAsOrder: (record: ParsedRecord) => void;
  onClose?: () => void;
}

export const TextImporterModal: React.FC<TextImporterModalProps> = ({
  businessConfig,
  onSaveAsAppointment,
  onSaveAsOrder,
  onClose,
}) => {
  const [inputText, setInputText] = useState(SAMPLE_UNSTRUCTURED_MESSAGES[0].text);
  const [parsed, setParsed] = useState<ParsedRecord>(() => parseUnstructuredText(SAMPLE_UNSTRUCTURED_MESSAGES[0].text));
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleTextChange = (text: string) => {
    setInputText(text);
    if (text.trim().length > 5) {
      setParsed(parseUnstructuredText(text));
    }
  };

  const handleSelectSample = (sampleText: string) => {
    setInputText(sampleText);
    setParsed(parseUnstructuredText(sampleText));
    setSaveSuccess(null);
  };

  const handleSaveAppointment = () => {
    onSaveAsAppointment(parsed);
    setSaveSuccess(`¡Guardado con éxito en la Agenda de ${businessConfig.appointmentTerm}s!`);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const handleSaveOrder = () => {
    onSaveAsOrder(parsed);
    setSaveSuccess(`¡Guardado con éxito en el Control de ${businessConfig.orderTerm}s!`);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
          <span>Herramienta Central</span>
          <span aria-hidden="true">·</span>
          <span>De la Libreta y Chats al Sistema Digital</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Convertidor de Desorden a Sistema
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-3xl">
          Muchos pequeños negocios reciben encargos por WhatsApp o apuntan en papelitos que luego se traspapelan. Pega aquí el mensaje tal como llegó: el sistema lo estructura automáticamente en segundos.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Preset sample message buttons */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-neutral-700">
          Prueba con un mensaje de ejemplo real:
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_UNSTRUCTURED_MESSAGES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(sample.text)}
              className="px-2.5 py-1.5 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-md text-xs font-medium transition-colors"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Split layout: Input Raw Text vs Clean Extracted Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Input */}
        <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
              <span>Mensaje recibido en WhatsApp o nota de cuaderno:</span>
            </label>
            <span className="text-xs text-neutral-400">Texto libre</span>
          </div>

          <textarea
            rows={7}
            value={inputText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Ejemplo: Hola me apartas una cita de corte para mañana a las 4pm soy Mateo cel 5512345678..."
            className="w-full p-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 font-sans"
          />

          <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
            <span>Se actualiza en tiempo real conforme escribes.</span>
            <button
              onClick={() => handleTextChange('')}
              className="text-neutral-400 hover:text-neutral-700 text-xs"
            >
              Limpiar texto
            </button>
          </div>
        </div>

        {/* Right: Clean Extracted Data */}
        <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div>
              <span className="text-xs font-semibold text-neutral-900 block">
                Ficha Estructurada Lista para el Sistema
              </span>
              <span className="text-xs text-neutral-500">
                Información clasificada y lista para guardar
              </span>
            </div>
            <span className="text-xs font-mono font-semibold bg-neutral-100 px-2 py-0.5 rounded text-neutral-800 uppercase">
              {parsed.type === 'cita' ? 'Cita Detectada' : 'Pedido Detectado'}
            </span>
          </div>

          {/* Extracted Fields Grid */}
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500 font-medium">Cliente:</span>
              <div className="col-span-2 font-semibold text-neutral-900">
                {parsed.clientName || 'Por definir'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500 font-medium">Teléfono / WhatsApp:</span>
              <div className="col-span-2 font-mono text-neutral-800">
                {parsed.clientPhone || 'No especificado en el texto'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500 font-medium">Servicio o Pedido:</span>
              <div className="col-span-2 font-medium text-neutral-900">
                {parsed.itemOrService}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500 font-medium">Fecha & Hora:</span>
              <div className="col-span-2 font-mono tabular-nums text-neutral-800">
                {parsed.date} a las {parsed.time} hrs
              </div>
            </div>

            {(parsed.amount > 0 || parsed.deposit > 0) && (
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Monto / Anticipo:</span>
                <div className="col-span-2 font-mono tabular-nums text-neutral-900">
                  {parsed.amount > 0 && <span>Total: ${parsed.amount} MXN </span>}
                  {parsed.deposit > 0 && (
                    <span className="text-emerald-700 font-medium">
                      (Anticipo: ${parsed.deposit} MXN)
                    </span>
                  )}
                </div>
              </div>
            )}

            {parsed.address && (
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Dirección / Entrega:</span>
                <div className="col-span-2 text-neutral-800">
                  {parsed.address}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons to save into the system */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSaveAppointment}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                parsed.type === 'cita'
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                  : 'bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Guardar en Agenda ({businessConfig.appointmentTerm})</span>
            </button>

            <button
              onClick={handleSaveOrder}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                parsed.type === 'pedido'
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                  : 'bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Guardar en Pedidos ({businessConfig.orderTerm})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
