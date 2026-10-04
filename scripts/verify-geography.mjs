import { build } from "esbuild";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const bundle = await build({
  entryPoints: ["src/geography.js"],
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
});
const geo = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString("base64")}`
);
const expected = {
  44: ["44", 666943113],
  42: ["42", 24551042],
  40: ["40", 24580642],
  mensa: ["40a", 95804177],
  asta: ["38b", 591790701],
  support: ["38", 130871490],
  library: ["44", 666943113],
};
for (const [id, [address, way]] of Object.entries(expected)) {
  const location = geo.locationGeography(id),
    building = geo.buildings.find((f) => f.id === way);
  assert.equal(building.tags["addr:housenumber"], address);
  assert.equal(building.tags["addr:street"], "Emil-Figge-Straße");
  assert(
    geo.inside(location.coordinates, building.coordinates),
    `${id} marker must lie inside its actual footprint`,
  );
  for (const point of building.coordinates) {
    const roundtrip = geo.unproject(geo.project(point));
    assert(
      Math.abs(roundtrip[0] - point[0]) < 1e-10 &&
        Math.abs(roundtrip[1] - point[1]) < 1e-10,
    );
  }
}
const p = (id) => geo.locationGeography(id).coordinates;
assert(p("44")[0] < p("42")[0] && p("42")[0] < p("40")[0]);
assert(p("mensa")[1] > p("42")[1] && p("support")[1] > p("mensa")[1]);
assert(p("asta")[1] > p("mensa")[1]);
assert.equal(
  geo.locationGeography("library").positionSource,
  "https://www.openstreetmap.org/node/13460455620",
);
for (const [buildingId, coordinates] of [
  [17059736, [7.4149019, 51.493164]],
  [23106346, [7.4163778, 51.4935317]],
  [17058381, [7.417053, 51.494238]],
  [1179680969, [7.410895, 51.49431]],
  [134024651, [7.41165, 51.49619]],
  [1264162239, [7.41625, 51.49]],
]) {
  const place = geo.buildingGeography(buildingId, coordinates),
    building = geo.buildings.find((f) => f.id === buildingId);
  assert.equal(place.buildingId, buildingId);
  assert(
    geo.inside(place.coordinates, building.coordinates),
    `${buildingId} marker must lie inside its named building footprint`,
  );
}
const meterNorth = geo.project([
  geo.origin[0],
  geo.origin[1] + 1 / 111319.490793,
]);
assert(
  Math.abs(meterNorth[2] + 1) < 1e-8,
  "north must be negative z, at meter scale",
);
const data = JSON.parse(readFileSync("src/campus-geography.json", "utf8"));
assert(data.features.filter((f) => f.kind === "road").length > 100);
console.log(
  "PASS: all 7 markers inside correct addressed footprints; WGS84 round trips; north/metric scale; official-plan ordering; library source; road dataset.",
);
