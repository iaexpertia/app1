import React from 'react';
import { Mountain, Mail, Globe, Shield, FileText, Cookie, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';

interface FooterProps {
  onShowPrivacy: () => void;
  onShowLegal: () => void;
  onShowCookies: () => void;
}

// Social media storage functions
const SOCIAL_MEDIA_KEY = 'social-media-urls';

interface SocialMediaUrls {
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
}

const getDefaultSocialUrls = (): SocialMediaUrls => ({
  instagram: 'https://instagram.com/cyclepeaks',
  facebook: 'https://facebook.com/cyclepeaks',
  youtube: 'https://youtube.com/@cyclepeaks',
  linkedin: 'https://linkedin.com/company/cyclepeaks'
});

export const loadSocialMediaUrls = (): SocialMediaUrls => {
  const stored = localStorage.getItem(SOCIAL_MEDIA_KEY);
  return stored ? JSON.parse(stored) : getDefaultSocialUrls();
};

export const saveSocialMediaUrls = (urls: SocialMediaUrls): void => {
  localStorage.setItem(SOCIAL_MEDIA_KEY, JSON.stringify(urls));
};

// Update Footer to listen for social media changes
export const Footer: React.FC<FooterProps> = ({ onShowPrivacy, onShowLegal, onShowCookies }) => {
  const currentYear = new Date().getFullYear();
  const [socialUrls, setSocialUrls] = React.useState<SocialMediaUrls>(loadSocialMediaUrls());

  React.useEffect(() => {
    const handleSocialMediaUpdate = () => {
      setSocialUrls(loadSocialMediaUrls());
    };

    window.addEventListener('socialMediaUpdated', handleSocialMediaUpdate);
    
    return () => {
      window.removeEventListener('socialMediaUpdated', handleSocialMediaUpdate);
    };
  }, []);
};

  return (
    <footer className="bg-slate-800 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mountain className="h-8 w-8 text-orange-500" />
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
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 pt-4">
              <a 
                href={socialUrls.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href={socialUrls.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href={socialUrls.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-red-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-6 w-6" />
              </a>
              <a 
                href={socialUrls.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-blue-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
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