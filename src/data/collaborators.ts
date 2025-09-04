import { Collaborator } from '../types';

export const collaborators: Collaborator[] = [
  {
    id: 'founder-1',
    name: 'Carlos Rodríguez',
    role: 'Fundador y Desarrollador Principal',
    description: 'Ciclista apasionado con más de 15 años de experiencia en puertos de montaña. Creador de la aplicación Mountain Pass Conquest.',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
    socialLinks: {
      website: 'https://example.com',
      instagram: '@carlosriding',
      twitter: '@carlosdev'
    },
    isActive: true
  },
  {
    id: 'contributor-1',
    name: 'María González',
    role: 'Especialista en Rutas de Montaña',
    description: 'Guía de montaña certificada y experta en rutas ciclistas de los Alpes y Pirineos. Contribuye con información detallada de los puertos.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    socialLinks: {
      instagram: '@mariamountain',
      linkedin: 'maria-gonzalez-cycling'
    },
    isActive: true
  },
  {
    id: 'contributor-2',
    name: 'Jean-Pierre Dubois',
    role: 'Consultor de Rutas Francesas',
    description: 'Ciclista francés con conocimiento enciclopédico de los puertos de los Alpes franceses. Ha conquistado más de 200 puertos.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    socialLinks: {
      website: 'https://alpescycling.fr'
    },
    isActive: true
  }
];