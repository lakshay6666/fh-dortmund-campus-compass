import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera, Html } from "@react-three/drei";
import * as THREE from "three";
import {
  Building2,
  Utensils,
  Users,
  Heart,
  HeartPulse,
  BookOpen,
  BusFront,
  TrainFront,
  TramFront,
  Coffee,
  GraduationCap,
  Landmark,
  CreditCard,
  Dumbbell,
} from "lucide-react";
import { places, colors, localize } from "./data";
import { geography, buildings, project, heightFor } from "./geography";

const icons = {
  building: Building2,
  code: Building2,
  architecture: Building2,
  food: Utensils,
  users: Users,
  heart: Heart,
  health: HeartPulse,
  book: BookOpen,
  bus: BusFront,
  train: TrainFront,
  tram: TramFront,
  coffee: Coffee,
  study: GraduationCap,
  support: Landmark,
  atm: CreditCard,
  sport: Dumbbell,
};
const campusIds = new Set([
  ...places.map((l) => l.buildingId).filter(Boolean),
  208448125,
]);
const sportCenterBuildingId = 1264162239;
const defaultMapTarget = new THREE.Vector3(...project([7.4176, 51.492]));
const roads = geography.features.filter(
  (f) => f.kind === "road" && f.tags.highway !== "platform",
);
const areas = geography.features.filter((f) => f.kind === "area");
const trees = geography.features.filter((f) => f.kind === "tree");
const cameraOffset = (is2d) =>
  new THREE.Vector3(...(is2d ? [0, 500, 0.001] : [0, 310, 350]));

