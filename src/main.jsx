import React, { useState, useEffect, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import {
  Search,
  ArrowUpRight,
  ChevronRight,
  ChevronDown,
  MapPin,
  Globe2,
  Plus,
  Minus,
  LocateFixed,
  Layers,
  Compass,
  GraduationCap,
  Building2,
  Utensils,
  Users,
  Heart,
  HeartPulse,
  BookOpen,
  Code2,
  PenTool,
  X,
  ArrowRight,
  MousePointer2,
  Check,
  Info,
  Menu,
  BusFront,
  TrainFront,
  TramFront,
  Coffee,
  Landmark,
  CreditCard,
  Dumbbell,
  Route,
  Accessibility,
} from "lucide-react";
const CampusMap = lazy(() => import("./CampusMap"));
import {
  places,
  colors,
  campusSource,
  localize,
  accessibilityInfo,
  accessibilitySource,
} from "./data";
import "./styles.css";
const icons = {
  building: Building2,
  code: Code2,
  architecture: PenTool,
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
const filterNames = [
  "All places",
  "Academic",
  "Food & drink",
  "Study spaces",
  "Sport & fitness",
  "Transport",
  "Student services",
  "Everyday services",
  "Wellbeing",
];
function App() {
  const [view, setView] = useState({
      northAngle: 0,
      scaleMeters: 50,
      scalePixels: 60,
    }),
    [selected, setSelected] = useState(null),
    [category, setCategory] = useState("All places"),
    [query, setQuery] = useState(""),
    [command, setCommand] = useState(null),
    [is2d, setIs2d] = useState(false),
    [guide, setGuide] = useState(false),
    [transit, setTransit] = useState(false),
    [walking, setWalking] = useState(false),
    [routeOrigin, setRouteOrigin] = useState("s1"),
    [accessible, setAccessible] = useState(false),
    [locale, setLocale] = useState("en"),
    [legend, setLegend] = useState(true),
    [mobile, setMobile] = useState(false),
    [language, setLanguage] = useState(false),
    [hunt, setHunt] = useState(false),
    [huntStep, setHuntStep] = useState(0);
  const t = (item, field) => localize(item, field, locale);
  const filtered = places.filter(
    (x) =>
      (category === "All places" || x.category === category) &&
      (
        x.name +
        " " +
        t(x, "name") +
        " " +
        x.address +
        " " +
        x.category +
        " " +
        x.short +
        " " +
        t(x, "short") +
        " " +
        x.tags.join(" ")
      )
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const active = places.find((x) => x.id === selected);
  const origin = places.find((x) => x.id === routeOrigin);
  const distance =
    active && origin
      ? Math.round(
          (Math.hypot(
            active.position[0] - origin.position[0],
            active.position[2] - origin.position[2],
          ) *
            1.25) /
            10,
        ) * 10
      : 0;
  const minutes = Math.max(1, Math.ceil(distance / (accessible ? 62 : 78)));
  useEffect(() => {
    if (!guide && !transit && !walking && !hunt) return;
    const previous = document.activeElement;
    const dialog = document.querySelector(
      hunt
        ? ".hunt-guide"
        : guide
          ? ".guide"
          : transit
            ? ".transit-guide"
            : ".walking-guide",
    );
    dialog?.querySelector("button,select")?.focus();
    function key(e) {
      if (e.key === "Escape") {
        setGuide(false);
        setTransit(false);
        setWalking(false);
        setHunt(false);
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [guide, transit, walking, hunt]);
  function select(id) {
    setSelected(id);
    setMobile(false);
  }
  function control(type) {
    setCommand({ type, time: Date.now() });
  }
  const huntStops = [
    {
      id: "44",
      time: "4 min",
      title: "Welcome point · Building 44",
      question: "What number is displayed on this building?",
      hint: "Look at the entrance or the building sign.",
      answer: "44",
      challenge:
        "Each team shares one question they want answered during their first week.",
    },
    {
      id: "42",
      time: "4 min",
      title: "Tech stop · Building 42",
      question: "Which faculty is based in this building?",
      hint: "Read the building signage or open its map card.",
      answer: "Computer Science",
      challenge:
        "Find one practical reason a new student might visit this building.",
    },
    {
      id: "40",
      time: "4 min",
      title: "Design stop · Building 40",
      question: "Which subject is connected to this building?",
      hint: "Use the building sign or map card.",
      answer: "Architecture",
      challenge:
        "Make a quick team pose inspired by something you notice on the façade.",
    },
    {
      id: "mensa",
      time: "4 min",
      title: "Campus life · Mensa kostBar",
      question: "What is the name of this FH campus dining spot?",
      hint: "Check the sign or select the food marker on the map.",
      answer: "Mensa kostBar",
      challenge:
        "Each team names one way to make their first lunch break social.",
    },
    {
      id: "asta",
      time: "4 min",
      title: "Your student network · AStA",
      question: "Which building number is the AStA office in?",
      hint: "Read the sign or the map card.",
      answer: "38b",
      challenge:
        "Create one respectful question the group could ask the student representatives.",
    },
  ];
  return (
    <div className="app">
      <header className="header">
        <a className="brand" href="./" aria-label="Campus Compass home">
          <span className="brand-icon">
            <Compass size={26} strokeWidth={1.7} />
          </span>
          <span>
            campus<span className="brand-light">compass</span>
            <small>FACHHOCHSCHULE DORTMUND</small>
          </span>
        </a>
        <nav>
          <button
            className="nav-active"
            onClick={() => {
              setGuide(false);
              setTransit(false);
            }}
          >
            Explore campus
          </button>
          <button onClick={() => setTransit(true)}>
            Getting here <Route size={13} />
          </button>
          <button onClick={() => setHunt(true)}>
            Buddy Hunt <Compass size={13} />
          </button>
          <button onClick={() => setGuide(true)}>
            Student guide <ArrowUpRight size={13} />
          </button>
        </nav>
        <div className="header-right">
          <span className="campus-status">
            <i /> Emil-Figge-Straße campus
          </span>
          <div className="language-wrap">
            <button className="language" onClick={() => setLanguage(!language)}>
              <Globe2 size={16} /> {locale.toUpperCase()}{" "}
              <ChevronDown size={13} />
            </button>
            {language && (
              <div className="language-pop">
                <b>Place language</b>
                <button
                  onClick={() => {
                    setLocale("en");
                    setLanguage(false);
                  }}
                >
                  {locale === "en" && <Check size={14} />} English
                </button>
                <button
                  onClick={() => {
                    setLocale("de");
                    setLanguage(false);
                  }}
                >
                  {locale === "de" && <Check size={14} />} Deutsch
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          className="mobile-toggle"
          onClick={() => setMobile(!mobile)}
          aria-label="Toggle places"
        >
          <Menu />
        </button>
      </header>
      <div className="workspace">
        <aside className={`sidebar ${mobile ? "mobile-open" : ""}`}>
          <div className="sidebar-intro">
            <div className="eyebrow">
              <span /> CAMPUS NORD, CONNECTED
            </div>
            <h1>Find your place.</h1>
            <p>
              FH and TU Dortmund, food, study spaces,
              <br />
              and the way back to the city.
            </p>
          </div>
          <div className="search-wrap">
            <Search size={18} />
            <input
              aria-label="Search campus locations"
              placeholder="Search places, services…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query ? (
              <button aria-label="Clear search" onClick={() => setQuery("")}>
                <X size={15} />
              </button>
            ) : (
              <span className="search-shortcut">⌕</span>
            )}
          </div>
          <div className="filters">
            {filterNames.map((c) => (
              <button
                key={c}
                className={category === c ? "active" : ""}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="list-heading">
            <span>EXPLORE CAMPUS NORD</span>
            <span>{filtered.length} places</span>
          </div>
          <div className="location-list">
            {filtered.map((item) => {
              const Icon = icons[item.icon] || Building2;
              return (
                <button
                  className={`location ${selected === item.id ? "active" : ""}`}
                  key={item.id}
                  onClick={() => select(item.id)}
                >
                  <span
                    className="location-icon"
                    style={{
                      color: colors[item.category],
                      background: colors[item.category] + "12",
                    }}
                  >
                    <Icon size={20} strokeWidth={1.65} />
                  </span>
                  <span className="location-copy">
                    <strong>{t(item, "name")}</strong>
                    <span>{t(item, "short")}</span>
                  </span>
                  <ChevronRight size={16} />
                </button>
              );
            })}
            {!filtered.length && (
              <div className="empty">
                <Search size={24} />
                <strong>No places found</strong>
                <p>Try a building number or another service.</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setCategory("All places");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          <div className="welcome-card transit-card">
            <span className="welcome-icon">
              <TrainFront size={23} strokeWidth={1.5} />
            </span>
            <div>
              <strong>Coming from the city?</strong>
              <p>S1, H-Bahn and bus connections for Campus Nord.</p>
              <button onClick={() => setTransit(true)}>
                Plan your journey <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
          <div className="sidebar-footer">
            <span className="fh-logo">
              fh<span>↗</span>
            </span>
            <span>
              Fachhochschule Dortmund
              <br />
              <b>University of Applied Sciences and Arts</b>
            </span>
          </div>
        </aside>
        <main className="map-area">
          <Suspense
            fallback={<div className="loading">Preparing your campus…</div>}
          >
            <CampusMap
              selected={selected}
              onSelect={select}
              visible={filtered.map((x) => x.id)}
              command={command}
              is2d={is2d}
              onViewChange={setView}
              locale={locale}
            />
          </Suspense>
          <div className="map-title">
            <div className="map-title-icon">
              <MapPin size={20} />
            </div>
            <div>
              <h2>Emil-Figge-Straße</h2>
              <p>
                Dortmund, Germany <span>·</span> Campus Nord
              </p>
            </div>
            <span className="live-pill">CAMPUS MAP</span>
          </div>
          <div className="view-toggle">
            <button
              className={!is2d ? "active" : ""}
              onClick={() => setIs2d(false)}
            >
              3D view
            </button>
            <button
              className={is2d ? "active" : ""}
              onClick={() => setIs2d(true)}
            >
              2D view
            </button>
          </div>
          <button
            className="north-compass"
            aria-label="Orient map north"
            title="Orient map north"
            onClick={() => control("north")}
          >
            <span>N</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ transform: `rotate(${view.northAngle}deg)` }}
            >
              <path d="M12 2 L20 22 L12 17 L4 22 Z" fill="#3e6256" />
            </svg>
          </button>
          <div className="map-tools">
            <button
              title="Zoom in"
              aria-label="Zoom in"
              onClick={() => control("in")}
            >
              <Plus size={20} />
            </button>
            <button
              title="Zoom out"
              aria-label="Zoom out"
              onClick={() => control("out")}
            >
              <Minus size={20} />
            </button>
            <div />
            <button
              title="Reset map view"
              aria-label="Reset map view"
              onClick={() => {
                setSelected(null);
                control("reset");
              }}
            >
              <LocateFixed size={20} />
            </button>
            <button
              title="Toggle map legend"
              aria-label="Toggle map legend"
              className={!legend ? "muted" : ""}
              onClick={() => setLegend(!legend)}
            >
              <Layers size={19} />
            </button>
          </div>
          {active && (
            <section className="info-card" aria-live="polite">
              <div className="card-top">
                <span style={{ color: colors[active.category] }}>
                  {active.category}
                </span>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close location details"
                >
                  <X size={18} />
                </button>
              </div>
              <h2>{t(active, "name")}</h2>
              <div className="card-address">
                <MapPin size={14} />
                {active.address}
              </div>
              <p>{t(active, "description")}</p>
              <button
                className="walking-button"
                onClick={() => setWalking(true)}
              >
                <Route size={15} /> Walk here from a transit stop{" "}
                <ArrowRight size={15} />
              </button>
              {accessibilityInfo[active.id] && (
                <a
                  className="accessibility-note"
                  href={accessibilitySource}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Accessibility size={17} />
                  <span>
                    <b>Accessibility on the official plan</b>
                    {accessibilityInfo[active.id]}
                  </span>
                  <ArrowUpRight size={14} />
                </a>
              )}
              <div className="geo-details">
                <span>
                  {active.coordinates[1].toFixed(6)}° N,{" "}
                  {active.coordinates[0].toFixed(6)}° E
                </span>
                <small>{active.positionType}</small>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${active.coordinates[1]},${active.coordinates[0]}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View location in Google Maps <ArrowUpRight size={13} />
                </a>
                <a
                  href={active.positionSource}
                  target="_blank"
                  rel="noreferrer"
                >
                  View mapped source <ArrowUpRight size={13} />
                </a>
              </div>
              <div className="tags">
                {active.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="detail-note">
                <Info size={16} />
                <span>{active.detail}</span>
              </div>
              <a
                className="primary-link"
                href={active.source}
                target="_blank"
                rel="noreferrer"
              >
                Visit official website <ArrowUpRight size={16} />
              </a>
            </section>
          )}
          <div className="map-bottom">
            {legend && (
              <div className="legend">
                <span className="legend-title">ON THE MAP</span>
                {Object.entries(colors).map(([c, color]) => (
                  <button
                    key={c}
                    onClick={() =>
                      setCategory(category === c ? "All places" : c)
                    }
                    className={category === c ? "legend-active" : ""}
                  >
                    <i style={{ background: color }} />
                    {c}
                  </button>
                ))}
              </div>
            )}
            <div className="map-caption">
              <span>
                <MousePointer2 size={13} />{" "}
                Drag to pan <b>·</b> {is2d ? "Right-drag to pan" : "Right-drag to rotate"} <b>·</b> Scroll to zoom
              </span>
              <span>
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noreferrer"
                >
                  © OpenStreetMap contributors
                </a>
                <b>·</b> Heights estimated <b>·</b>{" "}
                <a href={campusSource} target="_blank" rel="noreferrer">
                  Official campus plan <ArrowUpRight size={11} />
                </a>
              </span>
            </div>
          </div>
          <div className="scale">
            <span style={{ width: view.scalePixels }} />
            {view.scaleMeters} m
          </div>
        </main>
      </div>
      {transit && (
        <div className="modal-backdrop" onClick={() => setTransit(false)}>
          <section
            className="transit-guide"
            role="dialog"
            aria-modal="true"
            aria-label="Getting to Campus Nord"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-guide"
              aria-label="Close route guide"
              onClick={() => setTransit(false)}
            >
              <X size={20} />
            </button>
            <div className="guide-icon">
              <Route size={32} />
            </div>
            <div className="eyebrow">GETTING TO CAMPUS NORD</div>
            <h2>
              Start in the city.
              <br />
              Arrive on campus.
            </h2>
            <p>
              Use these as reliable starting patterns, then check the live
              journey planner for departure times, platform changes and
              disruption notices.
            </p>
            <div className="route-list">
              <button
                className="route-row"
                onClick={() => {
                  select("s1");
                  setTransit(false);
                }}
              >
                <span className="route-icon">
                  <TrainFront size={20} />
                </span>
                <span>
                  <strong>Dortmund Hauptbahnhof → S1</strong>
                  <small>
                    Take the S1 toward Dortmund Universität. This is the direct
                    rail connection from the main station.
                  </small>
                </span>
                <ChevronRight size={17} />
              </button>
              <button
                className="route-row"
                onClick={() => {
                  select("s1");
                  setTransit(false);
                }}
              >
                <span className="route-icon">
                  <TrainFront size={20} />
                </span>
                <span>
                  <strong>Bochum, Essen, Duisburg or Düsseldorf → S1</strong>
                  <small>
                    Use the S1 toward Dortmund and leave at Dortmund
                    Universität. Check the live planner for your direct service
                    and platform.
                  </small>
                </span>
                <ChevronRight size={17} />
              </button>
              <button
                className="route-row"
                onClick={() => {
                  select("bus-university");
                  setTransit(false);
                }}
              >
                <span className="route-icon">
                  <BusFront size={20} />
                </span>
                <span>
                  <strong>Stadtgarten or Kampstraße → Universität S</strong>
                  <small>
                    Travel to An der Palmweide, then use 445 or 462 toward
                    Campus Nord. The live planner will choose the best transfer.
                  </small>
                </span>
                <ChevronRight size={17} />
              </button>
              <button
                className="route-row"
                onClick={() => {
                  select("hbahn-nord");
                  setTransit(false);
                }}
              >
                <span className="route-icon">
                  <TramFront size={20} />
                </span>
                <span>
                  <strong>Campus Nord ↔ Campus Süd</strong>
                  <small>
                    Take the H-Bahn. Line 2 links the two campuses; line 1
                    continues to Technologiezentrum.
                  </small>
                </span>
                <ChevronRight size={17} />
              </button>
              <button
                className="route-row"
                onClick={() => {
                  select("bus-emil");
                  setTransit(false);
                }}
              >
                <span className="route-icon">
                  <BusFront size={20} />
                </span>
                <span>
                  <strong>Closest FH stop → Emil-Figge-Straße</strong>
                  <small>
                    Use this stop for the FH buildings at 38–44 and the TU
                    Emil-Figge cluster.
                  </small>
                </span>
                <ChevronRight size={17} />
              </button>
            </div>
            <a
              className="primary-link"
              href="https://www.vrr.de/en/timetable-mobility/journey-planner/"
              target="_blank"
              rel="noreferrer"
            >
              Open the live VRR journey planner <ArrowUpRight size={16} />
            </a>
            <small>
              Routes are service patterns, not a timetable. Confirm your exact
              trip in VRR or DSW21 before travelling.
            </small>
          </section>
        </div>
      )}
      {walking && active && (
        <div className="modal-backdrop" onClick={() => setWalking(false)}>
          <section
            className="walking-guide"
            role="dialog"
            aria-modal="true"
            aria-label="Walking route"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-guide"
              aria-label="Close walking directions"
              onClick={() => setWalking(false)}
            >
              <X size={20} />
            </button>
            <div className="guide-icon">
              <Route size={32} />
            </div>
            <div className="eyebrow">CAMPUS WALKING GUIDE</div>
            <h2>{t(active, "name")}</h2>
            <label>
              Starting point
              <select
                value={routeOrigin}
                onChange={(e) => setRouteOrigin(e.target.value)}
              >
                {places
                  .filter((p) =>
                    ["s1", "hbahn-nord", "bus-university", "bus-emil"].includes(
                      p.id,
                    ),
                  )
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {t(p, "name")}
                    </option>
                  ))}
              </select>
            </label>
            <div className="route-summary">
              <strong>{minutes} min</strong>
              <span>about {distance} m on foot</span>
            </div>
            <button
              className={`access-toggle ${accessible ? "active" : ""}`}
              onClick={() => setAccessible(!accessible)}
            >
              <Check size={15} />
              {accessible
                ? "Step-free guidance selected"
                : "Use step-free guidance"}
            </button>
            <ol className="walk-steps">
              <li>
                <b>Start</b> at {t(origin, "name")}.
              </li>
              <li>
                {accessible
                  ? "Use signed lifts, dropped kerbs and paved footways; avoid stairs and short-cut paths."
                  : "Follow the signed campus footway toward Emil-Figge-Straße / Campus Nord."}
              </li>
              <li>
                {routeOrigin === "bus-emil"
                  ? "Continue along Emil-Figge-Straße toward the numbered FH and TU buildings."
                  : "At the Campus Nord paths, follow the building numbers and campus wayfinding signs."}
              </li>
              <li>
                <b>Arrive</b> at {t(active, "name")} · {active.address}.
              </li>
            </ol>
            <p className="route-note">
              Estimated from mapped positions with a campus-walking allowance.
              This guide is for orientation; use the official route map or
              Google Maps for exact turns and temporary closures.
            </p>
            <a
              className="primary-link"
              href={`https://www.google.com/maps/dir/?api=1&origin=${origin.coordinates[1]},${origin.coordinates[0]}&destination=${active.coordinates[1]},${active.coordinates[0]}&travelmode=walking`}
              target="_blank"
              rel="noreferrer"
            >
              Open walking directions in Google Maps <ArrowUpRight size={16} />
            </a>
          </section>
        </div>
      )}
      {hunt && (
        <div className="modal-backdrop" onClick={() => setHunt(false)}>
          <section
            className="hunt-guide"
            role="dialog"
            aria-modal="true"
            aria-label="FH Dortmund buddy scavenger hunt"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-guide"
              aria-label="Close Buddy Hunt"
              onClick={() => setHunt(false)}
            >
              <X size={20} />
            </button>
            <div className="guide-icon">
              <Compass size={32} />
            </div>
            <div className="eyebrow">FH DORTMUND · BUDDY HUNT</div>
            <h2>
              Find your first
              <br />
              campus stories.
            </h2>
            <p>
              A 20–25 minute welcome activity for 20 students and one buddy.
              Split into five teams of four, keep the buddy as timekeeper, and
              reunite for a two-minute wrap-up.
            </p>
            <div className="hunt-meta">
              <span>
                <Users size={15} /> 20 students + 1 buddy
              </span>
              <span>
                <Route size={15} /> 20–25 min
              </span>
            </div>
            <div
              className="hunt-progress"
              aria-label={`${huntStep} of ${huntStops.length} stops completed`}
            >
              <span
                style={{ width: `${(huntStep / huntStops.length) * 100}%` }}
              />
            </div>
            <div className="hunt-stops">
              {huntStops.map((stop, index) => {
                const complete = index < huntStep;
                const current = index === huntStep;
                return (
                  <article
                    className={`hunt-stop ${complete ? "complete" : ""} ${current ? "current" : ""}`}
                    key={stop.id}
                  >
                    <button
                      className="hunt-number"
                      onClick={() => {
                        select(stop.id);
                        setHunt(false);
                      }}
                      aria-label={`Show ${stop.title} on map`}
                    >
                      {complete ? <Check size={14} /> : index + 1}
                    </button>
                    <div>
                      <small>{stop.time}</small>
                      <strong>{stop.title}</strong>
                      <div className="hunt-question">
                        <b>Question</b>
                        <p>{stop.question}</p>
                        <small>Hint: {stop.hint}</small>
                        <details>
                          <summary>Buddy answer</summary>
                          <b>{stop.answer}</b>
                        </details>
                      </div>
                      <p className="hunt-challenge">{stop.challenge}</p>
                      <button
                        className="show-stop"
                        onClick={() => {
                          select(stop.id);
                          setHunt(false);
                        }}
                      >
                        Show on map <ArrowRight size={13} />
                      </button>
                    </div>
                    {current && (
                      <button
                        className="complete-stop"
                        onClick={() =>
                          setHuntStep(Math.min(huntStops.length, huntStep + 1))
                        }
                      >
                        Done <Check size={14} />
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
            {huntStep === huntStops.length ? (
              <div className="hunt-finish">
                <Check size={17} />
                <span>
                  <b>Hunt complete.</b> Bring everyone together: each team
                  shares one helpful thing they discovered.
                </span>
              </div>
            ) : (
              <p className="hunt-note">
                Keep to outdoor or public areas, follow the buddy’s
                instructions, and do not interrupt classes or staff.
              </p>
            )}
            <button className="hunt-reset" onClick={() => setHuntStep(0)}>
              Restart hunt
            </button>
          </section>
        </div>
      )}
      {guide && (
        <div className="modal-backdrop" onClick={() => setGuide(false)}>
          <section
            className="guide"
            role="dialog"
            aria-modal="true"
            aria-label="International student guide"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-guide"
              aria-label="Close guide"
              onClick={() => setGuide(false)}
            >
              <X size={20} />
            </button>
            <div className="guide-icon">
              <Globe2 size={32} />
            </div>
            <div className="eyebrow">A GOOD PLACE TO BEGIN</div>
            <h2>
              Your next chapter
              <br />
              starts here.
            </h2>
            <p>
              Welcome to FH Dortmund. Find your feet, meet your people, and make
              this campus your own.
            </p>
            {[
              {
                icon: GraduationCap,
                title: "Find your faculty",
                text: "Your timetable lists the building and room. Explore buildings 40, 42, and 44 on the map.",
                action: () => {
                  setCategory("Academic");
                  setGuide(false);
                },
              },
              {
                icon: Users,
                title: "Meet your student community",
                text: "AStA in building 38b is a starting point for student representation and campus life.",
                action: () => {
                  select("asta");
                  setGuide(false);
                },
              },
              {
                icon: Heart,
                title: "Ask for support",
                text: "You can reach out when studying or daily life feels difficult. Check counseling availability.",
                action: () => {
                  select("support");
                  setGuide(false);
                },
              },
            ].map(({ icon: Icon, title, text, action }) => (
              <button className="guide-row" key={title} onClick={action}>
                <Icon size={22} />
                <span>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </span>
                <ArrowRight size={18} />
              </button>
            ))}
            <a
              className="primary-link"
              href="https://www.fh-dortmund.de/en/"
              target="_blank"
              rel="noreferrer"
            >
              Explore FH Dortmund in English <ArrowUpRight size={16} />
            </a>
            <small>
              Service languages and appointment availability may vary. Confirm
              with the team before visiting.
            </small>
          </section>
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
