# Campus Compass

A responsive React + Three.js campus explorer for FH Dortmund’s Emil-Figge-Straße campus.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:5173. `npm run build` creates a production build in `dist/`; `npm run preview` serves it locally.

## Features

- Procedural 3D campus with architectural details, trees, roads, paths, and shadows.
- Seven searchable locations, category filters, clickable buildings and markers, and information cards.
- Smooth camera focusing, orbit/pan/zoom, reset, and top-down view.
- English student guide, official source links, and responsive mobile directory.
- Keyboard-accessible controls and a focus-trapped guide dialog.

## Structure

- `src/CampusMap.jsx`: reusable React Three Fiber scene; accepts `selected`, `onSelect`, `visible`, `command`, and `is2d`.
- `src/data.js`: editable service data, categories, model coordinates, and official source URLs.
- `src/main.jsx`: directory, controls, cards, and guide.
- `src/styles.css`: responsive interface.

## Geographic data and accuracy

The map now uses actual WGS84 OpenStreetMap building polygons, roads, footpaths, parking areas, and mapped trees, downloaded September 25, 2026. Building assignments were cross-checked against the official FH Dortmund campus plan. No Google imagery or geometry is copied; each info card links its geographic position to Google Maps for comparison.

- `src/campus-geography.json` retains the original longitude/latitude vertices and OSM feature IDs, with source and attribution.
- `src/geography.js` projects coordinates into local meters (east = +x, north = -z). This local tangent-plane approximation has negligible distortion at campus scale; it is not survey-grade data.
- Actual footprint IDs: 44 = 666943113; 42 = 24551042; 40 = 24580642; kostBar/40a = 95804177; 38 = 130871490; 38a = 208448125; 38b = 591790701.
- Library and kostBar use mapped OSM service nodes. Other markers use an interior point of the assigned building and are labeled as building reference points, not entrances.
- Geometry positions, orientations, and ground dimensions come from the map. Building heights use OSM height tags when available, otherwise estimated floor heights (3.3 m per mapped level, or three levels if unknown). Windows are decorative. Untagged road/path widths are estimated.
- The counseling marker represents the EFS 38 outreach service announced in 2024; confirm the current appointment location, schedule, room, and language options before visiting.
- Ground scale and compass track the camera; 2D view is north-up.

Data: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), licensed under ODbL. Source endpoint and retrieval time are recorded in the dataset. Official reference: https://www.fh-dortmund.de/medien/hochschule/FHDO_Anfahrt_Emil-Figge-Strasse_DIN-A4.pdf

## Reproduce and verify

Download the public OSM extract from the source URL recorded in `src/campus-geography.json`, then run:

```sh
python3 scripts/import-campus.py /path/to/campus.osm
node scripts/verify-geography.mjs
npm run build
```

The geographic checks verify all service markers are inside the correctly addressed footprints, projection round trips, meter scale, north orientation, campus layout ordering, and library source identity.

WebGL is required for the interactive model. Geographic data is bundled, so no map API keys or live map requests are required at runtime.

## Campus Nord connections

The expanded directory includes mapped nearby bus stops, the Dortmund Universität S-Bahn/H-Bahn interchange, Campus Nord dining, TU Dortmund study spaces, the Emil-Figge Library, and Studierendenwerk Dortmund references. Route patterns link to the live VRR planner rather than embedding a timetable; public-transport services can change at short notice.
