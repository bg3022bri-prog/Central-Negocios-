import React, { useState } from 'react';
import { Check, ShieldCheck, HeartHandshake, PhoneCall, ArrowRight, MessageSquare, Award, Clock } from 'lucide-react';
import heroWorkspaceImg from '../assets/images/hero_business_workspace_1791770522267.jpg';
import avatarBarberImg from '../assets/images/avatar_barber_owner_1791770534671.jpg';
import avatarBakeryImg from '../assets/images/avatar_bakery_owner_1791770548904.jpg';

export const AboutServiceSection: React.FC = () => {
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadBusinessType, setLeadBusinessType] = useState('Salón / Barbería');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section with Mission & Value Proposition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            <span>Concepto y Misión de Nuestro Servicio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 text-balance">
            Convertir el desorden administrativo en un sistema de trabajo claro, práctico y económico.
          </h1>

          <div className="space-y-3 text-sm text-neutral-600 leading-relaxed">
            <p>
              <strong className="text-neutral-900 font-semibold">Nuestra Misión:</strong> Ayudar a los pequeños negocios a organizar sus tareas, horarios, pedidos y responsabilidades mediante herramientas digitales sencillas y accesibles.
            </p>
            <p>
              <strong className="text-neutral-900 font-semibold">El problema que resolvemos:</strong> Muchos emprendedores llevan sus citas, pedidos por entregar y pendientes repartidos en conversaciones de WhatsApp, libretas de papel o notas sueltas. Ese desorden provoca citas empalmadas, pedidos olvidados, horas perdidas y clientes molestos.
            </p>
            <p>
              <strong className="text-neutral-900 font-semibold">Nuestra solución:</strong> Centralizamos toda tu información operativa en un solo lugar fácil de usar, adaptado al ritmo real de tu comercio y sin complicaciones técnicas.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3 text-xs text-neutral-600">
            <span className="flex items-center gap-1.5 font-medium text-neutral-900">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              Herramienta 100% en español
            </span>
            <span className="flex items-center gap-1.5 font-medium text-neutral-900">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              Sin suscripciones abusivas
            </span>
            <span className="flex items-center gap-1.5 font-medium text-neutral-900">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              Acompañamiento personalizado
            </span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="lg:col-span-5">
          <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100">
            <img
              src={heroWorkspaceImg}
              alt="Mesa de trabajo organizada de un pequeño negocio local"
              referrerPolicy="no-referrer"
              className="w-full h-72 sm:h-80 object-cover"
            />
            <div className="p-3 bg-white text-xs text-neutral-500 border-t border-neutral-100">
              Transformamos libretas desordenadas y chats dispersos en un panel operativo claro.
            </div>
          </div>
        </div>
      </div>

      {/* Target Clients Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Diseñado Específicamente para Comercios Locales
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Sabemos que no tienes tiempo para sistemas complicados. Adaptamos la plataforma al giro exacto de tu negocio:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-2">
            <div className="text-xs font-bold text-neutral-900">💈 Salones & Barberías</div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Control de citas por horas, asignación a estilistas/barberos y recordatorios automáticos por WhatsApp para reducir ausencias a cero.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-2">
            <div className="text-xs font-bold text-neutral-900">🍰 Comida & Repostería</div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Gestión de pedidos por encargo, registro exacto de anticipos pagados y saldos pendientes por cobrar contra entrega.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-2">
            <div className="text-xs font-bold text-neutral-900">🛍️ Tiendas & Venta Online</div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Centralización de pedidos recibidos por WhatsApp o Instagram, guías de envío y entregas locales programadas.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-2">
            <div className="text-xs font-bold text-neutral-900">💼 Servicios & Independientes</div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Diseñadores, fotógrafos y consultores independientes: control de proyectos, fechas de entrega y cobros por fases.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Step Process */}
      <div className="p-6 sm:p-8 bg-neutral-900 text-white rounded-xl space-y-6">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
            Metodología Práctica
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Cómo Te Ayudamos a Implementar el Sistema en 3 Días
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="space-y-2">
            <div className="text-emerald-400 font-mono font-bold text-base">Paso 01.</div>
            <div className="font-semibold text-white">Mapeo del Desorden Actual</div>
            <p className="text-neutral-300 leading-relaxed">
              Revisamos cómo anotas hoy (tus libretas, chats de WhatsApp y notas de voz) para entender tus tiempos, servicios y equipo.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-emerald-400 font-mono font-bold text-base">Paso 02.</div>
            <div className="font-semibold text-white">Configuración a tu Medida</div>
            <p className="text-neutral-300 leading-relaxed">
              Cargamos tu catálogo de servicios o productos, personalizamos los mensajes de WhatsApp y configuramos los turnos de tu personal.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-emerald-400 font-mono font-bold text-base">Paso 03.</div>
            <div className="font-semibold text-white">Capacitación y Acompañamiento</div>
            <p className="text-neutral-300 leading-relaxed">
              Te enseñamos a ti y a tu equipo a usarlo en 15 minutos desde el celular o computadora. Te acompañamos por WhatsApp para resolver cualquier duda.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials with High Fidelity Generated Avatars */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Casos de Éxito de Emprendedores
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Negocios reales que dejaron atrás las libretas y el desorden en WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Testimonial 1 */}
          <div className="p-5 bg-white rounded-xl border border-neutral-200 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={avatarBarberImg}
                alt="Daniel Morales, dueño de El Barbero Studio"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-neutral-200"
              />
              <div>
                <div className="font-bold text-sm text-neutral-900">Daniel Morales</div>
                <div className="text-xs text-neutral-500">Fundador de El Barbero Studio · Barbería con 3 sillones</div>
              </div>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed italic">
              "Antes anotábamos las citas en un cuaderno manchado de gel y en 3 celulares diferentes. Cada semana se empalmaban 2 o 3 clientes o alguien no llegaba porque se le olvidaba. Desde que centralizamos la agenda y mandamos el recordatorio de WhatsApp con un clic, las inasistencias cayeron a cero y ahorramos más de 6 horas semanales."
            </p>
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 pt-1">
              <Check className="w-3.5 h-3.5" />
              <span>Resultado: Cero citas empalmadas y +$2,400 MXN mensuales recuperados</span>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="p-5 bg-white rounded-xl border border-neutral-200 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={avatarBakeryImg}
                alt="Sofía Gutiérrez, fundadora de Dulce Hogar Pastelería"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-neutral-200"
              />
              <div>
                <div className="font-bold text-sm text-neutral-900">Sofía Gutiérrez</div>
                <div className="text-xs text-neutral-500">Chef y Propietaria · Dulce Hogar Pastelería Artesanal</div>
              </div>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed italic">
              "Mi mayor angustia eran los anticipos de pedidos de cumpleaños. Entre tantos mensajes en WhatsApp a veces olvidaba cobrar el saldo final al entregar o no tenía anotada la dedicatoria exacta del pastel. Ahora todo queda registrado en 10 segundos y el control de cobros es impecable."
            </p>
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 pt-1">
              <Check className="w-3.5 h-3.5" />
              <span>Resultado: Control del 100% de anticipos y tranquilidad mental</span>
            </div>
          </div>
        </div>
      </div>

      {/* Economical Pricing Packages */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Planes Claros y Accesibles
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Herramientas profesionales pensadas para la economía del pequeño comercio local.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1 */}
          <div className="p-5 bg-white rounded-lg border border-neutral-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-500 uppercase">Para Emprendedores Individuales</div>
              <h3 className="text-base font-bold text-neutral-900">Plan Arranque</h3>
              <div className="font-mono text-2xl font-bold text-neutral-900 tabular-nums">
                $499 MXN <span className="text-xs text-neutral-500 font-sans font-normal">/ pago único</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Configuración completa de tu catálogo, carga inicial de servicios y acceso permanente a la plataforma.
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Agenda y control de citas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Control de pedidos con anticipos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Convertidor de WhatsApp a Sistema</span>
                </li>
              </ul>
            </div>
            <a
              href="#diagnostico"
              className="w-full py-2 px-3 text-center text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg transition-colors block"
            >
              Comenzar con Arranque
            </a>
          </div>

          {/* Plan 2: Featured */}
          <div className="p-5 bg-white rounded-lg border-2 border-neutral-900 space-y-4 flex flex-col justify-between shadow-xs relative">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-emerald-700 uppercase">Recomendado para Comercios</div>
              <h3 className="text-base font-bold text-neutral-900">Plan Negocio Activo</h3>
              <div className="font-mono text-2xl font-bold text-neutral-900 tabular-nums">
                $299 MXN <span className="text-xs text-neutral-500 font-sans font-normal">/ mes</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Para negocios con 2 a 5 personas que necesitan soporte continuo y respaldos automáticos.
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Todo lo del Plan Arranque</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Multiusuario para todo tu personal</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Soporte prioritario por WhatsApp</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Exportación de ventas y reportes mensuales</span>
                </li>
              </ul>
            </div>
            <a
              href="#diagnostico"
              className="w-full py-2 px-3 text-center text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors block"
            >
              Solicitar Negocio Activo
            </a>
          </div>

          {/* Plan 3 */}
          <div className="p-5 bg-white rounded-lg border border-neutral-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-500 uppercase">Acompañamiento Total</div>
              <h3 className="text-base font-bold text-neutral-900">Llave en Mano</h3>
              <div className="font-mono text-2xl font-bold text-neutral-900 tabular-nums">
                $999 MXN <span className="text-xs text-neutral-500 font-sans font-normal">/ pago único</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Nosotros mismos digitalizamos tus libretas y chats actuales, capacitamos a tu equipo y te dejamos operando.
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Migración completa de libretas y clientes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sesión 1 a 1 de capacitación para el equipo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>30 días de garantía y ajustes incluidos</span>
                </li>
              </ul>
            </div>
            <a
              href="#diagnostico"
              className="w-full py-2 px-3 text-center text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg transition-colors block"
            >
              Consultar Llave en Mano
            </a>
          </div>
        </div>
      </div>

      {/* Free 15-Minute Diagnostic Form */}
      <div id="diagnostico" className="p-6 sm:p-8 bg-white rounded-xl border border-neutral-200 space-y-4">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            Sin Compromiso
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-0.5">
            Agenda una Sesión de Diagnóstico Gratuita (15 Minutos)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Revisamos tu flujo actual de pedidos o citas por WhatsApp y te mostramos exactamente cómo ordenar tu negocio paso a paso.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center animate-in fade-in">
            <Check className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-950">
              ¡Solicitud Recibida con Éxito!
            </h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Te contactaremos por WhatsApp al número proporcionado en las próximas horas para coordinar tu sesión de 15 minutos sin costo.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitLead} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Tu Nombre o Negocio *</label>
              <input
                type="text"
                required
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Ej. Sofía / Salón Estilo"
                className="w-full p-2.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">WhatsApp de Contacto *</label>
              <input
                type="tel"
                required
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                placeholder="Ej. 55 1234 5678"
                className="w-full p-2.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Giro de tu Negocio</label>
              <select
                value={leadBusinessType}
                onChange={(e) => setLeadBusinessType(e.target.value)}
                className="w-full p-2.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
              >
                <option value="Salón / Barbería">Salón / Barbería</option>
                <option value="Comida / Repostería">Comida / Repostería</option>
                <option value="Tienda / Venta Online">Tienda / Venta Online</option>
                <option value="Servicios Independientes">Servicios Independientes</option>
                <option value="Otro Comercio">Otro Pequeño Comercio</option>
              </select>
            </div>

            <div className="sm:col-span-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
              >
                Solicitar Diagnóstico Gratuito por WhatsApp
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
