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
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
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
  category: 'Alps' | 'Pyrenees' | 'Dolomites' | 'Andes' | 'Other';
}

export interface ConquestData {
  passId: string;
  dateCompleted: string;
  timeCompleted?: string;
  personalNotes?: string;
}

export interface UserStats {
  totalPasses: number;
  conqueredPasses: number;
  totalElevationGain: number;
  averageDifficulty: string;
  countriesVisited: string[];
}