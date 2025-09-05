import { Collaborator } from '../types';

export const defaultCollaborators: Collaborator[] = [
  {
    id: 'bike-shop-1',
    name: 'Ciclos Montaña Pro',
    category: 'Bike Shop',
    description: 'Especialistas en bicicletas de montaña y carretera. Más de 20 años de experiencia sirviendo a la comunidad ciclista.',
    contactInfo: {
      email: 'info@ciclosmontanapro.com',
      phone: '+34 987 654 321',
      website: 'https://ciclosmontanapro.com',
      address: 'Calle Ciclista 123, Madrid'
    },
    images: [
      'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg',
      'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg'
    ],
    isActive: true,
    featured: true
  },
  {
    id: 'hotel-1',
    name: 'Hotel Refugio del Ciclista',
    category: 'Hotel',
    description: 'Hotel especializado en ciclistas con servicio de guardabicicletas, taller básico y rutas guiadas.',
    contactInfo: {
      email: 'reservas@refugiociclista.com',
      phone: '+34 876 543 210',
      website: 'https://refugiociclista.com',
      address: 'Carretera de Montaña Km 15, Asturias'
    },
    images: [
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'
    ],
    isActive: true,
    featured: false
  },
  {
    id: 'restaurant-1',
    name: 'Restaurante El Puerto',
    category: 'Restaurant',
    description: 'Cocina tradicional con menús especiales para deportistas. Ubicado en la base del Col du Tourmalet.',
    contactInfo: {
      email: 'contacto@elpuerto.fr',
      phone: '+33 5 62 91 94 15',
      website: 'https://restaurante-elpuerto.fr',
      address: 'Route du Col du Tourmalet, Francia'
    },
    images: [
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg'
    ],
    isActive: true,
    featured: true
  }
];