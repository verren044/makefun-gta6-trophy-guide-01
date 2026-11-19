[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/verren044/makefun-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/verren044/makefun-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Platinum — GTA VI Trophy Guide & Tracker

An offline, open-source guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI: **1 platinum, 2 gold, 6 silver, 46 bronze**, 28 of them hidden on PlayStation until earned. No online trophies — every one is single-player.

## What it does

- **Checklist of all 55 trophies** with the official name, description and grade for each, plus a guide in our own words and its sources (Exophase, PSNProfiles, Output Lag) in the detail panel. Steps that go beyond the official description are marked as our own reading, unverified in-game.
- **Tracker**: tick trophies off and progress is saved in the browser (localStorage), with **export and import** of progress as JSON.
- **Filters**: by kind (story, missable, collectibles, activities, stranger missions, crime, money, exploration, online), by grade, by search text, and earned / to-do views. The Online filter shows a note that there are no online trophies.
- **Spoiler setting**: hides the name, description and guide of the 28 hidden story trophies until they are earned.
- **Roadmap to Platinum in 4 stages**: story first, then opening up Leonida, then the post-story clean-up, then 100% and the platinum — built from the official descriptions.
- **Missables page**: 15 missable trophies with notes. GTA VI has no mission replay, so a trigger tied to a story moment or a stranger strand cannot be re-done — only a reloaded save or a new playthrough brings it back. The one confirmed missable is Positive Mental Attitude (a Chapter 1 meditation).

## Run it offline

Serve `app/` with any static file server and open `index.html` — it fetches nothing and works with the network off:

```sh
cd app && python3 -m http.server 8080   # serves app/ on http://localhost:8080
```

Or open the folder with any static server of your choice. Progress lives only in your browser unless you export it.

## Layout

- `app/index.html` — the shell: header with progress, tabs, filters, detail panel
- `app/css/style.css` — the whole look (dark sunset theme, our own)
- `app/js/main.js` — boot, routing, wiring
- `app/js/store.js` — localStorage progress, export and import
- `app/js/filters.js` — kind / grade / search / earned filters and the spoiler rule
- `app/js/views.js` — checklist, detail panel, roadmap, missables
- `app/data/trophies.json` — the 55 official trophies with guides and sources
- `main.ts` — hands the entry in: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored library
- `screenshots/` — four real renders of the app (checklist with The Shootist open, roadmap, missables, spoiler-safe)

## Sources

- Trophy names, descriptions, grades and PSN progress targets: [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi)
- How-to details and missable warnings: [Output Lag — GTA 6 Trophy List](https://outputlag.com/guides/gta-6-trophy-list/)

Guides are written for this entry in our own words and cite their sources; nothing is copied from another guide. No Rockstar logo or official artwork is used.

## License

MIT — see [LICENSE](LICENSE).
