import data from "./campus-geography.json";

// Local equirectangular tangent plane: meters east (x), south (z).
// At campus scale (< 1 km), this retains footprint dimensions and bearings.
export const origin = data.origin;
const R = 6378137;
const radians = Math.PI / 180;
export function project([lon, lat]) {
  return [
    (lon - origin[0]) * radians * R * Math.cos(origin[1] * radians),
    0,
    -(lat - origin[1]) * radians * R,
  ];
}
export function unproject([x, , z]) {
  return [
    origin[0] + x / (radians * R * Math.cos(origin[1] * radians)),
    origin[1] - z / (radians * R),
  ];
}
export function inside(point, ring) {
  let result = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i],
      b = ring[j];
    if (
      a[1] > point[1] !== b[1] > point[1] &&
      point[0] < ((b[0] - a[0]) * (point[1] - a[1])) / (b[1] - a[1]) + a[0]
    )
      result = !result;
  }
  return result;
}
// Find a point within the footprint, including concave/L-shaped buildings.
export function interiorPoint(ring) {
  const points = ring.map((p) => {
    const [x, , z] = project(p);
    return [x, z];
  });
  const xs = points.map((p) => p[0]),
    ys = points.map((p) => p[1]);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs),
    minY = Math.min(...ys),
    maxY = Math.max(...ys);
  let best = null,
    clearance = -1;
  for (let i = 1; i < 40; i++)
    for (let j = 1; j < 40; j++) {
      const p = [
        minX + ((maxX - minX) * i) / 40,
        minY + ((maxY - minY) * j) / 40,
      ];
      if (!inside(p, points)) continue;
      const distance = Math.min(
        ...points.slice(1).map((b, k) => {
          const a = points[k],
            dx = b[0] - a[0],
            dy = b[1] - a[1];
          const t = Math.max(
            0,
            Math.min(
              1,
              ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) /
                (dx * dx + dy * dy || 1),
            ),
          );
          return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
        }),
      );
      if (distance > clearance) {
        best = p;
        clearance = distance;
      }
    }
  if (!best) throw new Error("No interior marker position found");
  return unproject([best[0], 0, best[1]]);
}
export const geography = data;
export const buildings = data.features.filter((f) => f.kind === "building");
export const buildingIds = {
  44: 666943113,
  42: 24551042,
  40: 24580642,
  mensa: 95804177,
  asta: 591790701,
  support: 130871490,
  library: 666943113,
};
export function heightFor(feature) {
  const height = parseFloat(feature.tags.height);
  if (Number.isFinite(height) && height > 0) return height;
  return (parseFloat(feature.tags["building:levels"]) || 3) * 3.3;
}
export function locationGeography(id) {
  const building = buildings.find((f) => f.id === buildingIds[id]);
  if (!building) throw new Error(`Missing footprint for ${id}`);
  const poiId =
    id === "library" ? 13460455620 : id === "mensa" ? 1110296437 : null;
  const poi = data.features.find((f) => f.kind === "poi" && f.id === poiId);
  const coordinates = poi?.coordinates || interiorPoint(building.coordinates);
  return {
    coordinates,
    position: project(coordinates),
    buildingId: building.id,
    height: heightFor(building),
    positionSource: poi
      ? `https://www.openstreetmap.org/node/${poi.id}`
      : `https://www.openstreetmap.org/way/${building.id}`,
    positionType: poi
      ? "Mapped service location"
      : "Building reference point; not an entrance",
  };
}

/** Put a service marker on the footprint of its named building. */
export function buildingGeography(buildingId, preferredCoordinates) {
  const building = buildings.find((f) => f.id === buildingId);
  if (!building) throw new Error(`Missing footprint for ${buildingId}`);
  const coordinates =
    preferredCoordinates && inside(preferredCoordinates, building.coordinates)
      ? preferredCoordinates
      : interiorPoint(building.coordinates);
  return {
    coordinates,
    position: project(coordinates),
    buildingId: building.id,
    height: heightFor(building),
    positionSource: `https://www.openstreetmap.org/way/${building.id}`,
    positionType: "Mapped building footprint",
  };
}

/** A mapped POI or verified address point that is not tied to an FH footprint. */
export function pointGeography(
  coordinates,
  source,
  positionType = "Mapped place location",
) {
  return {
    coordinates,
    position: project(coordinates),
    buildingId: null,
    height: 5,
    positionSource: source,
    positionType,
  };
}
