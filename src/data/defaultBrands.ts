import { Brand } from '../types';

export const defaultBrands: Brand[] = [
  {
    id: 'trek',
    name: 'Trek',
    category: 'Bicicletas',
    description: 'Fabricante estadounidense de bicicletas de alta calidad, conocido por sus innovaciones tecnológicas y patrocinio de equipos profesionales.',
    logo: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg',
    website: 'https://www.trekbikes.com',
    country: 'Estados Unidos',
    foundedYear: 1976,
    specialties: ['Bicicletas de carretera', 'Mountain bikes', 'Bicicletas eléctricas'],
    isActive: true,
    featured: true
  },
  {
    id: 'specialized',
    name: 'Specialized',
    category: 'Bicicletas',
    description: 'Marca pionera en el desarrollo de bicicletas especializadas para diferentes disciplinas del ciclismo.',
    logo: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg',
    website: 'https://www.specialized.com',
    country: 'Estados Unidos',
    foundedYear: 1974,
    specialties: ['Bicicletas de carretera', 'Mountain bikes', 'Componentes'],
    isActive: true,
    featured: true
  },
  {
    id: 'shimano',
    name: 'Shimano',
    category: 'Componentes',
    description: 'Líder mundial en componentes para bicicletas, especialmente conocido por sus grupos de cambios y frenos.',
    logo: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg',
    website: 'https://www.shimano.com',
    country: 'Japón',
    foundedYear: 1921,
    specialties: ['Grupos de cambios', 'Frenos', 'Pedales', 'Ruedas'],
    isActive: true,
    featured: true
  },
  {
    id: 'castelli',
    name: 'Castelli',
    category: 'Ropa',
    description: 'Marca italiana de ropa ciclista premium, conocida por vestir a los mejores equipos profesionales.',
    logo: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg',
    website: 'https://www.castelli-cycling.com',
    country: 'Italia',
    foundedYear: 1876,
    specialties: ['Maillots', 'Culotes', 'Chaquetas', 'Accesorios'],
    isActive: true,
    featured: false
  },
  {
    id: 'garmin',
    name: 'Garmin',
    category: 'Accesorios',
    description: 'Fabricante de dispositivos GPS y tecnología para ciclistas, incluyendo ciclocomputadores y relojes deportivos.',
    logo: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg',
    website: 'https://www.garmin.com',
    country: 'Estados Unidos',
    foundedYear: 1989,
    specialties: ['Ciclocomputadores', 'Relojes GPS', 'Sensores', 'Navegación'],
    isActive: true,
    featured: false
  }
];