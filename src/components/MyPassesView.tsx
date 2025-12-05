import React from 'react';
import { MountainPass } from '../types';
import { Translation } from '../i18n/translations';
import { PassCard } from './PassCard';
import { Heart, Mountain } from 'lucide-react';

interface MyPassesViewProps {
  passes: MountainPass[];
  favoritePassIds: Set<string>;
  conqueredPassIds: Set<string>;
  onToggleConquest: (passId: string) => void;
  onToggleFavorite: (passId: string) => void;
  onViewDetails: (pass: MountainPass) => void;
  onAddPhotos: (passId: string) => void;
  t: Translation;
}

export const MyPassesView: React.FC<MyPassesViewProps> = ({
  passes,
  favoritePassIds,
  conqueredPassIds,
  onToggleConquest,
  onToggleFavorite,
  onViewDetails,
  onAddPhotos,
  t
}) => {
  const favoritePasses = passes.filter(pass => favoritePassIds.has(pass.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold text-slate-800">{t.myPasses}</h1>
        </div>
        <p className="text-slate-600">
          {favoritePasses.length === 0
            ? 'No tienes puertos guardados. Añade puertos a tu lista de favoritos para verlos aquí.'
            : `Tienes ${favoritePasses.length} puerto${favoritePasses.length !== 1 ? 's' : ''} guardado${favoritePasses.length !== 1 ? 's' : ''}.`
          }
        </p>
      </div>

      {favoritePasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoritePasses.map(pass => (
            <PassCard
              key={pass.id}
              pass={pass}
              isConquered={conqueredPassIds.has(pass.id)}
              isFavorite={favoritePassIds.has(pass.id)}
              onToggleConquest={onToggleConquest}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={onViewDetails}
              onAddPhotos={onAddPhotos}
              t={t}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Mountain className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg mb-2">No tienes puertos favoritos aún</p>
          <p className="text-slate-500">
            Explora la lista de puertos y añade tus favoritos haciendo clic en el botón de corazón.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyPassesView;
