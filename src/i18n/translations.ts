export interface Translation {
  // Header
  appTitle: string;
  passesConquered: string;
  passes: string;
  map: string;
  stats: string;
  register: string;
  admin: string;
  database: string;
  collaborators: string;
  
  // Pass Card
  altitude: string;
  elevation: string;
  distance: string;
  avgGradient: string;
  maxGradient: string;
  category: string;
  conquered: string;
  markAsDone: string;
  
  // UCI Categories
  cuarta: string;
  tercera: string;
  segunda: string;
  primera: string;
  especial: string;
  hc: 'Fuera de Categoría',
  
  // Categories
  alps: string;
  pyrenees: string;
  dolomites: string;
  andes: string;
  other: string;
  
  // Search and filters
  searchPlaceholder: string;
  filters: string;
  allDifficulties: string;
  allCategories: string;
  allCategories: string;
  allStatus: string;
  conqueredStatus: string;
  pendingStatus: string;
  noPassesFound: string;
  noPassesFoundDesc: string;
  
  // Modal
  famousWinners: string;
  
  // Map
  mapTitle: string;
  mapDescription: string;
  pending: string;
  
  // Stats
  statsTitle: string;
  statsDescription: string;
  overallProgress: string;
  passesConqueredStat: string;
  complete: string;
  elevationGained: string;
  avgDifficulty: string;
  countriesVisited: string;
  difficultyBreakdown: string;
  regionalDistribution: string;
  countriesConquered: string;
  totalPasses: string;
  
  // Countries
  france: string;
  italy: string;
  spain: string;
  england: string;
  
  // Regions
  provence: string;
  lombardy: string;
  asturias: string;
  lakeDistrict: string;
  friuli: string;
  sierraNevada: string;
  
  // Registration
  cyclistRegistration: string;
  registrationDescription: string;
  name: string;
  alias: string;
  phone: string;
  age: string;
  weight: string;
  bikes: string;
  addBike: string;
  bike: string;
  brand: string;
  model: string;
  bikeType: string;
  year: string;
  registerCyclist: string;
  registering: string;
  registrationSuccess: string;
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  namePlaceholder: string;
  aliasPlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  agePlaceholder: string;
  weightPlaceholder: string;
  brandPlaceholder: string;
  modelPlaceholder: string;
  yearPlaceholder: string;
  noBikesAdded: string;
  roadBike: string;
  mountainBike: string;
  gravelBike: string;
  electricBike: string;
  otherBike: string;
  
  // Admin
  adminPanel: string;
  manageCyclists: string;
  managePasses: string;
  registeredCyclists: string;
  totalCyclists: string;
  noCyclists: string;
  actions: string;
  editCyclist: string;
  editPass: string;
  confirmDeleteCyclist: string;
  cancel: string;
  saveChanges: string;
  imageUrl: string;
  description: string;
  country: string;
  region: string;
  adminRole: string;
  adminRoleDescription: string;
  
  // Database
  databaseTitle: string;
  databaseDescription: string;
  addToMyPasses: string;
  removeFromMyPasses: string;
  alreadyInMyPasses: string;
  availablePasses: string;
  mySelectedPasses: string;
  
  // Collaborators
  collaboratorsDescription: string;
}

