"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Building2, Check, ChevronDown, Clock3, Copy, Crosshair, LoaderCircle, Mail, Map, MapPin, Navigation, Phone, Route } from "lucide-react";
import type { SiteAddress, SiteContact } from "../../lib/site-contact";
import { parseDays, useStudioStatus } from "../layout/StudioClock";
import styles from "./studio-directions.module.css";

/* ---------- Distance & arrival estimate (in the visitor's browser only) ---------- */

type Trip = { km: number; arrival: string };
type Locate = { state: "idle" | "locating" | "denied" | "unavailable" } | { state: "done"; trip: Trip };

/** Straight-line distance in km between two positions (haversine). */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

/** Rough road trip: roads run ~35% longer than the straight line; city ~26 km/h, highway ~55 km/h. */
function estimateTrip(straightKm: number, now = new Date()): Trip {
  const roadKm = straightKm * 1.35;
  const minutes = Math.round((roadKm / (roadKm > 60 ? 55 : 26)) * 60 + 3);
  const arrival = new Date(now.getTime() + minutes * 60_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return { km: roadKm, arrival };
}

const formatKm = (km: number) => (km < 10 ? km.toFixed(1) : Math.round(km).toLocaleString("en-IN"));

const WEEK = [
  { i: 1, short: "M", name: "Monday" },
  { i: 2, short: "T", name: "Tuesday" },
  { i: 3, short: "W", name: "Wednesday" },
  { i: 4, short: "T", name: "Thursday" },
  { i: 5, short: "F", name: "Friday" },
  { i: 6, short: "S", name: "Saturday" },
  { i: 0, short: "S", name: "Sunday" },
];

/* ---------- Illustrated route (light map, red route) ---------- */

/**
 * A light, red-on-white map illustration of the way in: white roads on a blush ground, the red
 * route with a direction arrow, the visitor's start (with their distance once known) and the studio
 * pin. Illustrative only; the "Map" tab shows the real Google map.
 */
function RouteArt({ trip, city }: { trip: Trip | null; city: string }) {
  return (
    <svg className={styles.art} viewBox="0 0 700 460" fill="none" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Illustrated route to the Mecatronix studio in ${city}. Open Google Maps for live directions.`}>
      <defs>
        <pattern id="fu-dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#f4c9c6" />
        </pattern>
        <filter id="fu-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id="fu-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#a30400" floodOpacity=".18" /></filter>
      </defs>

      <rect width="700" height="460" fill="#fff7f6" />
      <rect width="700" height="460" fill="url(#fu-dots)" opacity=".55" />

      {/* Roads: a pale edge, then white tarmac */}
      <g strokeLinecap="round" strokeLinejoin="round">
        <g stroke="#f6d8d5" strokeWidth="17">
          <path d="M-20 150Q200 160 350 152T720 140 M-20 296L180 288 420 300 720 286 M210-20L196 140 214 300 200 480 M600-20L612 210 590 480" />
        </g>
        <g stroke="#fbe7e5" strokeWidth="10">
          <path d="M-20 40H720 M-20 205L720 196 M-20 400L720 392 M96-20L102 480 M370-20L378 480 M500-20L492 480 M430 262L566 400" />
        </g>
        <g stroke="#ffffff" strokeWidth="13">
          <path d="M-20 150Q200 160 350 152T720 140 M-20 296L180 288 420 300 720 286 M210-20L196 140 214 300 200 480 M600-20L612 210 590 480" />
        </g>
        <g stroke="#ffffff" strokeWidth="6">
          <path d="M-20 40H720 M-20 205L720 196 M-20 400L720 392 M96-20L102 480 M370-20L378 480 M500-20L492 480 M430 262L566 400" />
        </g>
      </g>

      {/* Route */}
      <path d="M290 480V142Q290 120 312 120H500" stroke="#e10600" strokeWidth="20" opacity=".16" filter="url(#fu-glow)" />
      <path d="M290 480V142Q290 120 312 120H500" stroke="#e10600" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path className={styles.routeFlow} d="M290 480V142Q290 120 312 120H500" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 18" />

      {/* Direction arrow */}
      <g className={styles.arrow} filter="url(#fu-shadow)">
        <circle cx="290" cy="232" r="24" fill="#fff" />
        <path d="M290 215L276 244Q275 247 278 246L290 240 302 246Q305 247 304 244Z" fill="#e10600" />
      </g>

      {/* Start, with its tag */}
      <path d="M290 320H258" stroke="#e10600" strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="3 3" />
      <g filter="url(#fu-shadow)">
        <rect x="168" y="302" width="90" height="36" rx="18" fill="#fff" />
      </g>
      <text x="213" y="325.5" textAnchor="middle" className={styles.tagText}>{trip ? `${formatKm(trip.km)} km` : "You"}</text>
      <circle cx="290" cy="320" r="13" fill="#fff" filter="url(#fu-shadow)" />
      <circle cx="290" cy="320" r="7" fill="#e10600" />

      {/* Studio pin */}
      <circle className={styles.beacon} cx="500" cy="120" r="20" fill="#e10600" opacity=".25" />
      <g filter="url(#fu-shadow)">
        <path d="M500 122C500 122 478 98 478 82A22 22 0 0 1 522 82C522 98 500 122 500 122Z" fill="#e10600" />
        <circle cx="500" cy="81" r="8" fill="#fff" />
      </g>
      <g filter="url(#fu-shadow)">
        <rect x="376" y="148" width="150" height="36" rx="18" fill="#fff" />
      </g>
      <circle cx="396" cy="166" r="5" fill="#e10600" />
      <text x="460" y="170.5" textAnchor="middle" className={styles.tagStrong}>MECATRONIX</text>
    </svg>
  );
}

/* ---------- Section ---------- */

export function StudioDirections({ contact }: { contact: SiteContact }) {
  const [view, setView] = useState<"route" | "map">("route");
  const [addressIndex, setAddressIndex] = useState(0);
  const [locate, setLocate] = useState<Locate>({ state: "idle" });
  const [copied, setCopied] = useState(false);
  const status = useStudioStatus();
  const openDays = useMemo(() => parseDays(contact.businessHours.days), [contact.businessHours.days]);

  const addresses = contact.addresses.length ? contact.addresses : [contact.address];
  const address: SiteAddress = addresses[addressIndex] ?? addresses[0];
  const { lat, lng } = address;
  const trip = locate.state === "done" ? locate.trip : null;
  const mapQuery = lat !== undefined && lng !== undefined ? `${lat},${lng}` : [address.full, address.country].filter(Boolean).join(", ");
  const fullAddress = [address.street, [address.city, address.state, address.pincode].filter(Boolean).join(", "), address.country].filter(Boolean).join(", ");

  const findMe = () => {
    if (lat === undefined || lng === undefined || !navigator.geolocation) return setLocate({ state: "unavailable" });
    setLocate({ state: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocate({ state: "done", trip: estimateTrip(haversineKm(pos.coords.latitude, pos.coords.longitude, lat, lng)) }),
      (error) => setLocate({ state: error.code === error.PERMISSION_DENIED ? "denied" : "unavailable" }),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: the address is on screen to select
    }
  };

  const chooseAddress = (index: number) => {
    setAddressIndex(index);
    setLocate({ state: "idle" });
  };

  const tripNote =
    locate.state === "done"
      ? "≈ Estimated by road. Google Maps has the live route."
      : locate.state === "denied"
        ? "Location is blocked in your browser. Use Get directions instead."
        : locate.state === "unavailable"
          ? "Couldn't find your location. Use Get directions instead."
          : "Your location stays on your device.";

  return (
    <section id="find-us" className={styles.section} aria-labelledby="location-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}><span aria-hidden="true" /> FIND US</p>
          <h2 id="location-title">Find your way <span>to our studio.</span></h2>
        </div>
        <p className={styles.intro}>A place for good conversations and your next big idea. Drop by during studio hours, or call ahead and we&apos;ll have the coffee ready.</p>
      </header>

      <div className={styles.stage}>
        {/* ---------- Map ---------- */}
        <div className={styles.mapCard}>
          <div id="studio-map-display" className={styles.mapView}>
            {view === "route" ? (
              <RouteArt trip={trip} city={address.city} />
            ) : (
              <iframe title={"Mecatronix studio map — " + address.city} src={"https://www.google.com/maps?q=" + encodeURIComponent(mapQuery) + "&z=16&output=embed"} referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            )}
          </div>

          <div className={styles.mapTop}>
            <span className={styles.statusChip} data-open={status?.open || undefined}>
              <i aria-hidden="true" />
              {status ? (status.open ? <>Open now <small>· {status.note.replace("Open until", "until")}</small></> : <>Closed <small>· {status.note}</small></>) : address.city}
            </span>
            <div className={styles.viewSwitch} role="group" aria-label="Map display">
              <button type="button" aria-pressed={view === "route"} aria-controls="studio-map-display" onClick={() => setView("route")}><Route size={15} aria-hidden="true" /> Route</button>
              <button type="button" aria-pressed={view === "map"} aria-controls="studio-map-display" onClick={() => setView("map")}><Map size={15} aria-hidden="true" /> Map</button>
            </div>
          </div>

          <div className={styles.tripCard} aria-live="polite">
            <dl className={styles.tripStats}>
              <div><dt>Distance</dt><dd data-empty={!trip || undefined}>{trip ? <>{formatKm(trip.km)}<small> km</small></> : "—"}</dd></div>
              <div><dt>Arrival</dt><dd data-empty={!trip || undefined}>{trip ? trip.arrival : "—"}</dd></div>
            </dl>
            <div className={styles.tripAction}>
              {locate.state === "done" ? (
                <a className={styles.tripGo} href={address.directionsUrl} target="_blank" rel="noopener noreferrer"><Navigation size={15} aria-hidden="true" /> Start route</a>
              ) : (
                <button type="button" className={styles.tripLocate} onClick={findMe} disabled={locate.state === "locating" || lat === undefined}>
                  {locate.state === "locating" ? <LoaderCircle size={15} className={styles.spin} aria-hidden="true" /> : <Crosshair size={15} aria-hidden="true" />}
                  {locate.state === "locating" ? "Locating…" : "Use my location"}
                </button>
              )}
              <small>{tripNote}</small>
            </div>
          </div>
        </div>

        {/* ---------- Studio card ---------- */}
        <aside className={styles.card} aria-label="Studio address and directions">
          <div className={styles.cardHead}>
            <span className={styles.cardIcon}><Building2 size={22} aria-hidden="true" /></span>
            <div>
              <h3>{addresses.length > 1 ? address.label : "Mecatronix Studio"}</h3>
              <p>{[address.city, address.state].filter(Boolean).join(", ")}</p>
            </div>
          </div>

          {addresses.length > 1 && (
            <div className={styles.picker}>
              <label htmlFor="studio-address">Choose a studio</label>
              <div>
                <select id="studio-address" value={addressIndex} onChange={(event) => chooseAddress(Number(event.target.value))}>
                  {addresses.map((item, index) => <option value={index} key={item.label + index}>{item.label}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" />
              </div>
            </div>
          )}

          <div className={styles.block}>
            <p className={styles.blockLabel}><MapPin size={15} aria-hidden="true" /> Address</p>
            <address className={styles.address}>
              {address.street}
              <br />
              {[address.city, address.state, address.pincode].filter(Boolean).join(", ")}
              {address.country !== "India" && <><br />{address.country}</>}
            </address>
            <button type="button" className={styles.copy} onClick={copyAddress}>
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? "Copied" : "Copy address"}
            </button>
          </div>

          <div className={styles.block}>
            <p className={styles.blockLabel}><Clock3 size={15} aria-hidden="true" /> Studio hours</p>
            <ol className={styles.week} aria-label={`Open ${contact.hours}`}>
              {WEEK.map((d) => (
                <li key={d.name} title={d.name} data-open={openDays.has(d.i) || undefined} data-today={status?.day === d.i || undefined}>
                  <span aria-hidden="true">{d.short}</span>
                </li>
              ))}
            </ol>
            <p className={styles.hours}>
              <strong>{contact.businessHours.start} – {contact.businessHours.end}</strong> IST · {contact.businessHours.days.replace("-", " – ")}
            </p>
          </div>

          <div className={styles.block}>
            <p className={styles.blockLabel}><Phone size={15} aria-hidden="true" /> Reach us</p>
            <ul className={styles.reach}>
              {contact.phones.map((phone) => (
                <li key={phone.tel}><a href={"tel:" + phone.tel}><Phone size={14} aria-hidden="true" />{phone.display}{contact.phones.length > 1 && <small>{phone.label}</small>}</a></li>
              ))}
              {contact.emails.map((email) => (
                <li key={email.email}><a href={"mailto:" + email.email}><Mail size={14} aria-hidden="true" />{email.email}</a></li>
              ))}
            </ul>
          </div>

          <div className={styles.actions}>
            <a className={styles.primary} href={address.directionsUrl} target="_blank" rel="noopener noreferrer"><Navigation size={17} aria-hidden="true" /> Get directions</a>
            <a className={styles.secondary} href={address.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </aside>
      </div>

      <footer className={styles.footer}><span>BASED IN {address.city.toUpperCase()} · BUILDING EVERYWHERE</span><p>Come with an idea. Leave with a direction.</p></footer>
    </section>
  );
}
