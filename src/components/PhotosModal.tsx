import React, { useState, useEffect } from 'react';
import { ConquestData, MountainPass } from '../types';
import { Translation } from '../i18n/translations';
import { 
  X, 
  Camera, 
  Upload, 
  Trash2, 
  Save,
  Plus,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface PhotosModalProps {
  pass: MountainPass | null;
  conquest: ConquestData | null;
  onClose: () => void;
  onSavePhotos: (passId: string, photos: string[]) => void;
  t: Translation;
}

export const PhotosModal: React.FC<PhotosModalProps> = ({ 
  pass, 
  conquest,
  onClose, 
  onSavePhotos,
  t 
}) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    if (conquest?.photos) {
      setPhotos(conquest.photos);
    }
  }, [conquest]);

  if (!pass) return null;

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setPhotos([...photos, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    if (currentPhotoIndex >= photos.length - 1) {
      setCurrentPhotoIndex(Math.max(0, photos.length - 2));
    }
  };

  const handleSave = () => {
    onSavePhotos(pass.id, photos);
    onClose();
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP)');
      return;
    }

    // Validar tamaño (10MB máximo para fotos)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      alert('El archivo es demasiado grande. El tamaño máximo es 10MB');
      return;
    }

    // Convertir a Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setPhotos([...photos, base64String]);
      // Reset file input
      event.target.value = '';
    };
    reader.onerror = () => {
      alert('Error al leer el archivo. Por favor intenta de nuevo.');
    };
    reader.readAsDataURL(file);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Fotos de la Ruta</h3>
                <p className="text-slate-600">{pass.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6">
            {/* Photo Gallery */}
            {photos.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">
                  Mis Fotos ({photos.length})
                </h4>
                
                {/* Main Photo Display */}
                <div className="relative mb-4">
                  <div className="relative h-64 bg-slate-100 rounded-lg overflow-hidden">
                    <img 
                      src={photos[currentPhotoIndex]} 
                      alt={`Foto ${currentPhotoIndex + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setShowFullscreen(true)}
                    />
                    
                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={prevPhoto}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={nextPhoto}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => handleRemovePhoto(currentPhotoIndex)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {photos.length > 1 && (
                    <div className="flex justify-center mt-2 space-x-1">
                      {photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentPhotoIndex ? 'bg-blue-500' : 'bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={photo} 
                        alt={`Miniatura ${index + 1}`}
                        className={`w-full h-16 object-cover rounded-lg cursor-pointer transition-all ${
                          index === currentPhotoIndex 
                            ? 'ring-2 ring-blue-500' 
                            : 'hover:opacity-80'
                        }`}
                        onClick={() => setCurrentPhotoIndex(index)}
                      />
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add New Photo */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-blue-500" />
                Añadir Nueva Foto
              </h4>
              
              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://ejemplo.com/mi-foto.jpg"
                  />
                </div>
                <button
                  onClick={handleAddPhoto}
                  disabled={!newPhotoUrl.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Añadir</span>
                </button>
              </div>
              
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <ImageIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Consejos para añadir fotos:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Usa URLs de imágenes públicas (Imgur, Google Photos, etc.)</li>
                      <li>Asegúrate de que la URL termine en .jpg, .png o .webp</li>
                      <li>Las fotos se mostrarán en el orden que las añadas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {photos.length === 0 && (
              <div className="text-center py-8">
                <Camera className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-xl text-slate-600 mb-2">No hay fotos todavía</p>
                <p className="text-slate-500">Añade fotos de tu conquista de este puerto</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Guardar Fotos</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Modal */}
      {showFullscreen && photos.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60">
          <div className="relative max-w-full max-h-full">
            <img 
              src={photos[currentPhotoIndex]} 
              alt={`Foto ${currentPhotoIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            >
              <X className="h-6 w-6" />
            </button>
            
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-opacity"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-opacity"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};