export const translations: Record<string, Translation> = {
  es: {
    // Header
    appTitle: 'Puertos conquistados',
    passesConquered: 'puertos conquistados',
    passes: 'Puertos',
    map: 'Mapa',
    stats: 'Estadísticas',
    register: 'Registro',
    admin: 'Admin',
    database: 'Base de Datos',
    collaborators: 'Colaboradores',
    
    // Pass Card
    altitude: 'Altitud',
    elevation: 'Desnivel',
    distance: 'Distancia',
    avgGradient: 'Pendiente Media',
    maxGradient: 'Pendiente Máx',
    category: 'Categoría',
    conquered: '¡Conquistado!',
    markAsDone: 'Conquistado',
    
    // UCI Categories
    cuarta: '4ª Categoría',
    tercera: '3ª Categoría',
    segunda: '2ª Categoría',
    primera: '1ª Categoría',
    especial: 'Categoría Especial',
    // Categories
    alps: 'Alpes',
    pyrenees: 'Pirineos',
    dolomites: 'Dolomitas',
    andes: 'Andes',
    other: 'Otros',
    
    // Search and filters
    searchPlaceholder: 'Buscar puertos por nombre, país o región...',
    filters: 'Filtros:',
    allDifficulties: 'Todas las Categorías',
    allCategories: 'Todas las Categorías',
    allStatus: 'Todos los Estados',
    conqueredStatus: 'Conquistados',
    pendingStatus: 'Pendientes',
    noPassesFound: 'No se encontraron puertos',
    noPassesFoundDesc: 'Intenta ajustar tu búsqueda o filtros',
    
    // Modal
    famousWinners: 'Ganadores Famosos',
    
    // Map
    mapTitle: 'Mapa de Puertos de Montaña',
    mapDescription: 'Mapa interactivo mostrando tu progreso de conquista en las subidas más famosas del mundo.',
    pending: 'Pendientes',
    
    // Stats
    statsTitle: 'Tus Estadísticas de Conquista',
    statsDescription: 'Sigue tu progreso mientras conquistas las subidas más grandes del mundo.',
    overallProgress: 'Progreso General',
    passesConqueredStat: 'Puertos Conquistados',
    complete: 'Completado',
    elevationGained: 'Desnivel Ganado (m)',
    avgDifficulty: 'Dificultad Media',
    countriesVisited: 'Países Visitados',
    difficultyBreakdown: 'Desglose por Dificultad',
    regionalDistribution: 'Distribución Regional',
    countriesConquered: 'Países Conquistados',
    totalPasses: 'Total de Puertos',
    
    // Countries
    france: 'Francia',
    italy: 'Italia',
    spain: 'España',
    england: 'Inglaterra',
    
    // Regions
    provence: 'Provenza',
    lombardy: 'Lombardía',
    asturias: 'Asturias',
    lakeDistrict: 'Distrito de los Lagos',
    friuli: 'Friuli',
    sierraNevada: 'Sierra Nevada',
    
    // Registration
    cyclistRegistration: 'Registro de Ciclista',
    registrationDescription: 'Completa tus datos para unirte a la comunidad de conquistadores de puertos',
    name: 'Nombre',
    alias: 'Alias',
    phone: 'Teléfono',
    age: 'Edad',
    weight: 'Peso (kg)',
    bikes: 'Bicicletas',
    addBike: 'Añadir Bicicleta',
    bike: 'Bicicleta',
    brand: 'Marca',
    model: 'Modelo',
    bikeType: 'Tipo',
    year: 'Año',
    registerCyclist: 'Registrar Ciclista',
    registering: 'Registrando...',
    registrationSuccess: '¡Ciclista registrado con éxito!',
    nameRequired: 'El nombre es obligatorio',
    emailRequired: 'El email es obligatorio',
    emailInvalid: 'Email no válido',
    phoneRequired: 'El teléfono es obligatorio',
    namePlaceholder: 'Introduce tu nombre completo',
    aliasPlaceholder: 'Apodo o nombre deportivo',
    emailPlaceholder: 'tu@email.com',
    phonePlaceholder: '+34 123 456 789',
    agePlaceholder: 'Edad en años',
    weightPlaceholder: 'Peso en kg',
    brandPlaceholder: 'Ej: Trek, Specialized...',
    modelPlaceholder: 'Ej: Domane, Tarmac...',
    yearPlaceholder: 'Año de fabricación',
    noBikesAdded: 'No has añadido ninguna bicicleta todavía',
    roadBike: 'Carretera',
    mountainBike: 'Montaña',
    gravelBike: 'Gravel',
    electricBike: 'Eléctrica',
    otherBike: 'Otra',
    
    // Admin
    adminPanel: 'Panel de Administración',
    manageCyclists: 'Gestionar Ciclistas',
    managePasses: 'Gestionar Puertos',
    registeredCyclists: 'Ciclistas Registrados',
    totalCyclists: 'ciclistas totales',
    noCyclists: 'No hay ciclistas registrados',
    actions: 'Acciones',
    editCyclist: 'Editar Ciclista',
    editPass: 'Editar Puerto',
    confirmDeleteCyclist: '¿Estás seguro de que quieres eliminar este ciclista?',
    cancel: 'Cancelar',
    saveChanges: 'Guardar Cambios',
    imageUrl: 'URL de Imagen',
    description: 'Descripción',
    country: 'País',
    region: 'Región',
    adminRole: 'Rol de Administrador',
    adminRoleDescription: 'Marcar para obtener acceso al panel de administración',
    
    // Database
    databaseTitle: 'Base de Datos de Puertos',
    databaseDescription: 'Explora todos los puertos disponibles y añádelos a tu colección personal',
    addToMyPasses: 'Añadir a Mis Puertos',
    removeFromMyPasses: 'Quitar de Mis Puertos',
    alreadyInMyPasses: 'Ya en Mis Puertos',
    availablePasses: 'Puertos Disponibles',
    mySelectedPasses: 'Mis Puertos Seleccionados',
    
    // Collaborators
    collaboratorsDescription: 'Descubre nuestros colaboradores y patrocinadores que apoyan la comunidad ciclista'
  },
  
  en: {
    // Header
    appTitle: 'Mountain Pass Conquest',
    passesConquered: 'passes conquered',
    passes: 'Passes',
    map: 'Map',
    stats: 'Stats',
    register: 'Register',
    admin: 'Admin',
    database: 'Database',
    
    // Pass Card
    altitude: 'Altitude',
    elevation: 'Elevation',
    distance: 'Distance',
    avgGradient: 'Avg Gradient',
    maxGradient: 'Max Gradient',
    category: 'Category',
    conquered: 'Conquered!',
    markAsDone: 'Conquer',
    
    // UCI Categories
    cuarta: '4th Category',
    tercera: '3rd Category',
    segunda: '2nd Category',
    primera: '1st Category',
    especial: 'Special Category',
    
    // Categories
    alps: 'Alps',
    pyrenees: 'Pyrenees',
    dolomites: 'Dolomites',
    andes: 'Andes',
    other: 'Other',
    
    // Search and filters
    searchPlaceholder: 'Search passes by name, country, or region...',
    filters: 'Filters:',
    allDifficulties: 'All Categories',
    allCategories: 'All Categories',
    allStatus: 'All Status',
    conqueredStatus: 'Conquered',
    pendingStatus: 'Pending',
    noPassesFound: 'No passes found',
    noPassesFoundDesc: 'Try adjusting your search or filters',
    
    // Modal
    famousWinners: 'Famous Winners',
    
    // Map
    mapTitle: 'Mountain Pass Map',
    mapDescription: 'Interactive map showing your conquest progress across the world\'s most famous climbs.',
    pending: 'Pending',
    
    // Stats
    statsTitle: 'Your Conquest Statistics',
    statsDescription: 'Track your progress as you conquer the world\'s greatest climbs.',
    overallProgress: 'Overall Progress',
    passesConqueredStat: 'Passes Conquered',
    complete: 'Complete',
    elevationGained: 'Elevation Gained (m)',
    avgDifficulty: 'Avg Difficulty',
    countriesVisited: 'Countries Visited',
    difficultyBreakdown: 'Difficulty Breakdown',
    regionalDistribution: 'Regional Distribution',
    countriesConquered: 'Countries Conquered',
    totalPasses: 'Total Passes',
    
    // Countries
    france: 'France',
    italy: 'Italy',
    spain: 'Spain',
    england: 'England',
    
    // Regions
    provence: 'Provence',
    lombardy: 'Lombardy',
    asturias: 'Asturias',
    lakeDistrict: 'Lake District',
    friuli: 'Friuli',
    sierraNevada: 'Sierra Nevada',
    
    // Registration
    cyclistRegistration: 'Cyclist Registration',
    registrationDescription: 'Complete your details to join the mountain pass conquerors community',
    name: 'Name',
    alias: 'Alias',
    phone: 'Phone',
    age: 'Age',
    weight: 'Weight (kg)',
    bikes: 'Bikes',
    addBike: 'Add Bike',
    bike: 'Bike',
    brand: 'Brand',
    model: 'Model',
    bikeType: 'Type',
    year: 'Year',
    registerCyclist: 'Register Cyclist',
    registering: 'Registering...',
    registrationSuccess: 'Cyclist registered successfully!',
    nameRequired: 'Name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email',
    phoneRequired: 'Phone is required',
    namePlaceholder: 'Enter your full name',
    aliasPlaceholder: 'Nickname or sports name',
    emailPlaceholder: 'your@email.com',
    phonePlaceholder: '+44 123 456 789',
    agePlaceholder: 'Age in years',
    weightPlaceholder: 'Weight in kg',
    brandPlaceholder: 'e.g. Trek, Specialized...',
    modelPlaceholder: 'e.g. Domane, Tarmac...',
    yearPlaceholder: 'Manufacturing year',
    noBikesAdded: 'No bikes added yet',
    roadBike: 'Road',
    mountainBike: 'Mountain',
    gravelBike: 'Gravel',
    electricBike: 'Electric',
    otherBike: 'Other',
    
    // Admin
    adminPanel: 'Administration Panel',
    manageCyclists: 'Manage Cyclists',
    managePasses: 'Manage Passes',
    registeredCyclists: 'Registered Cyclists',
    totalCyclists: 'total cyclists',
    noCyclists: 'No cyclists registered',
    actions: 'Actions',
    editCyclist: 'Edit Cyclist',
    editPass: 'Edit Pass',
    confirmDeleteCyclist: 'Are you sure you want to delete this cyclist?',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    imageUrl: 'Image URL',
    description: 'Description',
    country: 'Country',
    region: 'Region',
    adminRole: 'Administrator Role',
    adminRoleDescription: 'Check to gain access to the administration panel',
    
    // Database
    databaseTitle: 'Mountain Pass Database',
    databaseDescription: 'Explore all available passes and add them to your personal collection',
    addToMyPasses: 'Add to My Passes',
    removeFromMyPasses: 'Remove from My Passes',
    alreadyInMyPasses: 'Already in My Passes',
    availablePasses: 'Available Passes',
    mySelectedPasses: 'My Selected Passes'
  },
  
  fr: {
    // Header
    appTitle: 'Conquête des Cols de Montagne',
    passesConquered: 'cols conquis',
    passes: 'Cols',
    map: 'Carte',
    stats: 'Statistiques',
    register: 'Inscription',
    admin: 'Admin',
    database: 'Base de Données',
    
    // Pass Card
    altitude: 'Altitude',
    elevation: 'Dénivelé',
    distance: 'Distance',
    avgGradient: 'Pente Moyenne',
    maxGradient: 'Pente Max',
    category: 'Catégorie',
    conquered: 'Conquis !',
    markAsDone: 'Conquérir',
    
    // UCI Categories
    cuarta: '4ème Catégorie',
    tercera: '3ème Catégorie',
    segunda: '2ème Catégorie',
    primera: '1ère Catégorie',
    especial: 'Catégorie Spéciale',
    
    // Categories
    alps: 'Alpes',
    pyrenees: 'Pyrénées',
    dolomites: 'Dolomites',
    andes: 'Andes',
    other: 'Autres',
    
    // Search and filters
    searchPlaceholder: 'Rechercher des cols par nom, pays ou région...',
    filters: 'Filtres :',
    allDifficulties: 'Toutes les Catégories',
    allCategories: 'Toutes les Catégories',
    allStatus: 'Tous les Statuts',
    conqueredStatus: 'Conquis',
    pendingStatus: 'En Attente',
    noPassesFound: 'Aucun col trouvé',
    noPassesFoundDesc: 'Essayez d\'ajuster votre recherche ou vos filtres',
    
    // Modal
    famousWinners: 'Vainqueurs Célèbres',
    
    // Map
    mapTitle: 'Carte des Cols de Montagne',
    mapDescription: 'Carte interactive montrant votre progression de conquête sur les montées les plus célèbres du monde.',
    pending: 'En Attente',
    
    // Stats
    statsTitle: 'Vos Statistiques de Conquête',
    statsDescription: 'Suivez votre progression en conquérant les plus grandes montées du monde.',
    overallProgress: 'Progression Générale',
    passesConqueredStat: 'Cols Conquis',
    complete: 'Terminé',
    elevationGained: 'Dénivelé Gagné (m)',
    avgDifficulty: 'Difficulté Moyenne',
    countriesVisited: 'Pays Visités',
    difficultyBreakdown: 'Répartition par Difficulté',
    regionalDistribution: 'Distribution Régionale',
    countriesConquered: 'Pays Conquis',
    totalPasses: 'Total des Cols',
    
    // Countries
    france: 'France',
    italy: 'Italie',
    spain: 'Espagne',
    england: 'Angleterre',
    
    // Regions
    provence: 'Provence',
    lombardy: 'Lombardie',
    asturias: 'Asturies',
    lakeDistrict: 'Lake District',
    friuli: 'Frioul',
    sierraNevada: 'Sierra Nevada',
    
    // Registration
    cyclistRegistration: 'Inscription Cycliste',
    registrationDescription: 'Complétez vos informations pour rejoindre la communauté des conquérants de cols',
    name: 'Nom',
    alias: 'Pseudonyme',
    phone: 'Téléphone',
    age: 'Âge',
    weight: 'Poids (kg)',
    bikes: 'Vélos',
    addBike: 'Ajouter un Vélo',
    bike: 'Vélo',
    brand: 'Marque',
    model: 'Modèle',
    bikeType: 'Type',
    year: 'Année',
    registerCyclist: 'Inscrire Cycliste',
    registering: 'Inscription...',
    registrationSuccess: 'Cycliste inscrit avec succès !',
    nameRequired: 'Le nom est obligatoire',
    emailRequired: 'L\'email est obligatoire',
    emailInvalid: 'Email invalide',
    phoneRequired: 'Le téléphone est obligatoire',
    namePlaceholder: 'Entrez votre nom complet',
    aliasPlaceholder: 'Surnom ou nom sportif',
    emailPlaceholder: 'votre@email.com',
    phonePlaceholder: '+33 1 23 45 67 89',
    agePlaceholder: 'Âge en années',
    weightPlaceholder: 'Poids en kg',
    brandPlaceholder: 'ex: Trek, Specialized...',
    modelPlaceholder: 'ex: Domane, Tarmac...',
    yearPlaceholder: 'Année de fabrication',
    noBikesAdded: 'Aucun vélo ajouté pour le moment',
    roadBike: 'Route',
    mountainBike: 'VTT',
    gravelBike: 'Gravel',
    electricBike: 'Électrique',
    otherBike: 'Autre',
    
    // Admin
    adminPanel: 'Panneau d\'Administration',
    manageCyclists: 'Gérer les Cyclistes',
    managePasses: 'Gérer les Cols',
    registeredCyclists: 'Cyclistes Inscrits',
    totalCyclists: 'cyclistes au total',
    noCyclists: 'Aucun cycliste inscrit',
    actions: 'Actions',
    editCyclist: 'Modifier Cycliste',
    editPass: 'Modifier Col',
    confirmDeleteCyclist: 'Êtes-vous sûr de vouloir supprimer ce cycliste ?',
    cancel: 'Annuler',
    saveChanges: 'Sauvegarder',
    imageUrl: 'URL de l\'Image',
    description: 'Description',
    country: 'Pays',
    region: 'Région',
    adminRole: 'Rôle Administrateur',
    adminRoleDescription: 'Cocher pour accéder au panneau d\'administration',
    
    // Database
    databaseTitle: 'Base de Données des Cols',
    databaseDescription: 'Explorez tous les cols disponibles et ajoutez-les à votre collection personnelle',
    addToMyPasses: 'Ajouter à Mes Cols',
    removeFromMyPasses: 'Retirer de Mes Cols',
    alreadyInMyPasses: 'Déjà dans Mes Cols',
    availablePasses: 'Cols Disponibles',
    mySelectedPasses: 'Mes Cols Sélectionnés',
    
    // Collaborators
    collaboratorsDescription: 'Découvrez nos collaborateurs et sponsors qui soutiennent la communauté cycliste'
  },
  
  it: {
    // Header
    appTitle: 'Conquista dei Passi di Montagna',
    passesConquered: 'passi conquistati',
    passes: 'Passi',
    map: 'Mappa',
    stats: 'Statistiche',
    register: 'Registrazione',
    admin: 'Admin',
    database: 'Database',
    
    // Pass Card
    altitude: 'Altitudine',
    elevation: 'Dislivello',
    distance: 'Distanza',
    avgGradient: 'Pendenza Media',
    maxGradient: 'Pendenza Max',
    category: 'Categoria',
    conquered: 'Conquistato!',
    markAsDone: 'Conquistare',
    
    // UCI Categories
    cuarta: '4ª Categoria',
    tercera: '3ª Categoria',
    segunda: '2ª Categoria',
    primera: '1ª Categoria',
    especial: 'Categoria Speciale',
    
    // Categories
    alps: 'Alpi',
    pyrenees: 'Pirenei',
    dolomites: 'Dolomiti',
    andes: 'Ande',
    other: 'Altri',
    
    // Search and filters
    searchPlaceholder: 'Cerca passi per nome, paese o regione...',
    filters: 'Filtri:',
    allDifficulties: 'Tutte le Categorie',
    allCategories: 'Tutte le Categorie',
    allStatus: 'Tutti gli Stati',
    conqueredStatus: 'Conquistati',
    pendingStatus: 'In Sospeso',
    noPassesFound: 'Nessun passo trovato',
    noPassesFoundDesc: 'Prova ad aggiustare la tua ricerca o i filtri',
    
    // Modal
    famousWinners: 'Vincitori Famosi',
    
    // Map
    mapTitle: 'Mappa dei Passi di Montagna',
    mapDescription: 'Mappa interattiva che mostra il tuo progresso di conquista sulle salite più famose del mondo.',
    pending: 'In Sospeso',
    
    // Stats
    statsTitle: 'Le Tue Statistiche di Conquista',
    statsDescription: 'Traccia il tuo progresso mentre conquisti le salite più grandi del mondo.',
    overallProgress: 'Progresso Generale',
    passesConqueredStat: 'Passi Conquistati',
    complete: 'Completato',
    elevationGained: 'Dislivello Guadagnato (m)',
    avgDifficulty: 'Difficoltà Media',
    countriesVisited: 'Paesi Visitati',
    difficultyBreakdown: 'Suddivisione per Difficoltà',
    regionalDistribution: 'Distribuzione Regionale',
    countriesConquered: 'Paesi Conquistati',
    totalPasses: 'Passi Totali',
    
    // Countries
    france: 'Francia',
    italy: 'Italia',
    spain: 'Spagna',
    england: 'Inghilterra',
    
    // Regions
    provence: 'Provenza',
    lombardy: 'Lombardia',
    asturias: 'Asturie',
    lakeDistrict: 'Lake District',
    friuli: 'Friuli',
    sierraNevada: 'Sierra Nevada',
    
    // Registration
    cyclistRegistration: 'Registrazione Ciclista',
    registrationDescription: 'Completa i tuoi dati per unirti alla comunità dei conquistatori di passi',
    name: 'Nome',
    alias: 'Soprannome',
    phone: 'Telefono',
    age: 'Età',
    weight: 'Peso (kg)',
    bikes: 'Biciclette',
    addBike: 'Aggiungi Bicicletta',
    bike: 'Bicicletta',
    brand: 'Marca',
    model: 'Modello',
    bikeType: 'Tipo',
    year: 'Anno',
    registerCyclist: 'Registra Ciclista',
    registering: 'Registrando...',
    registrationSuccess: 'Ciclista registrato con successo!',
    nameRequired: 'Il nome è obbligatorio',
    emailRequired: 'L\'email è obbligatoria',
    emailInvalid: 'Email non valida',
    phoneRequired: 'Il telefono è obbligatorio',
    namePlaceholder: 'Inserisci il tuo nome completo',
    aliasPlaceholder: 'Soprannome o nome sportivo',
    emailPlaceholder: 'tua@email.com',
    phonePlaceholder: '+39 123 456 789',
    agePlaceholder: 'Età in anni',
    weightPlaceholder: 'Peso in kg',
    brandPlaceholder: 'es: Trek, Specialized...',
    modelPlaceholder: 'es: Domane, Tarmac...',
    yearPlaceholder: 'Anno di produzione',
    noBikesAdded: 'Nessuna bicicletta aggiunta ancora',
    roadBike: 'Strada',
    mountainBike: 'Mountain',
    gravelBike: 'Gravel',
    electricBike: 'Elettrica',
    otherBike: 'Altra',
    
    // Admin
    adminPanel: 'Pannello di Amministrazione',
    manageCyclists: 'Gestisci Ciclisti',
    managePasses: 'Gestisci Passi',
    registeredCyclists: 'Ciclisti Registrati',
    totalCyclists: 'ciclisti totali',
    noCyclists: 'Nessun ciclista registrato',
    actions: 'Azioni',
    editCyclist: 'Modifica Ciclista',
    editPass: 'Modifica Passo',
    confirmDeleteCyclist: 'Sei sicuro di voler eliminare questo ciclista?',
    cancel: 'Annulla',
    saveChanges: 'Salva Modifiche',
    imageUrl: 'URL Immagine',
    description: 'Descrizione',
    country: 'Paese',
    region: 'Regione',
    adminRole: 'Ruolo Amministratore',
    adminRoleDescription: 'Spunta per accedere al pannello di amministrazione',
    
    // Database
    databaseTitle: 'Database dei Passi',
    databaseDescription: 'Esplora tutti i passi disponibili e aggiungili alla tua collezione personale',
    addToMyPasses: 'Aggiungi ai Miei Passi',
    removeFromMyPasses: 'Rimuovi dai Miei Passi',
    alreadyInMyPasses: 'Già nei Miei Passi',
    availablePasses: 'Passi Disponibili',
    mySelectedPasses: 'I Miei Passi Selezionati'
  },
  
  ca: {
    // Header
    appTitle: 'Conquesta de Ports de Muntanya',
    passesConquered: 'ports conquistats',
    passes: 'Ports',
    map: 'Mapa',
    stats: 'Estadístiques',
    register: 'Registre',
    admin: 'Admin',
    database: 'Base de Dades',
    
    // Pass Card
    altitude: 'Altitud',
    elevation: 'Desnivell',
    distance: 'Distància',
    avgGradient: 'Pendent Mitjà',
    maxGradient: 'Pendent Màx',
    category: 'Categoria',
    conquered: 'Conquistat!',
    markAsDone: 'Conquistar',
    
    // UCI Categories
    cuarta: '4a Categoria',
    tercera: '3a Categoria',
    segunda: '2a Categoria',
    primera: '1a Categoria',
    especial: 'Categoria Especial',
    
    // Categories
    alps: 'Alps',
    pyrenees: 'Pirineus',
    dolomites: 'Dolomites',
    andes: 'Andes',
    other: 'Altres',
    
    // Search and filters
    searchPlaceholder: 'Cercar ports per nom, país o regió...',
    filters: 'Filtres:',
    allDifficulties: 'Totes les Categories',
    allCategories: 'Totes les Categories',
    allStatus: 'Tots els Estats',
    conqueredStatus: 'Conquistats',
    pendingStatus: 'Pendents',
    noPassesFound: 'No s\'han trobat ports',
    noPassesFoundDesc: 'Prova d\'ajustar la teva cerca o filtres',
    
    // Modal
    famousWinners: 'Guanyadors Famosos',
    
    // Map
    mapTitle: 'Mapa de Ports de Muntanya',
    mapDescription: 'Mapa interactiu mostrant el teu progrés de conquesta en les pujades més famoses del món.',
    pending: 'Pendents',
    
    // Stats
    statsTitle: 'Les Teves Estadístiques de Conquesta',
    statsDescription: 'Segueix el teu progrés mentre conquestes les pujades més grans del món.',
    overallProgress: 'Progrés General',
    passesConqueredStat: 'Ports Conquistats',
    complete: 'Completat',
    elevationGained: 'Desnivell Guanyat (m)',
    avgDifficulty: 'Dificultat Mitjana',
    countriesVisited: 'Països Visitats',
    difficultyBreakdown: 'Desglossament per Dificultat',
    regionalDistribution: 'Distribució Regional',
    countriesConquered: 'Països Conquistats',
    totalPasses: 'Ports Totals',
    
    // Countries
    france: 'França',
    italy: 'Itàlia',
    spain: 'Espanya',
    england: 'Anglaterra',
    
    // Regions
    provence: 'Provença',
    lombardy: 'Llombardia',
    asturias: 'Astúries',
    lakeDistrict: 'Lake District',
    friuli: 'Friül',
    sierraNevada: 'Sierra Nevada',
    
    // Registration
    cyclistRegistration: 'Registre de Ciclista',
    registrationDescription: 'Completa les teves dades per unir-te a la comunitat de conquistadors de ports',
    name: 'Nom',
    alias: 'Àlies',
    phone: 'Telèfon',
    age: 'Edat',
    weight: 'Pes (kg)',
    bikes: 'Bicicletes',
    addBike: 'Afegir Bicicleta',
    bike: 'Bicicleta',
    brand: 'Marca',
    model: 'Model',
    bikeType: 'Tipus',
    year: 'Any',
    registerCyclist: 'Registrar Ciclista',
    registering: 'Registrant...',
    registrationSuccess: 'Ciclista registrat amb èxit!',
    nameRequired: 'El nom és obligatori',
    emailRequired: 'L\'email és obligatori',
    emailInvalid: 'Email no vàlid',
    phoneRequired: 'El telèfon és obligatori',
    namePlaceholder: 'Introdueix el teu nom complet',
    aliasPlaceholder: 'Malnom o nom esportiu',
    emailPlaceholder: 'el-teu@email.com',
    phonePlaceholder: '+34 123 456 789',
    agePlaceholder: 'Edat en anys',
    weightPlaceholder: 'Pes en kg',
    brandPlaceholder: 'Ex: Trek, Specialized...',
    modelPlaceholder: 'Ex: Domane, Tarmac...',
    yearPlaceholder: 'Any de fabricació',
    noBikesAdded: 'No has afegit cap bicicleta encara',
    roadBike: 'Carretera',
    mountainBike: 'Muntanya',
    gravelBike: 'Gravel',
    electricBike: 'Elèctrica',
    otherBike: 'Altra',
    
    // Admin
    adminPanel: 'Panell d\'Administració',
    manageCyclists: 'Gestionar Ciclistes',
    managePasses: 'Gestionar Ports',
    registeredCyclists: 'Ciclistes Registrats',
    totalCyclists: 'ciclistes totals',
    noCyclists: 'No hi ha ciclistes registrats',
    actions: 'Accions',
    editCyclist: 'Editar Ciclista',
    editPass: 'Editar Port',
    confirmDeleteCyclist: 'Estàs segur que vols eliminar aquest ciclista?',
    cancel: 'Cancel·lar',
    saveChanges: 'Guardar Canvis',
    imageUrl: 'URL d\'Imatge',
    description: 'Descripció',
    country: 'País',
    region: 'Regió',
    adminRole: 'Rol d\'Administrador',
    adminRoleDescription: 'Marca per accedir al panell d\'administració',
    
    // Database
    databaseTitle: 'Base de Dades de Ports',
    databaseDescription: 'Explora tots els ports disponibles i afegeix-los a la teva col·lecció personal',
    addToMyPasses: 'Afegir als Meus Ports',
    removeFromMyPasses: 'Treure dels Meus Ports',
    alreadyInMyPasses: 'Ja als Meus Ports',
    availablePasses: 'Ports Disponibles',
    mySelectedPasses: 'Els Meus Ports Seleccionats'
  }
};

export const getTranslation = (language: string): Translation => {
  return translations[language] || translations.es;
};