function shapeOf(coordinates) {
  const shape = new THREE.Shape();
  coordinates.forEach((p, i) => {
    const [x, , z] = project(p);
    i ? shape.lineTo(x, -z) : shape.moveTo(x, -z);
  });
  return shape;
}
function Footprint({ feature, height = 0, color, onClick }) {
  const shape = useMemo(() => shapeOf(feature.coordinates), [feature]);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, height ? 0 : 0.035, 0]}
      castShadow={height > 0}
      receiveShadow
      onClick={onClick}
    >
      {height ? (
        <extrudeGeometry
          args={[shape, { depth: height, bevelEnabled: false }]}
        />
      ) : (
        <shapeGeometry args={[shape]} />
      )}
      <meshStandardMaterial color={color} roughness={0.92} />
    </mesh>
  );
}
function RunningTrack({ feature }) {
  const shape = useMemo(() => shapeOf(feature.coordinates), [feature]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.14, 0]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color="#c9765f" roughness={0.84} />
    </mesh>
  );
}
function Windows({ feature, height }) {
  const ref = useRef();
  const transforms = useMemo(() => {
    const pts = feature.coordinates.map(project),
      matrices = [];
    const area = pts
      .slice(1)
      .reduce((a, b, i) => a + pts[i][0] * b[2] - b[0] * pts[i][2], 0);
    const side = area > 0 ? 1 : -1;
    const dummy = new THREE.Object3D();
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1],
        b = pts[i],
        dx = b[0] - a[0],
        dz = b[2] - a[2],
        length = Math.hypot(dx, dz);
      const count = Math.floor(length / 3.2);
      for (let c = 0; c < count; c++)
        for (let y = 2.1; y < height - 1; y += 3.3) {
          const t = (c + 0.5) / count;
          dummy.position.set(
            a[0] + dx * t + ((side * dz) / length) * 0.06,
            y,
            a[2] + dz * t - ((side * dx) / length) * 0.06,
          );
          dummy.rotation.set(0, -Math.atan2(dz, dx), 0);
          dummy.updateMatrix();
          matrices.push(dummy.matrix.clone());
        }
    }
    return matrices;
  }, [feature, height]);
  useEffect(() => {
    transforms.forEach((m, i) => ref.current.setMatrixAt(i, m));
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [transforms]);
  return (
    <instancedMesh ref={ref} args={[null, null, transforms.length]}>
      <boxGeometry args={[1.7, 1.65, 0.14]} />
      <meshStandardMaterial color="#839b94" roughness={0.8} />
    </instancedMesh>
  );
}
function SportCenterWindows({ feature }) {
  const ref = useRef();
  const transforms = useMemo(() => {
    const points = feature.coordinates.map(project);
    const matrices = [];
    const dummy = new THREE.Object3D();
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      const dx = b[0] - a[0],
        dz = b[2] - a[2];
      const length = Math.hypot(dx, dz);
      if (!length) continue;
      // OH3 has broad, continuous bands of glazing rather than a grid of windows.
      dummy.position.set((a[0] + b[0]) / 2, 4.75, (a[2] + b[2]) / 2);
      dummy.rotation.set(0, -Math.atan2(dz, dx), 0);
      dummy.scale.set(Math.max(1, length - 1.3), 1, 1);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
    }
    return matrices;
  }, [feature]);
  useEffect(() => {
    transforms.forEach((matrix, index) => ref.current.setMatrixAt(index, matrix));
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [transforms]);
  return (
    <instancedMesh ref={ref} args={[null, null, transforms.length]}>
      <boxGeometry args={[1, 0.85, 0.16]} />
      <meshStandardMaterial color="#24323a" roughness={0.38} metalness={0.15} />
    </instancedMesh>
  );
}
function GeographicBuilding({ feature, selected, onSelect }) {
  const campus = campusIds.has(feature.id),
    height = heightFor(feature);
  const isSportCenter = feature.id === sportCenterBuildingId;
  const item = places.find(
    (l) => l.buildingId === feature.id && l.id !== "library",
  );
  const active =
    places.find((l) => l.id === selected)?.buildingId === feature.id;
  const shape = useMemo(() => shapeOf(feature.coordinates), [feature]);
  const outline = useMemo(
    () =>
      new Float32Array(
        feature.coordinates.flatMap((p) => {
          const [x, , z] = project(p);
          return [x, height + 0.08, z];
        }),
      ),
    [feature, height],
  );
  return (
    <group
      onPointerOver={
        item ? () => (document.body.style.cursor = "pointer") : undefined
      }
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <Footprint
        feature={feature}
        height={height}
        color={
          active
            ? "#d98245"
            : isSportCenter
              ? "#a94f40"
              : campus
                ? "#547b78"
                : "#9d9281"
        }
        onClick={
          item
            ? (e) => {
                e.stopPropagation();
                onSelect(item.id);
              }
            : undefined
        }
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, height + 0.025, 0]}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial
          color={
            active
              ? "#f5c58f"
            : isSportCenter
              ? "#353d40"
            : campus
                  ? "#86a8a1"
                  : "#c7bda9"
          }
        />
      </mesh>
      {campus && (
        <>
          {isSportCenter ? (
            <SportCenterWindows feature={feature} />
          ) : (
            <Windows feature={feature} height={height} />
          )}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[outline, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={
                active ? "#b57d49" : isSportCenter ? "#6f312a" : "#a99f8d"
              }
            />
          </line>
        </>
      )}
      {isSportCenter && (
        <Html
          position={[...project([7.41625, 51.49]).slice(0, 1), height + 1.3, project([7.41625, 51.49])[2]]}
          center
          zIndexRange={[2, 0]}
        >
          <span className="context-label sport-building-label">OH3 · SPORT</span>
        </Html>
      )}
      {feature.id === 208448125 && (
        <Html
          position={[
            ...project([7.42089, 51.49506]).slice(0, 1),
            height + 3,
            project([7.42089, 51.49506])[2],
          ]}
          center
          zIndexRange={[1, 0]}
        >
          <span className="context-label">38a · FH-Plus-2</span>
        </Html>
      )}
    </group>
  );
}
function Road({ feature }) {
  const geometry = useMemo(() => {
    const points = feature.coordinates.map(project),
      vertices = [];
    const h = feature.tags.highway;
    const width =
      parseFloat(feature.tags.width) ||
      (["footway", "path", "steps"].includes(h)
        ? 2
        : h === "cycleway"
          ? 2.5
          : h === "service"
            ? 3.8
            : h === "pedestrian"
              ? 5
              : 7);
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i],
        dx = b[0] - a[0],
        dz = b[2] - a[2],
        len = Math.hypot(dx, dz);
      if (!len) continue;
      const nx = ((-dz / len) * width) / 2,
        nz = ((dx / len) * width) / 2;
      const y = ["footway", "path", "steps"].includes(h) ? 0.1 : 0.075;
      const corners = [
        [a[0] + nx, y, a[2] + nz],
        [a[0] - nx, y, a[2] - nz],
        [b[0] + nx, y, b[2] + nz],
        [b[0] - nx, y, b[2] - nz],
      ];
      [0, 2, 1, 1, 2, 3].forEach((n) => vertices.push(...corners[n]));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    g.computeVertexNormals();
    return g;
  }, [feature]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const walking = ["footway", "path", "steps", "pedestrian"].includes(
    feature.tags.highway,
  );
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color={walking ? "#f9e7c7" : "#c88f64"}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
// Place street names on the nearest mapped segment, preserving its bearing.
function StreetName({ name }) {
  const label = useMemo(() => {
    const segments = roads
      .filter((f) => f.tags.name === name)
      .flatMap((f) =>
        f.coordinates.slice(1).map((b, i) => {
          const a = project(f.coordinates[i]),
            p = project(b),
            length = Math.hypot(p[0] - a[0], p[2] - a[2]);
          return {
            x: (a[0] + p[0]) / 2,
            z: (a[2] + p[2]) / 2,
            angle: -Math.atan2(p[2] - a[2], p[0] - a[0]),
            length,
          };
        }),
      )
      .filter((s) => s.length > 25);
    return segments.sort(
      (a, b) => Math.hypot(a.x, a.z) - Math.hypot(b.x, b.z),
    )[0];
  }, [name]);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    ctx.font = "500 42px sans-serif";
    ctx.fillStyle = "#64715e";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name.toUpperCase(), 512, 48);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, [name]);
  useEffect(() => () => texture.dispose(), [texture]);
  if (!label) return null;
  return (
    <group position={[label.x, 0.2, label.z]} rotation={[0, label.angle, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[70, 6.5]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}
function Tree({ feature }) {
  return (
    <group position={project(feature.coordinates)}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 4, 5]} />
        <meshStandardMaterial color="#9d8e76" />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow>
        <icosahedronGeometry args={[3, 1]} />
        <meshStandardMaterial color="#99b18b" flatShading />
      </mesh>
    </group>
  );
}
function Scene({
  selected,
  onSelect,
  visible,
  command,
  is2d,
  onViewChange,
  locale,
}) {
  const { size } = useThree();
  const fitZoom = Math.max(
    0.55,
    Math.min(size.width / 350, size.height / 300, 3),
  );
  const controls = useRef(),
    camera = useRef(),
    moving = useRef(false);
  const target = useRef(defaultMapTarget.clone()),
    desired = useRef(defaultMapTarget.clone().add(cameraOffset(false))),
    zoom = useRef(fitZoom);
  const lastView = useRef("");
  useEffect(() => {
    zoom.current = fitZoom;
    if (camera.current) {
      camera.current.zoom = fitZoom;
      camera.current.updateProjectionMatrix();
    }
  }, [fitZoom]);
  useEffect(() => {
    if (!selected) return;
    const p = places.find((x) => x.id === selected).position;
    target.current.set(p[0], 0, p[2]);
    desired.current.copy(target.current).add(cameraOffset(is2d));
    zoom.current = Math.max(fitZoom, camera.current?.zoom || fitZoom);
    moving.current = true;
  }, [selected]);
  useEffect(() => {
    if (!command || !camera.current || !controls.current) return;
    target.current.copy(controls.current.target);
    desired.current.copy(camera.current.position);
    if (command.type === "in")
      zoom.current = Math.min(10, camera.current.zoom * 1.25);
    if (command.type === "out")
      zoom.current = Math.max(0.45, camera.current.zoom / 1.25);
    if (command.type === "reset") {
      target.current.copy(defaultMapTarget);
      desired.current.copy(defaultMapTarget).add(cameraOffset(is2d));
      zoom.current = fitZoom;
    }
    if (command.type === "north") {
      desired.current
        .copy(target.current)
        .add(new THREE.Vector3(0, is2d ? 500 : 300, is2d ? 0.001 : 330));
      zoom.current = camera.current.zoom;
    }
    moving.current = true;
  }, [command]);
  useEffect(() => {
    if (controls.current) target.current.copy(controls.current.target);
    desired.current.copy(target.current).add(cameraOffset(is2d));
    zoom.current = camera.current?.zoom || fitZoom;
    moving.current = true;
  }, [is2d]);
  useFrame((_, delta) => {
    if (!controls.current || !camera.current) return;
    if (moving.current) {
      const t = 1 - Math.exp(-delta * 5);
      controls.current.target.lerp(target.current, t);
      camera.current.position.lerp(desired.current, t);
      camera.current.zoom = THREE.MathUtils.lerp(
        camera.current.zoom,
        zoom.current,
        t,
      );
      camera.current.updateProjectionMatrix();
      controls.current.update();
      if (
        camera.current.position.distanceTo(desired.current) < 0.03 &&
        Math.abs(camera.current.zoom - zoom.current) < 0.001
      )
        moving.current = false;
    }
    const north = new THREE.Vector3(0, 0, -1).applyQuaternion(
      camera.current.quaternion.clone().invert(),
    );
    const angle = (Math.atan2(north.x, north.y) * 180) / Math.PI;
    const meters = [5, 10, 20, 50, 100, 200].reduce((a, b) =>
      Math.abs(b * camera.current.zoom - 65) <
      Math.abs(a * camera.current.zoom - 65)
        ? b
        : a,
    );
    const view = {
      northAngle: Math.round(angle),
      scaleMeters: meters,
      scalePixels: Math.round(meters * camera.current.zoom),
    };
    const key = JSON.stringify(view);
    if (key !== lastView.current) {
      lastView.current = key;
      onViewChange?.(view);
    }
  });
  return (
    <>
      <OrthographicCamera
        makeDefault
        ref={camera}
        position={[0, 310, 350]}
        zoom={fitZoom}
        near={0.1}
        far={3000}
      />
      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minZoom={0.45}
        maxZoom={10}
        maxPolarAngle={Math.PI / 2.5}
        minPolarAngle={0.001}
        enableRotate={!is2d}
        enablePan
        panSpeed={1.1}
        screenSpacePanning
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: is2d ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
        }}
        touches={{
          ONE: THREE.TOUCH.PAN,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
        onStart={() => (moving.current = false)}
      />
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[-150, 350, 180]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-350}
        shadow-camera-right={350}
        shadow-camera-top={350}
        shadow-camera-bottom={-350}
        shadow-camera-far={1000}
        shadow-bias={-0.001}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5000, 5000]} />
        <meshStandardMaterial color="#f0d4a1" />
      </mesh>
      {areas.map((f) =>
        f.tags.leisure === "track" ? (
          <RunningTrack key={f.id} feature={f} />
        ) : (
          <Footprint
            key={f.id}
            feature={f}
            color={
              f.tags.leisure === "pitch" && f.tags.sport === "tennis"
                ? "#c8d3d5"
                : f.tags.leisure === "pitch" &&
                    f.tags.sport === "beachvolleyball"
                  ? "#e4cf9c"
                  : f.tags.leisure === "pitch"
                    ? "#99bc92"
                    : f.tags.leisure === "fitness_station"
                      ? "#b4c98f"
                      : f.tags.amenity === "parking"
                        ? "#d8bc91"
                        : f.tags.natural === "water"
                          ? "#8ebac1"
                          : "#e3c994"
            }
          />
        ),
      )}
      {roads.map((f) => (
        <Road key={f.id} feature={f} />
      ))}
      {buildings.map((f) => (
        <GeographicBuilding
          key={f.id}
          feature={f}
          selected={selected}
          onSelect={onSelect}
        />
      ))}
      {trees.map((f) => (
        <Tree key={f.id} feature={f} />
      ))}
      {[
        "Emil-Figge-Straße",
        "Vogelpothsweg",
        "Otto-Hahn-Straße",
        "Baroper Straße",
      ].map((name) => (
        <StreetName key={name} name={name} />
      ))}
      {places
        .filter((l) => visible.includes(l.id) && l.mapVisible !== false)
        .map((item) => {
          const Icon = icons[item.icon] || Building2;
          const name = localize(item, "name", locale);
          return (
            <Html
              key={item.id}
              position={[item.position[0], item.height + 5, item.position[2]]}
              center
              zIndexRange={[30, 2]}
            >
              <button
                aria-label={`Explore ${name}`}
                className={`map-marker ${selected === item.id ? "selected" : ""}`}
                onClick={() => onSelect(item.id)}
                style={{ "--marker": colors[item.category] }}
              >
                <span className="pin">
                  <Icon size={15} />
                </span>
                <span className="marker-label">
                  {["44", "42", "40"].includes(item.id)
                    ? `${item.id} · ${name}`
                    : item.id === "support"
                      ? "38 · Student wellbeing"
                      : item.id === "asta"
                        ? "38b · AStA"
                        : item.id === "mensa"
                          ? "40a · Mensa kostBar"
                          : name}
                </span>
              </button>
            </Html>
          );
        })}
    </>
  );
}
export default function CampusMap(props) {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#f0d4a1"]} />
      <Scene {...props} />
    </Canvas>
  );
}
