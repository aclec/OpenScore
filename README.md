# OpenScore

A native (iOS / Android) score-tracking app for card and board games,
built with [Expo](https://expo.dev). Free counter mode for anything, plus typed
per-game rules (point caps, round limits, auto-fill, …).

> **Open source — contributions welcome.** Adding your favourite game is a small,
> self-contained PR: one file. See [Adding a game](#adding-a-game).

## Stack

| Concern         | Choice                                       |
| --------------- | -------------------------------------------- |
| Package manager | **bun**                                      |
| Framework       | Expo SDK **56** (New Architecture on)        |
| Language        | TypeScript (strict)                          |
| Navigation      | `expo-router` (file-based, in `src/app/`)    |
| Styling         | **uniwind** (Tailwind v4) — _not_ NativeWind |
| Native UI       | `@expo/ui` (SwiftUI / Jetpack Compose)       |
| KV store        | `react-native-mmkv` — active game + prefs    |
| Database        | `expo-sqlite` — finished-game history         |

## Getting started

`react-native-mmkv` and `@expo/ui` need a **dev build** — Expo Go won't work.

```bash
bun install
bun run ios       # or: bun run android
bun start         # dev server once a build is installed
```

Other scripts:

```bash
bun run typecheck   # tsc --noEmit
bun run lint        # eslint .
bun run format      # prettier --write .
```

## Project structure

All app code lives under `src/`; only build config sits at the root.

```
src/
  app/            # expo-router routes
    (tabs)/       # bottom tabs: games list + settings
  components/     # reusable UI (*.ios / *.android native variants)
  games/          # ⭐ game rules — one file per game (see below)
  db/             # expo-sqlite: client, schema, queries
  store/          # MMKV + game state
  lib/            # pure domain helpers & types
```

Path alias: `@/*` → `src/*`.

## Adding a game

A game is a single typed [`GameRule`](src/games/types.ts). All scoring caps are
**optional** — set only what your game needs; the UI adapts to every combination.

### `GameRule` fields

| Field            | Required | Meaning                                                                          |
| ---------------- | :------: | -------------------------------------------------------------------------------- |
| `id`             |    ✅    | Unique slug, e.g. `"papayo"`.                                                     |
| `name`           |    ✅    | Display name.                                                                    |
| `description`    |    ✅    | One-line summary shown in the picker.                                            |
| `minPlayers`     |    ✅    | Minimum players.                                                                 |
| `maxPlayers`     |    ✅    | Maximum players.                                                                 |
| `scoreDirection` |    ✅    | `"asc"` = highest total wins, `"desc"` = lowest total wins.                      |
| `maxRoundScore`  |          | Cap on the **sum of one round** (manche). Powers `autoFillLast`.                 |
| `maxGameScore`   |          | Target/cap on a player's **running total** that ends the game (partie).          |
| `maxRounds`      |          | Max number of rounds (manches) before the game ends.                             |
| `autoFillLast`   |          | When `true`, the last unscored player in a round is auto-suggested so the round sums to `maxRoundScore`. |
| `allowNegative`  |          | Allow negative score entries.                                                    |

The three caps are independent and any combination is valid:

- **none** → free play (no progress bar, no auto-fill).
- **`maxRoundScore`** → per-round auto-fill (e.g. Papayo: every round totals 250).
- **`maxGameScore`** → progress bar tracks the leading total; game ends when reached.
- **`maxRounds`** → no new round is offered past the limit; progress tracks rounds played.

### Steps

1. Create `src/games/<your-game>.ts`:

   ```ts
   import type { GameRule } from "./types";

   export const tarot: GameRule = {
       id: "tarot",
       name: "Tarot",
       minPlayers: 3,
       maxPlayers: 5,
       scoreDirection: "asc",
       maxRounds: 10,
       allowNegative: true,
       description: "10 donnes. Le plus de points gagne.",
   };
   ```

2. Register it in [`src/games/index.ts`](src/games/index.ts):

   ```ts
   import { tarot } from "./tarot";
   // …
   export const GAMES: GameRule[] = [papayo, tarot];
   ```

3. Verify it builds and the picker/scoreboard behave:

   ```bash
   bun run typecheck && bun run lint
   ```

4. Open a PR. Keep it to the one new file + the one-line registry edit. Mention the
   real-world rules you modelled (point cap, number of rounds, win direction).

### Conventions

- **~150 lines per file max** — split aggressively.
- Style with uniwind `className` (typed via the Metro-generated `uniwind-env.d.ts`).
- Safe areas use uniwind classes (`pt-safe`, `px-safe`, …) — never wrap screens in `SafeAreaView`.
- Storage split: the in-progress game lives in MMKV (synchronous writes on every score); finished games go to SQLite as one JSON document per row; small preferences use MMKV.

## License

[GNU AGPL v3](LICENSE).
