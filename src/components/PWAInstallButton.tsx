import React, { useState } from 'react';
import { Download, Smartphone, Apple, Check, X, Share2, PlusSquare, Monitor, HelpCircle, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'android' | 'ios' | 'native'>('android');

  // If already running inside standalone app mode, hide prompt or show subtle indicator
  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
        <Check className="w-3.5 h-3.5" />
        <span>App Instalada</span>
      </span>
    );
  }

  const handleButtonClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        title="Instalar CentralNegocio como aplicación en tu celular o PC"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors shadow-xs whitespace-nowrap"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
        <span>Instalar App</span>
      </button>

      {/* Installation Guide & Conversion Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-lg">
                  CN
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Instalar CentralNegocio como App
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Úsala en pantalla completa con ícono en tu pantalla de inicio
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Trigger button if browser supports beforeinstallprompt */}
            {isInstallable && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-emerald-900">
                    Tu navegador está listo para instalar
                  </div>
                  <div className="text-xs text-emerald-700">
                    Haz clic en el botón para agregar el ícono directamente.
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await install();
                    setShowGuideModal(false);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow-xs"
                >
                  Instalar Ahora
                </button>
              </div>
            )}

            {/* Guide Tabs */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs">
              <button
                onClick={() => setActiveGuideTab('android')}
                className={`flex-1 py-1.5 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  activeGuideTab === 'android'
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android / Chrome</span>
              </button>
              <button
                onClick={() => setActiveGuideTab('ios')}
                className={`flex-1 py-1.5 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  activeGuideTab === 'ios'
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>
              <button
                onClick={() => setActiveGuideTab('native')}
                className={`flex-1 py-1.5 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  activeGuideTab === 'native'
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Play Store (APK)</span>
              </button>
            </div>

            {/* Tab 1: Android & Desktop */}
            {activeGuideTab === 'android' && (
              <div className="space-y-3 text-xs text-neutral-700">
                <div className="font-semibold text-neutral-900">
                  Instalación instantánea en Android o Computadora:
                </div>
                <ol className="space-y-2 list-decimal list-inside bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                  <li className="leading-relaxed">
                    Abre el enlace de la aplicación en el navegador <strong>Google Chrome</strong> o <strong>Edge</strong>.
                  </li>
                  <li className="leading-relaxed">
                    Toca el menú de los <strong>3 puntos (⋮)</strong> en la esquina superior derecha del navegador.
                  </li>
                  <li className="leading-relaxed">
                    Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                  </li>
                  <li className="leading-relaxed">
                    ¡Listo! Se creará el ícono con el logo de <strong>CentralNegocio</strong> en la pantalla de tu celular y funcionará como una aplicación nativa sin barra de navegación.
                  </li>
                </ol>
              </div>
            )}

            {/* Tab 2: iOS / Safari */}
            {activeGuideTab === 'ios' && (
              <div className="space-y-3 text-xs text-neutral-700">
                <div className="font-semibold text-neutral-900">
                  Instalación en iPhone / iPad (iOS Safari):
                </div>
                <ol className="space-y-2.5 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                  <li className="flex items-start gap-2">
                    <span className="font-bold font-mono text-neutral-900 shrink-0">1.</span>
                    <span>Abre este enlace en el navegador <strong>Safari</strong> de tu iPhone.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold font-mono text-neutral-900 shrink-0">2.</span>
                    <div>
                      <span>Toca el botón <strong>Compartir</strong></span>{' '}
                      <span className="inline-flex items-center text-neutral-500 bg-white border border-neutral-200 px-1.5 py-0.5 rounded text-[11px] font-sans">
                        <Share2 className="w-3 h-3 inline mr-1 text-blue-600" /> (cuadrado con flecha hacia arriba)
                      </span>{' '}
                      en la barra inferior.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold font-mono text-neutral-900 shrink-0">3.</span>
                    <div>
                      <span>Baja en las opciones y presiona <strong>"Agregar al inicio"</strong></span>{' '}
                      <span className="inline-flex items-center text-neutral-500 bg-white border border-neutral-200 px-1.5 py-0.5 rounded text-[11px] font-sans">
                        <PlusSquare className="w-3 h-3 inline mr-1 text-neutral-700" />
                      </span>.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold font-mono text-neutral-900 shrink-0">4.</span>
                    <span>Confirma tocando <strong>"Agregar"</strong> en la esquina superior derecha.</span>
                  </li>
                </ol>
              </div>
            )}

            {/* Tab 3: Native Store packaging (Capacitor) */}
            {activeGuideTab === 'native' && (
              <div className="space-y-3 text-xs text-neutral-700">
                <div className="font-semibold text-neutral-900">
                  ¿Quieres publicar un archivo APK en Google Play Store?
                </div>
                <p className="text-neutral-600 leading-relaxed">
                  Dado que esta aplicación está construida en Vite + React, puedes convertirla en un archivo APK nativo para Android en minutos usando <strong>Capacitor</strong>:
                </p>
                <div className="bg-neutral-900 text-neutral-100 p-3 rounded-lg font-mono text-[11px] space-y-1.5">
                  <div className="text-neutral-400"># 1. Instalar Capacitor</div>
                  <div>npm install @capacitor/core @capacitor/cli</div>
                  <div className="text-neutral-400 pt-1"># 2. Inicializar y compilar</div>
                  <div>npx cap init "CentralNegocio" "com.centralnegocio.app"</div>
                  <div>npm run build</div>
                  <div className="text-neutral-400 pt-1"># 3. Generar proyecto Android Studio (APK)</div>
                  <div>npm install @capacitor/android</div>
                  <div>npx cap add android</div>
                  <div>npx cap open android</div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
              <span className="text-neutral-500">
                Funciona sin conexión a internet gracias al Service Worker
              </span>
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
