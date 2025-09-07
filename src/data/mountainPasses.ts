import { MountainPass } from '../types';

export const mountainPasses: MountainPass[] = [
  {
    id: 'alpe-dhuez',
    name: "Alpe d'Huez",
    country: 'France',
    region: 'Alps',
    maxAltitude: 1850,
    elevationGain: 1071,
    averageGradient: 8.1,
    maxGradient: 13,
    distance: 13.2,
    difficulty: 'Hard',
    coordinates: { lat: 45.0914, lng: 6.0669 },
    description: 'Legendary climb with 21 hairpin turns, known as the Dutch Mountain due to its popularity.',
    famousWinners: [
      { year: 2023, race: 'Tour de France', winner: 'Felix Gall' },
      { year: 2022, race: 'Tour de France', winner: 'Tom Pidcock' },
      { year: 2021, race: 'Tour de France', winner: 'Tadej Pogačar' }
    ],
    imageUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
    category: 'Alps'
  },
  {
    id: 'mont-ventoux',
    name: 'Mont Ventoux',
    country: 'France',
    region: 'Provence',
    maxAltitude: 1912,
    elevationGain: 1617,
    averageGradient: 7.5,
    maxGradient: 12,
    distance: 21.5,
    difficulty: 'Extreme',
    coordinates: { lat: 44.1734, lng: 5.2785 },
    description: 'The Giant of Provence, a barren moonscape summit that has broken many Tour de France dreams.',
    famousWinners: [
      { year: 2021, race: 'Tour de France', winner: 'Wout van Aert' },
      { year: 2016, race: 'Tour de France', winner: 'Chris Froome' },
      { year: 2009, race: 'Tour de France', winner: 'Juan Manuel Gárate' }
    ],
    imageUrl: 'https://images.pexels.com/photos/2116721/pexels-photo-2116721.jpeg',
    category: 'Other'
  },
  {
    id: 'col-du-tourmalet',
    name: 'Col du Tourmalet',
    country: 'France',
    region: 'Pyrenees',
    maxAltitude: 2115,
    elevationGain: 1268,
    averageGradient: 7.4,
    maxGradient: 10.2,
    distance: 17.1,
    difficulty: 'Hard',
    coordinates: { lat: 42.9067, lng: 0.1444 },
    description: 'The most frequently climbed mountain in Tour de France history, gateway to the high Pyrenees.',
    famousWinners: [
      { year: 2023, race: 'Tour de France', winner: 'Jonas Vingegaard' },
      { year: 2022, race: 'Tour de France', winner: 'Jonas Vingegaard' },
      { year: 2019, race: 'Tour de France', winner: 'Thibaut Pinot' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg',
    category: 'Pyrenees'
  },
  {
    id: 'stelvio-pass',
    name: 'Stelvio Pass',
    country: 'Italy',
    region: 'Alps',
    maxAltitude: 2757,
    elevationGain: 1808,
    averageGradient: 7.4,
    maxGradient: 14,
    distance: 24.3,
    difficulty: 'Extreme',
    coordinates: { lat: 46.5281, lng: 10.4520 },
    description: 'The highest paved mountain pass in the Eastern Alps with 48 hairpin turns from Prato.',
    famousWinners: [
      { year: 2020, race: 'Giro d\'Italia', winner: 'Jai Hindley' },
      { year: 2017, race: 'Giro d\'Italia', winner: 'Mikel Landa' },
      { year: 2014, race: 'Giro d\'Italia', winner: 'Fabio Aru' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg',
    category: 'Alps'
  },
  {
    id: 'passo-gavia',
    name: 'Passo di Gavia',
    country: 'Italy',
    region: 'Alps',
    maxAltitude: 2621,
    elevationGain: 1659,
    averageGradient: 8.0,
    maxGradient: 16,
    distance: 20.7,
    difficulty: 'Extreme',
    coordinates: { lat: 46.3167, lng: 10.4833 },
    description: 'Treacherous climb with unpaved sections and extreme weather, site of legendary Giro battles.',
    famousWinners: [
      { year: 2019, race: 'Giro d\'Italia', winner: 'Richard Carapaz' },
      { year: 2010, race: 'Giro d\'Italia', winner: 'Ivan Basso' },
      { year: 1988, race: 'Giro d\'Italia', winner: 'Andy Hampsten' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg',
    category: 'Alps'
  },
  {
    id: 'angliru',
    name: 'Alto del Angliru',
    country: 'Spain',
    region: 'Asturias',
    maxAltitude: 1570,
    elevationGain: 1266,
    averageGradient: 10.1,
    maxGradient: 23.5,
    distance: 12.5,
    difficulty: 'Extreme',
    coordinates: { lat: 43.2833, lng: -5.9167 },
    description: 'Brutal Spanish climb with sections reaching 23% gradient, a true test of climbing ability.',
    famousWinners: [
      { year: 2023, race: 'Vuelta a España', winner: 'Jonas Vingegaard' },
      { year: 2022, race: 'Vuelta a España', winner: 'Miguel Ángel López' },
      { year: 2021, race: 'Vuelta a España', winner: 'Primož Roglič' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1578750/pexels-photo-1578750.jpeg',
    category: 'Other'
  },
  {
    id: 'passo-pordoi',
    name: 'Passo Pordoi',
    country: 'Italy',
    region: 'Dolomites',
    maxAltitude: 2239,
    elevationGain: 1451,
    averageGradient: 6.8,
    maxGradient: 12,
    distance: 21.3,
    difficulty: 'Hard',
    coordinates: { lat: 46.4833, lng: 11.8167 },
    description: 'Gateway to the Dolomites with stunning views and relatively steady gradient.',
    famousWinners: [
      { year: 2021, race: 'Giro d\'Italia', winner: 'Egan Bernal' },
      { year: 2016, race: 'Giro d\'Italia', winner: 'Steven Kruijswijk' },
      { year: 2010, race: 'Giro d\'Italia', winner: 'Cadel Evans' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1662298/pexels-photo-1662298.jpeg',
    category: 'Dolomites'
  },
  {
    id: 'col-galibier',
    name: 'Col du Galibier',
    country: 'France',
    region: 'Alps',
    maxAltitude: 2642,
    elevationGain: 1245,
    averageGradient: 6.9,
    maxGradient: 9.5,
    distance: 18.1,
    difficulty: 'Hard',
    coordinates: { lat: 45.0667, lng: 6.4083 },
    description: 'Historic high-altitude pass connecting Maurienne and Oisans valleys.',
    famousWinners: [
      { year: 2022, race: 'Tour de France', winner: 'Jonas Vingegaard' },
      { year: 2019, race: 'Tour de France', winner: 'Egan Bernal' },
      { year: 2011, race: 'Tour de France', winner: 'Andy Schleck' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg',
    category: 'Alps'
  },
  {
    id: 'hardknott-pass',
    name: 'Hardknott Pass',
    country: 'England',
    region: 'Lake District',
    maxAltitude: 393,
    elevationGain: 264,
    averageGradient: 10.4,
    maxGradient: 30,
    distance: 2.5,
    difficulty: 'Extreme',
    coordinates: { lat: 54.4000, lng: -3.2000 },
    description: 'Steepest road in England with sections reaching 30% gradient.',
    famousWinners: [
      { year: 2021, race: 'Tour of Britain', winner: 'Wout van Aert' },
      { year: 2020, race: 'Tour of Britain', winner: 'Mathieu van der Poel' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1802268/pexels-photo-1802268.jpeg',
    category: 'Other'
  },
  {
    id: 'zoncolan',
    name: 'Monte Zoncolan',
    country: 'Italy',
    region: 'Friuli',
    maxAltitude: 1750,
    elevationGain: 1210,
    averageGradient: 11.5,
    maxGradient: 22,
    distance: 10.5,
    difficulty: 'Extreme',
    coordinates: { lat: 46.5167, lng: 12.8833 },
    description: 'One of the most feared climbs in professional cycling with brutal gradients.',
    famousWinners: [
      { year: 2022, race: 'Giro d\'Italia', winner: 'Santiago Buitrago' },
      { year: 2018, race: 'Giro d\'Italia', winner: 'Chris Froome' },
      { year: 2014, race: 'Giro d\'Italia', winner: 'Michael Rogers' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg',
    category: 'Alps'
  },
  {
    id: 'col-izoard',
    name: "Col d'Izoard",
    country: 'France',
    region: 'Alps',
    maxAltitude: 2360,
    elevationGain: 1175,
    averageGradient: 7.3,
    maxGradient: 9.5,
    distance: 16.1,
    difficulty: 'Hard',
    coordinates: { lat: 44.8203, lng: 6.7350 },
    description: 'Iconic Tour de France climb through the famous Casse Déserte moonscape.',
    famousWinners: [
      { year: 2017, race: 'Tour de France', winner: 'Warren Barguil' },
      { year: 2011, race: 'Tour de France', winner: 'Samuel Sánchez' },
      { year: 1975, race: 'Tour de France', winner: 'Lucien Van Impe' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg',
    category: 'Alps'
  },
  {
    id: 'pico-veleta',
    name: 'Pico Veleta',
    country: 'Spain',
    region: 'Sierra Nevada',
    maxAltitude: 3300,
    elevationGain: 2100,
    averageGradient: 7.6,
    maxGradient: 14,
    distance: 27.6,
    difficulty: 'Extreme',
    coordinates: { lat: 37.0500, lng: -3.3167 },
    description: 'Highest cyclable road in Europe, climbing through diverse climate zones.',
    famousWinners: [
      { year: 2022, race: 'Vuelta a España', winner: 'Richard Carapaz' },
      { year: 2015, race: 'Vuelta a España', winner: 'Chris Froome' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1578750/pexels-photo-1578750.jpeg',
    category: 'Other'
  },
  {
    id: 'mortirolo',
    name: 'Passo del Mortirolo',
    country: 'Italy',
    region: 'Lombardy',
    maxAltitude: 1852,
    elevationGain: 1300,
    averageGradient: 10.5,
    maxGradient: 18,
    distance: 12.4,
    difficulty: 'Extreme',
    coordinates: { lat: 46.2833, lng: 10.3167 },
    description: 'Merciless Italian climb with consistently steep gradients, feared by even the best climbers.',
    famousWinners: [
      { year: 2019, race: 'Giro d\'Italia', winner: 'Richard Carapaz' },
      { year: 2012, race: 'Giro d\'Italia', winner: 'Joaquim Rodríguez' },
      { year: 1994, race: 'Giro d\'Italia', winner: 'Marco Pantani' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg',
    category: 'Alps'
  },
  {
    id: 'col-aubisque',
    name: "Col d'Aubisque",
    country: 'France',
    region: 'Pyrenees',
    maxAltitude: 1709,
    elevationGain: 1190,
    averageGradient: 7.2,
    maxGradient: 13,
    distance: 16.6,
    difficulty: 'Hard',
    coordinates: { lat: 43.0667, lng: -0.3333 },
    description: 'First great Pyrenean pass used in Tour de France, with spectacular valley views.',
    famousWinners: [
      { year: 2020, race: 'Tour de France', winner: 'Primož Roglič' },
      { year: 2018, race: 'Tour de France', winner: 'Julian Alaphilippe' },
      { year: 2010, race: 'Tour de France', winner: 'Andy Schleck' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg',
    category: 'Pyrenees'
  },
  {
    id: 'plateau-beille',
    name: 'Plateau de Beille',
    country: 'France',
    region: 'Pyrenees',
    maxAltitude: 1780,
    elevationGain: 1154,
    averageGradient: 7.9,
    maxGradient: 11,
    distance: 14.6,
    difficulty: 'Hard',
    coordinates: { lat: 42.7833, lng: 1.5833 },
    description: 'Ski station finish with consistent gradient and beautiful mountain scenery.',
    famousWinners: [
      { year: 2023, race: 'Tour de France', winner: 'Tadej Pogačar' },
      { year: 2017, race: 'Tour de France', winner: 'Chris Froome' },
      { year: 2007, race: 'Tour de France', winner: 'Alberto Contador' }
    ],
    imageUrl: 'https://images.pexels.com/photos/2116721/pexels-photo-2116721.jpeg',
    category: 'Pyrenees'
  },
  {
    id: 'sella-ronda',
    name: 'Passo Sella',
    country: 'Italy',
    region: 'Dolomites',
    maxAltitude: 2244,
    elevationGain: 687,
    averageGradient: 5.8,
    maxGradient: 8.5,
    distance: 11.9,
    difficulty: 'Medium',
    coordinates: { lat: 46.5500, lng: 11.7500 },
    description: 'Gateway to the famous Sella Ronda circuit in the heart of the Dolomites.',
    famousWinners: [
      { year: 2021, race: 'Giro d\'Italia', winner: 'Damiano Caruso' },
      { year: 2017, race: 'Giro d\'Italia', winner: 'Nairo Quintana' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1662298/pexels-photo-1662298.jpeg',
    category: 'Dolomites'
  },
  {
    id: 'luz-ardiden',
    name: 'Luz Ardiden',
    country: 'France',
    region: 'Pyrenees',
    maxAltitude: 1720,
    elevationGain: 1254,
    averageGradient: 7.4,
    maxGradient: 12,
    distance: 16.9,
    difficulty: 'Hard',
    coordinates: { lat: 42.9167, lng: -0.0833 },
    description: 'Ski resort finish with beautiful views over the Pyrenean valleys.',
    famousWinners: [
      { year: 2021, race: 'Tour de France', winner: 'Tadej Pogačar' },
      { year: 2003, race: 'Tour de France', winner: 'Lance Armstrong' },
      { year: 1994, race: 'Tour de France', winner: 'Roberto Laiseka' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1802268/pexels-photo-1802268.jpeg',
    category: 'Pyrenees'
  }
];