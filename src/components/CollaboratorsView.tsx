import React from 'react';
import { Collaborator } from '../types';
import { Translation } from '../i18n/translations';
import { collaborators } from '../data/collaborators';
import { 
  Users, 
  Globe, 
  Instagram, 
  Twitter, 
  Linkedin,
  ExternalLink
} from 'lucide-react';

interface CollaboratorsViewProps {
  t: Translation;
}

export const CollaboratorsView: React.FC<CollaboratorsViewProps> = ({ t }) => {
  const activeCollaborators = collaborators.filter(c => c.isActive);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Users className="h-8 w-8 text-orange-500 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{t.collaborators}</h2>
            <p className="text-slate-600">{t.collaboratorsDescription}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeCollaborators.map((collaborator) => (
          <div key={collaborator.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-64">
              <img 
                src={collaborator.image || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg'} 
                alt={collaborator.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-1">{collaborator.name}</h3>
                <p className="text-sm opacity-90">{collaborator.role}</p>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-slate-700 mb-4 leading-relaxed">
                {collaborator.description}
              </p>
              
              {collaborator.socialLinks && (
                <div className="flex items-center space-x-3">
                  {collaborator.socialLinks.website && (
                    <a
                      href={collaborator.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-100 rounded-full hover:bg-orange-100 transition-colors"
                    >
                      <Globe className="h-4 w-4 text-slate-600 hover:text-orange-600" />
                    </a>
                  )}
                  
                  {collaborator.socialLinks.instagram && (
                    <a
                      href={`https://instagram.com/${collaborator.socialLinks.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-100 rounded-full hover:bg-pink-100 transition-colors"
                    >
                      <Instagram className="h-4 w-4 text-slate-600 hover:text-pink-600" />
                    </a>
                  )}
                  
                  {collaborator.socialLinks.twitter && (
                    <a
                      href={`https://twitter.com/${collaborator.socialLinks.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-100 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Twitter className="h-4 w-4 text-slate-600 hover:text-blue-600" />
                    </a>
                  )}
                  
                  {collaborator.socialLinks.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${collaborator.socialLinks.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-100 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-slate-600 hover:text-blue-600" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {activeCollaborators.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl text-slate-600 mb-2">{t.noCollaborators}</p>
          <p className="text-slate-500">{t.noCollaboratorsDesc}</p>
        </div>
      )}
    </div>
  );
};