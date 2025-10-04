import React from 'react';
import { Mountain, Mail, Globe, Shield, FileText, Cookie } from 'lucide-react';

interface FooterProps {
  onShowPrivacy: () => void;
  onShowLegal: () => void;
  onShowCookies: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowPrivacy, onShowLegal, onShowCookies }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="35" cy="65" r="8" fill="none" stroke="#f97316" strokeWidth="2.5"/>
                  <circle cx="65" cy="65" r="8" fill="none" stroke="#f97316" strokeWidth="2.5"/>
                  <path
                    d="M35 65 L50 45 L65 65 M50 45 L50 50 M48 50 L52 50"
                    stroke="#f97316"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M35 65 L65 65"
                    stroke="#f97316"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">CyclePeaks</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              La plataforma definitiva para conquistar los puertos de montaña más famosos del mundo. 
              Únete a nuestra comunidad de ciclistas apasionados.
            </p>
            <div className="flex space-x-4">
              <a 
                href="mailto:info@cyclepeaks.com" 
                className="flex items-center space-x-2 text-slate-300 hover:text-orange-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@cyclepeaks.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-300 hover:text-orange-400 transition-colors text-sm">
                  Puertos de Montaña
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-orange-400 transition-colors text-sm">
                  Mapa Interactivo
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-orange-400 transition-colors text-sm">
                  Estadísticas
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-orange-400 transition-colors text-sm">
                  Colaboradores
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-orange-400 transition-colors text-sm">
                  Noticias
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={onShowPrivacy}
                  className="flex items-center space-x-2 text-slate-300 hover:text-orange-400 transition-colors text-sm"
                >
                  <Shield className="h-4 w-4" />
                  <span>Política de Privacidad</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onShowLegal}
                  className="flex items-center space-x-2 text-slate-300 hover:text-orange-400 transition-colors text-sm"
                >
                  <FileText className="h-4 w-4" />
                  <span>Aviso Legal</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onShowCookies}
                  className="flex items-center space-x-2 text-slate-300 hover:text-orange-400 transition-colors text-sm"
                >
                  <Cookie className="h-4 w-4" />
                  <span>Política de Cookies</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm">
              © {currentYear} CyclePeaks. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-6">
              <a 
                href="#" 
                className="text-slate-400 hover:text-orange-400 transition-colors"
                aria-label="Sitio web"
              >
                <Globe className="h-5 w-5" />
              </a>
              <span className="text-slate-500 text-xs">
                Hecho con ❤️ para ciclistas
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};