import {
  locationGeography,
  pointGeography,
  buildingGeography,
} from "./geography";
export const campusSource =
  "https://www.fh-dortmund.de/standorte/campus-emil-figge-strasse.php?loc=en-US";
export const locations = [
  {
    id: "44",
    name: "Business & Social Sciences",
    short: "Building 44",
    category: "Academic",
    icon: "building",
    address: "Emil-Figge-Straße 44",
    description:
      "Home to Business Studies and Applied Social Sciences. Find lecture halls, seminar rooms, and spaces to connect with your fellow students.",
    tags: ["Lecture halls", "Seminar rooms"],
    detail:
      "Check your course timetable for the room and floor before your visit.",
    source: campusSource,
  },
  {
    id: "42",
    name: "Computer Science",
    short: "Building 42",
    category: "Academic",
    icon: "code",
    address: "Emil-Figge-Straße 42",
    description:
      "The Faculty of Computer Science brings together teaching, practical projects, and research. Your starting point for computing lectures and faculty support.",
    tags: ["Computer labs", "Faculty offices"],
    detail:
      "Room numbers and access to labs depend on your course. Refer to your course information.",
    source: campusSource,
  },
  {
    id: "40",
    name: "Architecture",
    short: "Building 40",
    category: "Academic",
    icon: "architecture",
    address: "Emil-Figge-Straße 40",
    description:
      "Discover the Faculty of Architecture, with teaching spaces for design, construction, and the built environment.",
    tags: ["Design studios", "Teaching spaces"],
    detail: "Contact the faculty for studio and workshop access.",
    source: campusSource,
  },
  {
    id: "mensa",
    name: "Mensa kostBar",
    short: "Your campus lunch spot",
    category: "Food & drink",
    icon: "food",
    address: "Emil-Figge-Straße 40a",
    description:
      "Take a break, share a meal, and meet someone new. The campus canteen serves students between the main academic buildings.",
    tags: ["Campus dining", "Student prices"],
    detail:
      "Menus, dietary information, prices, and opening hours are published by Studierendenwerk Dortmund.",
    source:
      "https://www.stwdo.de/mensa-cafes-und-catering/fh-dortmund/mensa-kostbar",
  },
  {
    id: "asta",
    name: "AStA · Student Union",
    short: "Students supporting students",
    category: "Student services",
    icon: "users",
    address: "Emil-Figge-Straße 38b",
    description:
      "Your student representatives and a place to ask about student life. AStA helps you find your community and represents student interests.",
    tags: ["Student representation", "Campus life"],
    detail:
      "Find the AStA offices in rooms 008, 009, and 010. Contact the team to confirm availability.",
    source: "https://www.fh-dortmund.de/asta/emil-figge-strasse.php?loc=de",
  },
  {
    id: "support",
    name: "Psychological counseling",
    short: "A little support goes a long way",
    category: "Wellbeing",
    icon: "heart",
    address: "Emil-Figge-Straße 38 · outreach",
    description:
      "Support for the challenges of studying and everyday life. Reach out to the university’s counseling team to discuss available support and arrange an appointment.",
    tags: ["Personal support", "By appointment"],
    detail:
      "An outreach service at EFS 38 was announced in 2024. Confirm the current schedule, room, and language options before visiting.",
    source:
      "https://www.fh-dortmund.de/studieren/beratung/beratung-waehrend-des-studiums.php",
  },
  {
    id: "library",
    name: "Campus Library",
    short: "Space to focus. Room to discover.",
    category: "Student services",
    icon: "book",
    address: "Emil-Figge-Straße 44",
    description:
      "Find literature for your courses, explore research resources, and get help from the library team in Building 44.",
    tags: ["Research resources", "Study support"],
    detail:
      "Visit the library website for current opening hours, lending information, and study space availability.",
    source: "https://www.fh-dortmund.de/microsite/bibliothek/",
  },
].map((item) => ({ ...item, ...locationGeography(item.id) }));

