import React, { useState, useEffect } from 'react';
import { User, LogOut, Mountain, Trophy, Map, Settings, ChevronRight } from 'lucide-react';
import { getCurrentUser, getCyclistProfile, signOut, CyclistProfile } from '../../utils/supabaseAuthService';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<CyclistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const user = await getCurrentUser();

      if (!user) {
        onNavigate('login');
        return;
      }

      const cyclistProfile = await getCyclistProfile(user.id);
      setProfile(cyclistProfile);
      setLoading(false);
    };

    loadProfile();
  }, [onNavigate]);

  const handleLogout = async () => {
    setLoggingOut(true);
    const result = await signOut();

    if (result.success) {
      onNavigate('login');
    } else {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      icon: Mountain,
      title: 'Mis Puertos',
      description: 'Ver puertos conquistados',
      action: () => onNavigate('home'),
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: Map,
      title: 'Explorar Mapa',
      description: 'Descubrir nuevos puertos',
      action: () => onNavigate('home'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Trophy,
      title: 'Estadisticas',
      description: 'Ver mi progreso',
      action: () => onNavigate('home'),
      color: 'from-amber-500 to-amber-600',
    },
    {
      icon: Settings,
      title: 'Configuracion',
      description: 'Editar perfil',
      action: () => onNavigate('home'),
      color: 'from-slate-500 to-slate-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border-2 border-teal-500">
              {profile?.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
              )}
            </div>
            <div>
              <h1 className="font-semibold text-slate-800">{profile?.name || 'Ciclista'}</h1>
              <p className="text-xs text-slate-500">{profile?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            {loggingOut ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">Cerrar Sesion</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Bienvenido{profile?.alias ? `, ${profile.alias}` : ''}!
          </h2>
          <p className="text-teal-100">
            Tu panel de control para gestionar tus conquistas ciclistas
          </p>
        </div>

        <h3 className="text-lg font-semibold text-slate-800 mb-4">Acceso Rapido</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all group text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-sm text-slate-500">{action.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Informacion del Perfil</h3>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Nombre</span>
              <span className="text-slate-800 font-medium">{profile?.name || '-'}</span>
            </div>
            {profile?.alias && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Alias</span>
                <span className="text-slate-800 font-medium">{profile.alias}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Email</span>
              <span className="text-slate-800 font-medium">{profile?.email || '-'}</span>
            </div>
            {profile?.phone && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Telefono</span>
                <span className="text-slate-800 font-medium">{profile.phone}</span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Miembro desde</span>
              <span className="text-slate-800 font-medium">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '-'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
