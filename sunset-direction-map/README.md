# Sunset Direction Map

A single-page, phone-only tool: shows your current position on a satellite
map, draws the compass direction of tonight's sunset from where you're
standing, and marks known sunset-viewing spots. Built for testing on the
Île de Port-Cros, but it works anywhere — the sunset direction is computed
live from your actual GPS position and today's date.

This is a standalone project. It has no dependency on, and does not modify,
the rest of this repository — it's a single HTML file with no build step.

## What it shows

- **Blue dot** — your location (from the phone's GPS). Drag it if you want
  to nudge it, or if location access isn't available, tap the map once to
  place it manually.
- **Orange dashed line + 🌇** — the direction of tonight's sunset from your
  position, computed for today's date at your exact latitude/longitude
  (sunset azimuth shifts throughout the year, so this is recalculated live,
  not a fixed compass direction).
- **☀️ toggle (bottom-right)** — optionally shows *where the sun is right
  now*, if it's currently above the horizon.
- **👁 pins** — a seed set of known viewpoints on Port-Cros (see below).
- **📌 pins** — spots you add yourself by long-pressing the map. These are
  saved only in the phone's browser storage (`localStorage`) — nothing is
  uploaded or shared anywhere.
- **Bottom panel** — sunset/sunrise/golden-hour time, countdown to sunset,
  sunset bearing in degrees + compass label, and a distance-sorted list of
  all viewpoints (tap one to jump the map to it).

## About the Port-Cros viewpoints

I searched for named sunset spots on the island; there isn't much
dedicated "best sunset spot" writeup for Port-Cros specifically, so the
seed list is a mix of:

- **Plage de la Palud** — coordinates geocoded and confirmed. A wide bay
  open to the west; the easiest, flattest sunset view on the island.
- **Fort de l'Estissac**, **Fortin de la Vigie** (highest point, 199 m),
  **Fort de l'Éminence**, **Port-Man** — real, well-documented landmarks,
  but I could only place their coordinates *approximately* from written
  descriptions (map/geocoding lookups for these were blocked in my
  environment). They're marked "approximate" in their map popup.

Because of that, the map supports **long-press to drop your own pin**
anywhere — once you're actually on the island, correct any pin that's off,
or just add your own favorite spots. This also makes the app useful beyond
Port-Cros: drop pins for viewpoints anywhere you go.

## Getting it onto your iPhone (no App Store, no developer account)

This is deliberately just one HTML file — the simplest thing that works on
iOS without Xcode, TestFlight, or a paid developer account.

1. Get `index.html` onto your phone. Easiest options:
   - AirDrop it from a Mac.
   - Save it from this chat directly on your phone (if you're reading this
     on the phone, save the attached file to **Files**).
   - Email it to yourself and open the attachment.
2. In the **Files** app, tap the file, then use the **Share** button →
   **Open in Safari** (or just tap it — Safari usually opens `.html` files
   directly).
3. Allow location access when Safari prompts you. If it doesn't prompt, or
   you previously denied it, go to **Settings → Privacy & Security →
   Location Services → Safari Websites** and set it to "While Using".
4. Optional, for an app-like icon on your home screen: tap the **Share**
   button in Safari → **Add to Home Screen**.
5. You need an internet connection for the satellite map tiles to load
   (they're fetched live from Esri); GPS/location itself works without
   signal once you have a fix.

## Privacy

- Nothing about your location or your saved pins is sent anywhere — the
  page only talks to two public map-tile/basemap services (Esri satellite
  tiles) to draw the map. There's no backend, no account, no analytics.
- The file isn't hosted anywhere public — it lives on your phone. If you
  want a shareable link version later (e.g. to open with one tap instead of
  managing a file), that's a separate step we can add on request.

## Notes / limitations

- Sunset direction assumes a flat sea horizon; actual visibility also
  depends on terrain, weather, and haze.
- Map requires internet connectivity (satellite imagery is streamed, not
  bundled offline).
- Built with [Leaflet](https://leafletjs.com/) and
  [SunCalc](https://github.com/mourner/suncalc) via CDN — no install step,
  no dependency on the rest of this repo.
