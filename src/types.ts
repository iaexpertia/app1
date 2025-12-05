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
  isActive?: boolean;
}

export interface ConquestData {
  passId: string;
  dateCompleted: string;
  timeCompleted?: string;
  personalNotes?: string;
  photos?: string[];
  stravaActivityId?: string;
  stravaActivityUrl?: string;
  syncedFromStrava?: boolean;
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
  profilePhoto?: string;
  bikes: Bike[];
  registrationDate: string;
  isAdmin?: boolean;
  stravaConnected?: boolean;
  stravaAthleteId?: string;
  stravaAccessToken?: string;
  stravaRefreshToken?: string;
  stravaTokenExpiry?: number;
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  start_latlng?: [number, number];
  end_latlng?: [number, number];
  map?: {
    summary_polyline?: string;
  };
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
  nameTranslations?: { es: string; en: string; fr: string; it: string };
  category: 'Tienda de Bicicletas' | 'Hotel' | 'Restaurante' | 'Guía Turístico' | 'Equipamiento' | 'Otros';
  description: string;
  descriptionTranslations?: { es: string; en: string; fr: string; it: string };
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
  nameTranslations?: { es: string; en: string; fr: string; it: string };
  category: 'Bicicletas' | 'Componentes' | 'Ropa' | 'Accesorios' | 'Nutrición' | 'Otros';
  description: string;
  descriptionTranslations?: { es: string; en: string; fr: string; it: string };
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
  titleTranslations?: { es: string; en: string; fr: string; it: string };
  summary: string;
  summaryTranslations?: { es: string; en: string; fr: string; it: string };
  content: string;
  contentTranslations?: { es: string; en: string; fr: string; it: string };
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
  nameTranslations?: { es: string; en: string; fr: string; it: string };
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
  descriptionTranslations?: { es: string; en: string; fr: string; it: string };
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

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}