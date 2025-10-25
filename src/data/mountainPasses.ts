import { MountainPass } from '../types';

export const mountainPasses: MountainPass[] = [
  {
    id: 'alpe-dhuez',
    name: "Alpe d'Huez",
    country: 'France',
    region: 'Alpes',
    maxAltitude: 1850,
    elevationGain: 1071,
    averageGradient: 8.1,
    maxGradient: 13,
    distance: 13.2,
    difficulty: 'Especial',
    coordinates: { lat: 45.0914, lng: 6.0669 },
    description: 'Subida legendaria con 21 curvas de herradura, conocida como la Montaña Holandesa por su popularidad entre los aficionados neerlandeses.',
    famousWinners: [
      { year: 2023, race: 'Tour de France', winner: 'Felix Gall' },
      { year: 2022, race: 'Tour de France', winner: 'Tom Pidcock' },
      { year: 2021, race: 'Tour de France', winner: 'Tadej Pogačar' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg',
    category: 'Alpes'
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
    difficulty: 'Especial',
    coordinates: { lat: 44.1734, lng: 5.2785 },
    description: 'El Gigante de la Provenza, una cumbre árida como un paisaje lunar que ha roto muchos sueños del Tour de Francia.',
    famousWinners: [
      { year: 2021, race: 'Tour de France', winner: 'Wout van Aert' },
      { year: 2016, race: 'Tour de France', winner: 'Chris Froome' },
      { year: 2009, race: 'Tour de France', winner: 'Juan Manuel Gárate' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg',
    category: 'Provenza'
  },
  {
    id: 'col-du-tourmalet',
    name: 'Col du Tourmalet',
    country: 'France',
    region: 'Pirineos',
    maxAltitude: 2115,
    elevationGain: 1268,
    averageGradient: 7.4,
    maxGradient: 10.2,
    distance: 17.1,
    difficulty: 'Primera',
    coordinates: { lat: 42.9067, lng: 0.1444 },
    description: 'El gigante de los Pirineos, uno de los puertos más emblemáticos del Tour de Francia con vistas espectaculares.',
    famousWinners: [
      { year: 2023, race: 'Tour de France', winner: 'Tadej Pogačar' },
      { year: 2022, race: 'Tour de France', winner: 'Jonas Vingegaard' },
      { year: 2021, race: 'Tour de France', winner: 'Wout van Aert' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg',
    category: 'Pirineos'
  },
  {
    id: 'stelvio-pass',
    name: 'Passo dello Stelvio',
    country: 'Italy',
    region: 'Lombardy',
    maxAltitude: 2757,
    elevationGain: 1808,
    averageGradient: 7.4,
    maxGradient: 12.8,
    distance: 24.3,
    difficulty: 'Especial',
    coordinates: { lat: 46.5281, lng: 10.4520 },
    description: 'El segundo puerto asfaltado más alto de Europa, famoso por sus 48 curvas de herradura y vistas espectaculares de los Alpes.',
    famousWinners: [
      { year: 2020, race: 'Giro d\'Italia', winner: 'Jai Hindley' },
      { year: 2017, race: 'Giro d\'Italia', winner: 'Mikel Landa' },
      { year: 2014, race: 'Giro d\'Italia', winner: 'Nairo Quintana' }
    ],
    imageUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
    category: 'Dolomitas'
  },
  {
    id: 'angliru',
    name: 'Alto del Angliru',
    country: 'Spain',
    region: 'Asturias',
    maxAltitude: 1573,
    elevationGain: 1266,
    averageGradient: 10.1,
    maxGradient: 23.6,
    distance: 12.5,
    difficulty: 'Especial',
    coordinates: { lat: 43.2167, lng: -5.9167 },
    description: 'Una de las subidas más duras del mundo con rampas que superan el 20% de pendiente. Conocido como el muro asturiano.',
    famousWinners: [
      { year: 2022, race: 'Vuelta a España', winner: 'Miguel Ángel López' },
      { year: 2019, race: 'Vuelta a España', winner: 'Primož Roglič' },
      { year: 2017, race: 'Vuelta a España', winner: 'Alberto Contador' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg',
    category: 'Otros'
  },
  {
    id: 'hardknott-pass',
    name: 'Hardknott Pass',
    country: 'England',
    region: 'Lake District',
    maxAltitude: 393,
    elevationGain: 335,
    averageGradient: 10.2,
    maxGradient: 30,
    distance: 3.3,
    difficulty: 'Primera',
    coordinates: { lat: 54.4000, lng: -3.2000 },
    description: 'Una de las carreteras más empinadas de Inglaterra con pendientes extremas y curvas cerradas en el corazón del Lake District.',
    famousWinners: [
      { year: 2021, race: 'Tour of Britain', winner: 'Wout van Aert' },
      { year: 2019, race: 'Tour of Britain', winner: 'Mathieu van der Poel' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg',
    category: 'Otros'
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
    difficulty: 'Especial',
    coordinates: { lat: 46.2833, lng: 10.3167 },
    description: 'Conocido como uno de los puertos más duros de Italia, con pendientes sostenidas superiores al 10% y rampas que alcanzan el 18%.',
    famousWinners: [
      { year: 2019, race: 'Giro d\'Italia', winner: 'Richard Carapaz' },
      { year: 2016, race: 'Giro d\'Italia', winner: 'Vincenzo Nibali' },
      { year: 1994, race: 'Giro d\'Italia', winner: 'Marco Pantani' }
    ],
    imageUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
    category: 'Dolomitas'
  },
  {
    id: 'zoncolan',
    name: 'Monte Zoncolan',
    country: 'Italy',
    region: 'Friuli',
    maxAltitude: 1750,
    elevationGain: 1210,
    averageGradient: 11.9,
    maxGradient: 22,
    distance: 10.1,
    difficulty: 'Especial',
    coordinates: { lat: 46.5167, lng: 12.9833 },
    description: 'Apodado el Kaiser por su dureza extrema, con pendientes medias superiores al 11% y rampas que superan el 20%.',
    famousWinners: [
      { year: 2021, race: 'Giro d\'Italia', winner: 'Lorenzo Fortunato' },
      { year: 2018, race: 'Giro d\'Italia', winner: 'Chris Froome' },
      { year: 2014, race: 'Giro d\'Italia', winner: 'Michael Rogers' }
    ],
    imageUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
    category: 'Dolomitas'
  },
  {
    id: 'veleta',
    name: 'Pico Veleta',
    country: 'Spain',
    region: 'Sierra Nevada',
    maxAltitude: 3398,
    elevationGain: 2200,
    averageGradient: 6.8,
    maxGradient: 14,
    distance: 32.4,
    difficulty: 'Especial',
    coordinates: { lat: 37.0583, lng: -3.3667 },
    description: 'La carretera asfaltada más alta de Europa, que asciende hasta los 3.398 metros en Sierra Nevada con vistas impresionantes.',
    famousWinners: [
      { year: 2022, race: 'Vuelta a España', winner: 'Richard Carapaz' },
      { year: 2015, race: 'Vuelta a España', winner: 'Mikel Landa' }
    ],
    imageUrl: 'https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg',
    category: 'Otros'
  }
]