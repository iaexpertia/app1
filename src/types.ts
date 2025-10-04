export interface MountainPass {
  id: string;
  name: string;
  country: string;
  region: string;
  maxAltitude: number;
  elevationGain: number;
  averageGradient: number;
  maxGradient: number;
  distance: number;
  difficulty: 'Cuarta' | 'Tercera' | 'Segunda' | 'Primera' | 'Especial';
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  famousWinners: {
    year: number;
    race: string;
    winner: string;
    time?: string;
  }[];
  imageUrl: string;
  category: string;
}

export interface ConquestData {
  passId: string;
  dateCompleted: string;
  timeCompleted?: string;
  personalNotes?: string;
  photos?: string[];
}

export interface UserStats {
  totalPasses: number;
  conqueredPasses: number;
  totalElevationGain: number;
  averageDifficulty: string;
  countriesVisited: string[];
}

export interface Cyclist {
  id: string;
  name: string;
  alias?: string;
  email: string;
  password?: string;
  phone: string;
  city?: string;
  country?: string;
  age?: number;
  weight?: number;
  bikes: Bike[];
  registrationDate: string;
  isAdmin?: boolean;
}

export interface Bike {
  id: string;
  brand: string;
  model: string;
  year?: number;
  type: 'Road' | 'Mountain' | 'Gravel' | 'Electric' | 'Other';
}

export interface Collaborator {
  id: string;
  name: string;
  category: 'Tienda de Bicicletas' | 'Hotel' | 'Restaurante' | 'Guía Turístico' | 'Equipamiento' | 'Otros';
  description: string;
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
  };
  images: string[];
  isActive: boolean;
  featured: boolean;
}

export interface Brand {
  id: string;
  name: string;
  category: 'Bicicletas' | 'Componentes' | 'Ropa' | 'Accesorios' | 'Nutrición' | 'Otros';
  description: string;
  logo?: string;
  website?: string;
  country?: string;
  foundedYear?: number;
  specialties: string[];
  isActive: boolean;
  featured: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  category: 'Competición' | 'Equipamiento' | 'Rutas' | 'Noticias' | 'Entrevistas';
  imageUrl: string;
  readTime: number;
  featured: boolean;
  externalUrl?: string;
}

export interface CyclingRace {
  id: string;
  name: string;
  date: string;
  location: {
    city: string;
    region: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  distance: number;
  elevation: number;
  type: 'Carretera' | 'MTB' | 'Gravel' | 'Ciclocross' | 'Contrarreloj' | 'Otro';
  category: 'Profesional' | 'Amateur' | 'Gran Fondo' | 'Marcha' | 'Otro';
  description: string;
  posterUrl: string;
  registrationUrl?: string;
  startTime?: string;
  maxParticipants?: number;
  price?: number;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  featured: boolean;
  isActive: boolean;
}