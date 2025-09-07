import React from 'react';
import { X, Shield, FileText, Cookie } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'legal' | 'cookies';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const getModalContent = () => {
    switch (type) {
      case 'privacy':
        return {
          icon: Shield,
          title: 'Política de Privacidad',
          content: (
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">1. Información que recopilamos</h3>
                <p className="text-slate-600 leading-relaxed">
                  En CyclePeaks recopilamos únicamente la información necesaria para proporcionarte nuestros servicios:
                </p>
                <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                  <li>Información de registro: nombre, email, teléfono</li>
                  <li>Datos de ciclismo: bicicletas, puertos conquistados, fotos</li>
                  <li>Información técnica: cookies, logs de navegación</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">2. Cómo utilizamos tu información</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Proporcionar y mejorar nuestros servicios</li>
                  <li>Personalizar tu experiencia en la plataforma</li>
                  <li>Enviar comunicaciones importantes sobre tu cuenta</li>
                  <li>Generar estadísticas anónimas de uso</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">3. Compartir información</h3>
                <p className="text-slate-600 leading-relaxed">
                  No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto:
                </p>
                <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                  <li>Cuando sea requerido por ley</li>
                  <li>Para proteger nuestros derechos legales</li>
                  <li>Con tu consentimiento explícito</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">4. Seguridad de datos</h3>
                <p className="text-slate-600 leading-relaxed">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal 
                  contra acceso no autorizado, alteración, divulgación o destrucción.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">5. Tus derechos</h3>
                <p className="text-slate-600 leading-relaxed">
                  Tienes derecho a acceder, rectificar, suprimir y portar tus datos personales. 
                  Para ejercer estos derechos, contacta con nosotros en: 
                  <a href="mailto:privacy@cyclepeaks.com" className="text-orange-600 hover:text-orange-700">
                    privacy@cyclepeaks.com
                  </a>
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">6. Contacto</h3>
                <p className="text-slate-600 leading-relaxed">
                  Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg mt-2">
                  <p className="text-slate-700">
                    <strong>Email:</strong> privacy@cyclepeaks.com<br/>
                    <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
                  </p>
                </div>
              </section>
            </div>
          )
        };

      case 'legal':
        return {
          icon: FileText,
          title: 'Aviso Legal',
          content: (
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">1. Información general</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700">
                    <strong>Denominación social:</strong> CyclePeaks<br/>
                    <strong>Actividad:</strong> Plataforma digital para ciclistas<br/>
                    <strong>Email:</strong> legal@cyclepeaks.com<br/>
                    <strong>Web:</strong> www.cyclepeaks.com
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">2. Condiciones de uso</h3>
                <p className="text-slate-600 leading-relaxed">
                  El acceso y uso de esta plataforma implica la aceptación de estas condiciones. 
                  CyclePeaks se reserva el derecho de modificar estos términos en cualquier momento.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">3. Propiedad intelectual</h3>
                <p className="text-slate-600 leading-relaxed">
                  Todos los contenidos de esta plataforma (textos, imágenes, diseño, código) están protegidos 
                  por derechos de propiedad intelectual. Queda prohibida su reproducción sin autorización expresa.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">4. Responsabilidad</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>CyclePeaks no se responsabiliza de interrupciones del servicio</li>
                  <li>El usuario es responsable del uso que haga de la plataforma</li>
                  <li>No garantizamos la exactitud de toda la información publicada</li>
                  <li>Los enlaces externos son responsabilidad de sus propietarios</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">5. Legislación aplicable</h3>
                <p className="text-slate-600 leading-relaxed">
                  Este aviso legal se rige por la legislación española. Para cualquier controversia, 
                  las partes se someten a los juzgados y tribunales competentes.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">6. Contacto legal</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700">
                    <strong>Email legal:</strong> legal@cyclepeaks.com<br/>
                    <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
                  </p>
                </div>
              </section>
            </div>
          )
        };

      case 'cookies':
        return {
          icon: Cookie,
          title: 'Política de Cookies',
          content: (
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">¿Qué son las cookies?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas 
                  nuestra plataforma. Nos ayudan a mejorar tu experiencia y el funcionamiento del sitio.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Tipos de cookies que utilizamos</h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-slate-800">Cookies esenciales</h4>
                    <p className="text-slate-600 text-sm">
                      Necesarias para el funcionamiento básico de la plataforma. No se pueden desactivar.
                    </p>
                    <ul className="list-disc list-inside text-slate-600 text-sm mt-1">
                      <li>Sesión de usuario</li>
                      <li>Preferencias de idioma</li>
                      <li>Configuración de seguridad</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-slate-800">Cookies de funcionalidad</h4>
                    <p className="text-slate-600 text-sm">
                      Mejoran la funcionalidad y personalización de la plataforma.
                    </p>
                    <ul className="list-disc list-inside text-slate-600 text-sm mt-1">
                      <li>Datos de puertos conquistados</li>
                      <li>Preferencias de visualización</li>
                      <li>Configuración de filtros</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-slate-800">Cookies analíticas</h4>
                    <p className="text-slate-600 text-sm">
                      Nos ayudan a entender cómo interactúas con la plataforma para mejorarla. 
                      Incluye Google Analytics para análisis de uso.
                    </p>
                    <ul className="list-disc list-inside text-slate-600 text-sm mt-1">
                      <li>Google Analytics (estadísticas de uso anónimas)</li>
                      <li>Páginas más visitadas</li>
                      <li>Tiempo de navegación</li>
                      <li>Datos demográficos generales</li>
                      <li>Fuentes de tráfico</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Google Analytics</h3>
                <p className="text-slate-600 leading-relaxed">
                  Utilizamos Google Analytics para obtener información sobre cómo los visitantes usan nuestro sitio web. 
                  Google Analytics recopila información de forma anónima, como el número de visitantes al sitio, 
                  de dónde han llegado los visitantes y las páginas que visitaron.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Información sobre Google Analytics:</h4>
                  <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                    <li>Proveedor: Google Inc.</li>
                    <li>Finalidad: Análisis estadístico del uso del sitio web</li>
                    <li>Datos recopilados: Páginas visitadas, tiempo de sesión, ubicación aproximada, dispositivo</li>
                    <li>Duración: Hasta 26 meses</li>
                    <li>Transferencia internacional: Estados Unidos (Google LLC)</li>
                  </ul>
                  <p className="text-blue-700 text-sm mt-2">
                    Más información: 
                    <a href="https://policies.google.com/privacy" className="underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                      Política de Privacidad de Google
                    </a>
                  </p>
                </div>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Gestión de cookies</h3>
                <p className="text-slate-600 leading-relaxed mb-3">
                  Puedes controlar y gestionar las cookies de las siguientes maneras:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Configuración del navegador: Bloquear o eliminar cookies</li>
                  <li>Navegación privada: No se almacenan cookies</li>
                  <li>Herramientas de terceros: Extensiones anti-tracking</li>
                  <li>Desactivar Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-orange-600 hover:text-orange-700 underline" target="_blank" rel="noopener noreferrer">Complemento de inhabilitación</a></li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Nota:</strong> Desactivar ciertas cookies puede afectar la funcionalidad de la plataforma.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Cookies de terceros</h3>
                <p className="text-slate-600 leading-relaxed">
                  Utilizamos Google Analytics, que establece cookies de terceros para el análisis estadístico. 
                  Estas cookies son gestionadas por Google conforme a su propia política de privacidad. 
                  Si integramos otros servicios externos en el futuro, te informaremos y solicitaremos tu consentimiento.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Contacto sobre cookies</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700">
                    <strong>Email:</strong> cookies@cyclepeaks.com<br/>
                    <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
                  </p>
                </div>
              </section>
            </div>
          )
        };

      default:
        return { icon: FileText, title: '', content: null };
    }
  };

  const { icon: Icon, title, content } = getModalContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 transition-colors p-2 hover:bg-slate-100 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {content}
        </div>

        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 rounded-b-2xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};