// Nearby locations use a mapped OSM node or a published building address. They
// are deliberately kept separate from the FH building-footprint assignments.
const nearby = [
  {
    id: "s1",
    name: "Dortmund Universität · S1",
    short: "Fastest link to the city centre",
    category: "Transport",
    icon: "train",
    address: "Dortmund Universität station",
    coordinates: [7.4176906, 51.4927594],
    description:
      "The S1 connects Dortmund Hauptbahnhof and Dortmund Universität. It also continues west through the Ruhr area.",
    tags: ["S1", "Rail station", "Lift connection"],
    detail:
      "Use the official journey planner for the current platform, departures, disruptions, and accessible routing.",
    source: "https://www.tu-dortmund.de/campus/kontakt-und-anreise/",
    positionType: "Mapped rail station",
  },
  {
    id: "hbahn-nord",
    name: "H-Bahn · Campus Nord",
    short: "Campus North ↔ Campus South",
    category: "Transport",
    icon: "tram",
    address: "Campus Nord station",
    coordinates: [7.4156644, 51.4925149],
    description:
      "The H-Bahn links Campus Nord with Campus Süd and the Technologiezentrum. It is useful for getting between university facilities.",
    tags: ["H-Bahn line 1", "H-Bahn line 2"],
    detail:
      "Line 2 runs between Campus Nord and Campus Süd; check the official journey planner for current service.",
    source: "https://www.tu-dortmund.de/campus/kontakt-und-anreise/",
    positionType: "Mapped H-Bahn station",
  },
  {
    id: "bus-university",
    name: "Bus · Dortmund Universität S",
    short: "Bus interchange by the station",
    category: "Transport",
    icon: "bus",
    address: "Dortmund Universität S",
    coordinates: [7.4160727, 51.4927521],
    description:
      "A nearby bus interchange for Campus Nord. It is served by campus-bound city buses.",
    tags: ["445", "447", "462"],
    detail:
      "The listed lines are campus connections. Times and route variants change, so plan the exact trip before you leave.",
    source: "https://ub.tu-dortmund.de/die-ub/anfahrt/",
    positionType: "Mapped bus stop",
  },
  {
    id: "bus-emil",
    name: "Bus · Emil-Figge-Straße",
    short: "Closest stop to FH buildings",
    category: "Transport",
    icon: "bus",
    address: "Emil-Figge-Straße",
    coordinates: [7.4201008, 51.4950937],
    description:
      "The closest mapped bus stop to the FH Emil-Figge-Straße buildings and the TU Emil-Figge building cluster.",
    tags: ["Bus stop", "Shelter", "Step-free tagged"],
    detail:
      "Choose the direction and departure from the live planner; the map does not promise a timetable.",
    source: "https://www.vrr.de/en/timetable-mobility/journey-planner/",
    positionType: "Mapped bus platform",
  },
  {
    id: "main-mensa",
    name: "Hauptmensa · Campus Nord",
    short: "The largest campus canteen",
    category: "Food & drink",
    icon: "food",
    address: "Vogelpothsweg 85",
    coordinates: [7.4149019, 51.493164],
    description:
      "Campus Nord’s main Studierendenwerk canteen, with a broad daily food offer.",
    tags: ["Studierendenwerk", "Campus Nord", "Vegan options"],
    detail:
      "Menus, payment options, opening hours, and accessibility support are published by Studierendenwerk Dortmund.",
    source:
      "https://www.stwdo.de/mensa-cafes-und-catering/tu-dortmund/hauptmensa/",
    positionType: "Mapped restaurant location",
  },
  {
    id: "galerie",
    name: "Galerie · Campus Nord",
    short: "Café and terrace at the Mensa",
    category: "Food & drink",
    icon: "coffee",
    address: "Vogelpothsweg 85",
    coordinates: [7.4148329, 51.492716],
    description:
      "A café-style Campus Nord option in the Mensa building, with a winter garden and outdoor terrace.",
    tags: ["Studierendenwerk", "Café", "Terrace"],
    detail:
      "Consult Studierendenwerk Dortmund for today’s menu and opening times.",
    source: "https://www.stwdo.de/mensa-cafes-und-catering",
    positionType: "Mapped café location",
  },
  {
    id: "food-fakultaet",
    name: "food fakultät",
    short: "Pizza, pasta and quick food",
    category: "Food & drink",
    icon: "food",
    address: "Vogelpothsweg 74",
    coordinates: [7.4163778, 51.4935317],
    description:
      "A Campus Nord Studierendenwerk dining option near the university station.",
    tags: ["Studierendenwerk", "Pizza", "Pasta"],
    detail:
      "Consult Studierendenwerk Dortmund for today’s menu and opening times.",
    source: "https://www.stwdo.de/mensa-cafes-und-catering",
    positionType: "Mapped café location",
  },
  {
    id: "cafe-c",
    name: "Café C · Emil-Figge 50",
    short: "Coffee near the library",
    category: "Food & drink",
    icon: "coffee",
    address: "Emil-Figge-Straße 50",
    coordinates: [7.4173882, 51.4942352],
    description:
      "A mapped café inside the Emil-Figge-Straße 50 complex, close to the Emil-Figge Library.",
    tags: ["Café", "Campus Nord"],
    detail: "Opening times are subject to semester and holiday changes.",
    source: "https://www.stwdo.de/mensa-cafes-und-catering/tu-dortmund/cafec",
    positionType: "Mapped café location",
  },
  {
    id: "emil-library",
    name: "Emil-Figge Library · TU",
    short: "287 study places",
    category: "Study spaces",
    icon: "book",
    address: "Emil-Figge-Straße 50, first floor",
    coordinates: [7.4175613, 51.4943437],
    description:
      "TU Dortmund’s Emil-Figge Library is a central service point and study location on Campus Nord.",
    tags: ["287 study places", "Group work", "Library"],
    detail:
      "The TU publishes current opening times, services, booking options, and accessibility information.",
    source:
      "https://ub.tu-dortmund.de/lernen-lehren/standorte/emil-figge-bibliothek/",
    positionType: "Mapped library location",
  },
  {
    id: "tu-ef50",
    name: "TU Dortmund · Emil-Figge 50",
    short: "TU Campus Nord building",
    category: "Academic",
    icon: "building",
    address: "Emil-Figge-Straße 50",
    coordinates: [7.417053, 51.494238],
    description:
      "A major TU Dortmund Campus Nord building containing the Emil-Figge Library, café and study areas.",
    tags: ["TU Dortmund", "Library", "Study spaces"],
    detail:
      "Select the library, Café C, or EF 50 foyer entries for service-specific details.",
    source: "https://www.tu-dortmund.de/campus/kontakt-und-anreise/",
    positionType: "Mapped building location",
  },
  {
    id: "tu-mensa",
    mapVisible: false,
    name: "TU Dortmund · Mensa building",
    short: "Hauptmensa and Galerie",
    category: "Academic",
    icon: "building",
    address: "Vogelpothsweg 85",
    coordinates: [7.4149019, 51.493164],
    description:
      "The Campus Nord Mensa building hosts the Hauptmensa and Galerie operated by Studierendenwerk Dortmund.",
    tags: ["TU Dortmund", "Dining", "Campus Nord"],
    detail: "Select Hauptmensa or Galerie to see current operator information.",
    source: "https://www.tu-dortmund.de/campus/mensen/",
    positionType: "Mapped building location",
  },
  {
    id: "ef50-foyer",
    name: "EF 50 Foyer · TU",
    short: "30 study places",
    category: "Study spaces",
    icon: "study",
    address: "Emil-Figge-Straße 50",
    coordinates: [7.417053, 51.494238],
    description:
      "A study-area foyer in the TU Dortmund Emil-Figge-Straße 50 building.",
    tags: ["30 study places", "Foyer"],
    detail:
      "Access and opening hours are set by TU Dortmund and may change outside teaching periods.",
    source:
      "https://ub.tu-dortmund.de/en/learning-teaching/campus-study-areas/",
    positionType: "Published building reference point",
  },
  {
    id: "co-learning",
    name: "Co-Learning Space · TU",
    short: "250 study places",
    category: "Study spaces",
    icon: "study",
    address: "Joseph-von-Fraunhofer-Straße 18",
    coordinates: [7.410895, 51.49431],
    description:
      "A large North Campus study space with individual, group, lounge, and accessible workstations.",
    tags: ["250 study places", "Late opening", "Lockers"],
    detail:
      "TU Dortmund lists the quiet-zone, collaboration-room, and Hybrid Learning Center hours separately.",
    source:
      "https://ub.tu-dortmund.de/en/learning-teaching/campus-study-areas/",
    positionType: "Published building address",
  },
  {
    id: "sports-center",
    name: "Sportinstitut · OH3",
    short: "TU Dortmund Hochschulsport and sports halls",
    category: "Sport & fitness",
    icon: "sport",
    address: "Otto-Hahn-Straße 3 · Campus Nord",
    coordinates: [7.41625, 51.49],
    description:
      "The Sportinstitut at Otto-Hahn-Straße 3 is the hub for TU Dortmund Hochschulsport, sports halls, course rooms and the neighbouring outdoor sports facilities. FH Dortmund students can use the university sports programme.",
    tags: ["Hochschulsport", "Sports halls", "Outdoor facilities"],
    detail:
      "Courses, access and opening times vary. Check the current Hochschulsport programme before visiting.",
    source: "https://hsp.tu-dortmund.de/sportangebot/indoor-sportstaetten/",
    positionType: "Mapped sports-building footprint",
  },
  {
    id: "fitness-foerderwerk",
    name: "Fitnessförderwerk Dortmund",
    short: "Training and fitness support at OH3",
    category: "Sport & fitness",
    icon: "sport",
    address: "Otto-Hahn-Straße 3 · Sportinstitut",
    coordinates: [7.4162, 51.4899],
    description:
      "A fitness and training offer at the Sportinstitut, close to the Hochschulsport halls and outdoor facilities.",
    tags: ["Fitness", "OH3", "Campus Nord"],
    detail:
      "Participation, opening times and access conditions vary by programme. Check the provider before visiting.",
    source: "https://hsp.tu-dortmund.de/sportangebot/indoor-sportstaetten/",
    positionType: "Sportinstitut building reference",
  },
  {
    id: "ball-sports",
    name: "Ballsportanlage",
    short: "Outdoor football and multi-sport courts",
    category: "Sport & fitness",
    icon: "sport",
    address: "Sports precinct · Campus Nord",
    coordinates: [7.41561, 51.48886],
    description:
      "The mapped outdoor sports area includes football and multi-sport pitches beside the Sportinstitut.",
    tags: ["Football", "Multi-sport", "Outdoors"],
    detail:
      "Courts may be reserved for university sport or club sessions. Follow on-site booking and access signs.",
    source: "https://www.openstreetmap.org/way/791522521",
    positionType: "Mapped outdoor sports pitch",
  },
  {
    id: "tennis-courts",
    name: "Tennisplätze · Campus Nord",
    short: "Outdoor tennis courts",
    category: "Sport & fitness",
    icon: "sport",
    address: "Sports precinct · Campus Nord",
    coordinates: [7.41639, 51.48833],
    description:
      "Mapped tennis courts form part of the Campus Nord outdoor sports area.",
    tags: ["Tennis", "Outdoors"],
    detail:
      "Court availability and access can change with term-time programmes and weather.",
    source: "https://www.openstreetmap.org/way/23099211",
    positionType: "Mapped tennis courts",
  },
  {
    id: "turnpunkt",
    name: "TUrnpunkt · Outdoor Fitness",
    short: "Calisthenics station near the sports halls",
    category: "Sport & fitness",
    icon: "sport",
    address: "Sports precinct · Campus Nord",
    coordinates: [7.41499, 51.49109],
    description:
      "An outdoor calisthenics station with bodyweight training equipment near the Sportinstitut.",
    tags: ["Calisthenics", "Outdoor fitness"],
    detail:
      "Use the equipment at your own pace and follow the safety information displayed at the facility.",
    source: "https://hsp.tu-dortmund.de/sportangebot/outdoor-sportstaetten/turnpunkt/",
    positionType: "Mapped outdoor fitness station",
  },
  {
    id: "running-track",
    name: "Campus Nord Laufstrecke",
    short: "Mapped running track through the sports precinct",
    category: "Sport & fitness",
    icon: "sport",
    address: "Sports precinct · Campus Nord",
    coordinates: [7.41438, 51.48908],
    description:
      "The running track is shown as a continuous terracotta route through the mapped outdoor sports grounds.",
    tags: ["Running", "Outdoor fitness", "Sports precinct"],
    detail:
      "Use the marked track and watch for other campus users crossing shared paths.",
    source: "https://www.openstreetmap.org/way/1084443403",
    positionType: "Mapped running-track geometry",
  },
  {
    id: "seminar-building",
    name: "Seminar Room Building · TU",
    short: "500 study places",
    category: "Study spaces",
    icon: "study",
    address: "Friedrich-Wöhler-Weg 6",
    coordinates: [7.41165, 51.49619],
    description:
      "The seminar building provides foyer, corridor, and workroom study spaces on Campus Nord.",
    tags: ["500 study places", "Quiet zone"],
    detail:
      "Opening times and exam-period access are published by TU Dortmund.",
    source:
      "https://ub.tu-dortmund.de/en/learning-teaching/campus-study-areas/",
    positionType: "Published building address",
  },
  {
    id: "stwdo",
    mapVisible: false,
    name: "Studierendenwerk Dortmund",
    short: "Dining, housing and student support",
    category: "Student services",
    icon: "support",
    address: "Campus Nord · Vogelpothsweg 85",
    coordinates: [7.4149019, 51.493164],
    description:
      "Studierendenwerk Dortmund operates campus dining and provides student-focused services such as housing and advice.",
    tags: ["Dining", "Housing", "Student services"],
    detail:
      "Use the Studierendenwerk website for the right service contact; its office locations and services vary.",
    source: "https://www.stwdo.de/",
    positionType: "Campus Nord service reference",
  },
  {
    id: "tk-campus",
    name: "TK · Dortmund Campus",
    short: "Health insurance office in the Mensa foyer",
    category: "Student services",
    icon: "health",
    address: "Vogelpothsweg 85 · 1st floor, Mensa foyer",
    coordinates: [7.4151408, 51.4932358],
    description:
      "Techniker Krankenkasse’s campus office is located in the Mensa foyer. It is a practical place to ask about statutory health-insurance matters.",
    tags: ["Health insurance", "TK", "Campus Nord"],
    detail:
      "The official TK page publishes the current appointment options and opening times. Check it before visiting.",
    source: "https://www.tk.de/service/app/2025242/filiale/detail.app",
    positionType: "Mapped health-insurance office",
  },
  {
    id: "atm-campus",
    name: "ATMs · Campus Nord Mensa foyer",
    short: "Cash machines at Vogelpothsweg 85",
    category: "Everyday services",
    icon: "atm",
    address: "Vogelpothsweg 85 · Mensa foyer",
    coordinates: [7.4151932, 51.4931778],
    description:
      "Two mapped cash machines sit beside the Campus Nord Mensa foyer; one is tagged as operated by Dortmunder Volksbank.",
    tags: ["ATM", "Cash", "Wheelchair tagged"],
    detail:
      "Availability, card fees, and cash services depend on the operator and can change.",
    source: "https://www.openstreetmap.org/node/1432777406",
    positionType: "Mapped ATM location",
  },
];
const namedBuildingIds = {
  "main-mensa": 17059736,
  galerie: 17059736,
  "tu-mensa": 17059736,
  stwdo: 17059736,
  "tk-campus": 17059736,
  "atm-campus": 17059736,
  "food-fakultaet": 23106346,
  "cafe-c": 17058381,
  "emil-library": 17058381,
  "tu-ef50": 17058381,
  "ef50-foyer": 17058381,
  "co-learning": 1179680969,
  "seminar-building": 134024651,
  "sports-center": 1264162239,
  "fitness-foerderwerk": 1264162239,
};
const nearbyWithGeography = nearby.map((item) => ({
  ...item,
  ...(namedBuildingIds[item.id]
    ? buildingGeography(namedBuildingIds[item.id], item.coordinates)
    : pointGeography(
        item.coordinates,
        `https://www.openstreetmap.org/?mlat=${item.coordinates[1]}&mlon=${item.coordinates[0]}#map=19/${item.coordinates[1]}/${item.coordinates[0]}`,
        item.positionType,
      )),
}));

