# Meridian — a free GeoGuessr-style game

A single-player, static-image geography guessing game. Five rounds, 60
seconds each, score out of 1000 per round based on how close your map
pin lands to the real location (linear falloff to 0 at 1000km away).

No API keys required out of the box.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a static
`dist/` folder you can host anywhere (Netlify, Vercel, GitHub Pages, a
plain S3 bucket — it's just static files).

## How images are sourced (and why it's provider-agnostic)

Every image source implements the same tiny interface
(`src/providers/ImageProvider.js`):

```js
class SomeProvider extends ImageProvider {
  async getLocations(count) {
    // return [{ id, imageUrl, lat, lng, attribution, source }, ...]
  }
}
```

The game only ever calls `provider.getLocations(5)`. It has no idea
whether those five photos came from one API or three. That's what
makes it easy to swap or combine sources.

Shipped providers:

- **`WikimediaProvider`** (default, primary) — live geosearch against
  Wikimedia Commons, which is a genuinely large and constantly growing
  pool of geotagged photos. No key needed, CORS-enabled.
- **`LandmarkProvider`** (default, fallback) — a short list of famous,
  reliably-available landmarks fetched via Wikipedia's API. Used to
  pad out a round if the live provider comes up short (rate limit,
  offline, thin coverage in a region), so a game session never breaks.
- **`MapillaryProvider`** (optional, off by default) — true
  street-level photography via Mapillary's Graph API. Needs a free
  client token from https://www.mapillary.com/dashboard/developers.

They're combined in `src/providers/MultiProvider.js`, which tries each
provider in order and only asks the next one for whatever shortfall
remains — so you can layer as many sources as you want and the game
always ends up with a full set of rounds.

### Adding your own provider

1. Create `src/providers/MyProvider.js` extending `ImageProvider`.
2. Register it in `src/providers/index.js`'s `buildDefaultProvider()`.

That's the only file that needs to change.

### Enabling Mapillary

```js
// src/App.jsx
const provider = buildDefaultProvider({ mapillaryToken: 'YOUR_TOKEN' });
```

## Performance notes

- **Leaflet ships in its own chunk** (`vite.config.js` manual chunk)
  so the start screen paints before the map library is even
  downloaded.
- **Images are preloaded ahead of time.** The first round blocks
  briefly on its own image so there's no pop-in; rounds 2–5 preload
  silently in the background while you're still looking at an earlier
  round, so transitions between rounds are instant.
- **The guess map stays small (peek mode) until you interact with it**,
  then expands — it only renders at full size when you're actually
  using it.
- **`preferCanvas` on the Leaflet map** and a single shared map
  component (`WorldMap.jsx`) for both guessing and the result review,
  so nothing expensive gets mounted twice.

## Game structure

```
src/
  App.jsx                 — state machine: start → playing → round-result → final
  components/
    StartScreen.jsx
    GameScreen.jsx         — HUD, timer, photo, guess panel for one round
    ImageStage.jsx         — full-bleed photo w/ fade-in
    Timer.jsx              — 60s countdown
    GuessPanel.jsx         — collapsible map overlay for placing a pin
    WorldMap.jsx           — shared Leaflet map (guess mode / result mode)
    ResultScreen.jsx       — per-round score + map comparison
    FinalScreen.jsx        — total score + round-by-round recap
  providers/               — the API-agnostic image source layer (see above)
  utils/
    geo.js                 — haversine distance + scoring
    preload.js             — image preloading/caching
```

## Known trade-offs

- Wikimedia Commons image quality/framing varies more than a purpose-built
  street-view dataset — some results will be more "landmark photo" than
  "random street corner." Add a Mapillary token for more authentic
  street-level randomness.
- No backend, no accounts, no multiplayer — this is a local single-player
  build. Leaderboards/multiplayer would need a small backend (e.g.
  Supabase) layered on top of the existing round/scoring logic.