export const places = [...locations, ...nearbyWithGeography];
export const colors = {
  Academic: "#47746a",
  "Food & drink": "#bc8250",
  "Student services": "#6388a6",
  "Everyday services": "#b27b61",
  "Sport & fitness": "#558b74",
  Wellbeing: "#9780ad",
  Transport: "#4c79a5",
  "Study spaces": "#7b6d9f",
};

// Read from the FH Dortmund accessible campus plan supplied with this project.
// These indicate facilities at the building, not a promise that every room is step-free.
export const accessibilityInfo = {
  44: "The official campus plan marks step-free entrances, lifts and accessible toilets in Building 44.",
  42: "The official campus plan marks step-free entrances, lifts and accessible toilets in Building 42.",
  40: "The official campus plan marks step-free entrances, lifts and accessible toilets in Building 40.",
  mensa:
    "The official campus plan marks a step-free entrance, lift and accessible toilet in Building 40a (kostBar / Auditorium).",
  asta: "The official campus plan marks a step-free entrance, lift and accessible toilet in Building 38b.",
  support:
    "The official campus plan marks a step-free entrance, lift and accessible toilet in Building 38.",
  library:
    "The official campus plan marks step-free entrances, lifts and accessible toilets in Building 44.",
};
export const accessibilitySource =
  "https://www.fh-dortmund.de/barrierefreie-anfahrtsbeschreibungen/barrierefreiheit-am-campus-emil-figge-strasse.php";

const german = {
  44: [
    "Wirtschaft & Sozialwissenschaften",
    "Gebäude 44",
    "Hier befinden sich Wirtschaft und Angewandte Sozialwissenschaften mit Hörsälen, Seminarräumen und Begegnungsflächen.",
  ],
  42: [
    "Informatik",
    "Gebäude 42",
    "Die Fakultät Informatik vereint Lehre, Praxisprojekte und Forschung. Hier finden Sie Informatik-Veranstaltungen und Fachbereichsangebote.",
  ],
  40: [
    "Architektur",
    "Gebäude 40",
    "Hier befindet sich die Fakultät Architektur mit Lehr- und Arbeitsräumen für Entwurf, Konstruktion und gebaute Umwelt.",
  ],
  mensa: [
    "Mensa kostBar",
    "Ihr Mittagessen auf dem Campus",
    "Machen Sie Pause, essen Sie zusammen und lernen Sie neue Menschen kennen. Die Mensa liegt zwischen den zentralen FH-Gebäuden.",
  ],
  asta: [
    "AStA · Studierendenvertretung",
    "Studierende unterstützen Studierende",
    "Der AStA vertritt Ihre Interessen und ist eine erste Anlaufstelle für studentisches Leben und Gemeinschaft.",
  ],
  support: [
    "Psychologische Beratung",
    "Unterstützung, wenn sie gebraucht wird",
    "Die psychologische Beratung unterstützt bei Herausforderungen im Studium und Alltag. Vereinbaren Sie einen Termin mit dem Beratungsteam.",
  ],
  library: [
    "Campus-Bibliothek",
    "Platz zum Lernen. Raum zum Entdecken.",
    "Finden Sie Literatur für Ihr Studium, recherchieren Sie und erhalten Sie Unterstützung vom Bibliotheksteam in Gebäude 44.",
  ],
  s1: [
    "Dortmund Universität · S1",
    "Schnellste Verbindung in die Innenstadt",
    "Die S1 verbindet Dortmund Hauptbahnhof und Dortmund Universität und fährt weiter durch das Ruhrgebiet.",
  ],
  "hbahn-nord": [
    "H-Bahn · Campus Nord",
    "Campus Nord ↔ Campus Süd",
    "Die H-Bahn verbindet Campus Nord mit Campus Süd und dem Technologiezentrum.",
  ],
  "bus-university": [
    "Bus · Dortmund Universität S",
    "Umstieg am Bahnhof",
    "Ein Bus-Umstieg für Campus Nord mit Verbindungen zum Universitätsgelände.",
  ],
  "bus-emil": [
    "Bus · Emil-Figge-Straße",
    "Nächste Haltestelle für FH-Gebäude",
    "Die nächstgelegene Bushaltestelle für die FH-Gebäude an der Emil-Figge-Straße und den TU-Cluster.",
  ],
  "main-mensa": [
    "Hauptmensa · Campus Nord",
    "Die größte Mensa auf dem Campus",
    "Die Hauptmensa des Studierendenwerks auf Campus Nord bietet ein breites tägliches Speisenangebot.",
  ],
  galerie: [
    "Galerie · Campus Nord",
    "Café und Terrasse an der Mensa",
    "Eine Café-Option im Mensagebäude mit Wintergarten und Außenterrasse.",
  ],
  "food-fakultaet": [
    "food fakultät",
    "Pizza, Pasta und schnelle Gerichte",
    "Eine Campus-Nord-Gastronomie des Studierendenwerks nahe dem Universitätsbahnhof.",
  ],
  "cafe-c": [
    "Café C · Emil-Figge 50",
    "Kaffee nahe der Bibliothek",
    "Ein Café im Komplex Emil-Figge-Straße 50, nahe der Emil-Figge-Bibliothek.",
  ],
  "emil-library": [
    "Emil-Figge-Bibliothek · TU",
    "287 Lernplätze",
    "Die Emil-Figge-Bibliothek ist zentraler Servicepunkt und Lernort der TU Dortmund auf Campus Nord.",
  ],
  "tu-ef50": [
    "TU Dortmund · Emil-Figge 50",
    "TU-Gebäude Campus Nord",
    "Ein großes TU-Gebäude mit Emil-Figge-Bibliothek, Café und Lernbereichen.",
  ],
  "tu-mensa": [
    "TU Dortmund · Mensagebäude",
    "Hauptmensa und Galerie",
    "Im Mensagebäude auf Campus Nord befinden sich Hauptmensa und Galerie des Studierendenwerks.",
  ],
  "ef50-foyer": [
    "EF 50 Foyer · TU",
    "30 Lernplätze",
    "Ein Lernbereich im Foyer des TU-Gebäudes Emil-Figge-Straße 50.",
  ],
  "co-learning": [
    "Co-Learning Space · TU",
    "250 Lernplätze",
    "Ein großer Lernort auf Campus Nord mit Einzel-, Gruppen-, Lounge- und barrierearmen Arbeitsplätzen.",
  ],
  "sports-center": [
    "TU Dortmund Sportzentrum · OH3",
    "Campus-Fitnessstudio, Sporthallen und Außenanlagen",
    "Das Sportgebäude des Hochschulsports der TU Dortmund bietet Hallen, Fitness, Kursräume und Zugang zu angrenzenden Außensportanlagen. Studierende der FH Dortmund können das Hochschulsportprogramm nutzen.",
  ],
  "seminar-building": [
    "Seminarraumgebäude · TU",
    "500 Lernplätze",
    "Das Seminarraumgebäude bietet Lernplätze im Foyer, auf den Fluren und in Arbeitsräumen.",
  ],
  stwdo: [
    "Studierendenwerk Dortmund",
    "Essen, Wohnen und studentische Unterstützung",
    "Das Studierendenwerk Dortmund betreibt Campusgastronomie und bietet studentische Dienste wie Wohnen und Beratung.",
  ],
  "tk-campus": [
    "TK · Dortmund Campus",
    "Krankenkassenbüro im Mensa-Foyer",
    "Das Campus-Büro der Techniker Krankenkasse befindet sich im Mensa-Foyer und unterstützt bei Fragen zur gesetzlichen Krankenversicherung.",
  ],
  "atm-campus": [
    "Geldautomaten · Campus-Nord-Mensafoyer",
    "Geldautomaten am Vogelpothsweg 85",
    "Zwei kartierte Geldautomaten befinden sich neben dem Mensa-Foyer auf Campus Nord; einer ist als Dortmunder Volksbank gekennzeichnet.",
  ],
};
export function localize(place, field, locale = "en") {
  if (locale !== "de") return place[field];
  const copy = german[place.id];
  if (!copy) return place[field];
  return field === "name"
    ? copy[0]
    : field === "short"
      ? copy[1]
      : field === "description"
        ? copy[2]
        : place[field];
}
