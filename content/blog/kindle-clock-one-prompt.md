---
title: "The Kindle clock, one prompt later"
description: "Draft outline. A Kindle departure clock that did not come together last year, and one prompt that produced a working clock this year. Repo facts are filled in; the personal blanks are TODO."
date: 2026-10-24
draft: true
slug: kindle-clock-one-prompt
---

This is a draft outline for a short article, not the finished piece. Blocks marked **TODO** are blanks. They are empty on purpose: nothing in them was guessed.

## Hook

Last year I tried to make a departure-board clock on a Kindle. It did not work. This year I wrote one prompt, and an agent built the clock.

> **TODO:** The opening image — where the Kindle sits, and why a departure board. No invented scene.

> **TODO:** One sentence on the shift in the tools, in your own words. No metrics, and no quotes you do not have.

## Last year's attempt

> **TODO:** When this was (month and year) and which Kindle you used.

> **TODO:** What you were trying to build, and the route you took (jailbreak, KUAL, an existing extension, your own code, or something else).

> **TODO:** What failed. The error, the missing piece, or the moment you stopped. Fill this from memory or notes only.

> **TODO:** What, if anything, you kept — a binary, a script, a note, or nothing.

## This year's single-shot prompt

The public repo [shreemit/kindle-departure-clock](https://github.com/shreemit/kindle-departure-clock) starts with a commit on 17 Aug 2026 (UTC): "Add PW3 Clock, an airport split-flap clock for Kindle Paperwhite 3." That commit is authored by shreemit and co-authored by Cursor. The prompt is not in the repo.

> **TODO:** Paste the prompt you actually sent, unedited.

```text
TODO: paste the single-shot prompt here.
```

> **TODO:** Say what "single-shot" means here. One message with no corrections, or one session that ended with a clock you could install? Note anything you fixed by hand before it ran on the device.

## What the clock does

The repo describes it as an airport split-flap clock for a jailbroken Kindle Paperwhite 3 (7th gen, firmware 5.16.2.1.1).

It is a KUAL extension. In the menu it is **PW3 Clock**, and it installs to `extensions/pw3clock`. The README says it needs no SSH, and no WiFi except to refresh the weather. The Kindle's own clock is the time source. Starting the clock stops the Kindle UI and rotates the framebuffer to landscape; you turn the device sideways. Three taps anywhere stops it. If that does not respond, the README also lists holding power for about 10 seconds, or creating an empty `pw3clock.STOP` file on the drive.

FBInk draws the board. Flap corners are square, because FBInk draws rectangles. The face uses the Jersey 25 font.

### The face

From the README's current layout:

- A caps date (`DATE_FORMAT` default `%a %d %b %Y`) and a battery percentage.
- Four split-flap digits. The default `TIME_FORMAT` is 12-hour (`%I:%M`), with AM/PM under the colon. `%H:%M` is the 24-hour face, with no AM/PM marker.
- A primary weather row: feels-like, air temperature, and rain.
- Wind and humidity as secondary readings, plus a footer with the condition. The README's sketch of that line is "OVERCAST · TAP 3X TO QUIT". The numbers in that sketch are a sample drawing, not a reading.

<figure class="blog-figure blog-figure--empty">
  <div class="blog-figure-frame">TODO · PHOTO</div>
  <figcaption>TODO: the Kindle Paperwhite, landscape, with the clock running. A photo you take — not a generated stand-in.</figcaption>
</figure>

### Weather, rain, and the redraw

Weather is one request to [Open-Meteo](https://open-meteo.com/) per refresh: current conditions plus 12 hours of 15-minute precipitation (HRRR over the US). No API key. Metric only. The default coordinates in `config.sh` are South Lake Union, `47.62409`, `-122.33567`. If Open-Meteo fails, the clock falls back to wttr.in. If both fail, the previous values stay on screen. When `WEATHER_WIFI=1`, WiFi comes up for the fetch and the radio is then turned off.

The rain column, as the README describes it:

| On screen | Meaning |
| --- | --- |
| `RAIN` / `NOW` | Raining |
| `DRIZZLE` / `NOW` | What the README calls fine Seattle rain |
| `RAIN` / `9PM` | Dry now. The hour the next rain starts, minutes floored. A 9:30 slot is `9PM`. A 24-hour face uses `21H`. |
| `DRY` / `CLDY` | No rain in the next 12 hours, overcast |
| `DRY` / `CLEAR` | No rain in the next 12 hours, not overcast |

`WEATHER_EVERY` defaults to 180 minutes. Fetches are skipped during quiet hours (`QUIET_START` / `QUIET_END`, default 03:00–07:00).

A tick repaints only the regions whose text changed: a flap digit, the AM/PM marker, the date, the battery, the weather box, or the footer. The first paint is a full redraw. A flashing full refresh still runs every `FULL_REFRESH_EVERY` minutes during the day (default 60) to clear e-ink ghosting, and that flash is skipped while quiet. Between ticks the script can suspend to RAM (`USE_SUSPEND` defaults to 1). The README's battery line is "roughly several days" with suspend on. That is the project's wording, not a measurement added for this draft.

A desktop preview renders the same layout to a PNG without touching the Kindle: `sh tools/preview.sh out.png`.

<figure class="blog-figure blog-figure--empty">
  <div class="blog-figure-frame">TODO · PHOTO</div>
  <figcaption>TODO: the rain column showing an hour (or NOW), or a PNG from <code>tools/preview.sh</code>. Use a real frame from the device or the preview.</figcaption>
</figure>

## What changed in agents

The repo does not measure this. Co-authored-by trailers put Cursor on the commits. They do not say what an agent could not do last year.

> **TODO:** What you could not get an agent to do on the failed attempt. Name the concrete tasks — device constraints, tool use, staying inside one codebase, or whatever you actually hit.

> **TODO:** What was different this year. Name the product and the model if you remember them. No benchmark numbers you did not run, and no quotes you did not hear or read.

> **TODO:** One comparison that is yours. A step from last year that this year's agent handled, or a step you still had to do yourself.

## Follow-up iterations

The first commit was not the last word. This is the public history as of 24 Oct 2026. Dates are UTC. How each change was prompted is still a blank.

> **TODO:** For each item, a line on whether it was another agent prompt, a hand edit, or both — and what you had to correct.

- **17 Aug 2026** — [First commit](https://github.com/shreemit/kindle-departure-clock/commit/a642040). The message says existing KUAL clock extensions target other Kindle models and fail on a Paperwhite 3 running firmware 5.16.2.1.1, which that message calls the last soft-float firmware. The project bundles a matching-ABI FBInk binary, detaches from KUAL so it keeps running after the Kindle UI stops, and ships a desktop preview that reproduces FBInk's failure modes.
- **18 Aug 2026** — [PR #1](https://github.com/shreemit/kindle-departure-clock/pull/1), "Rebuild the board around feels-like, air temp and rain." The commit says the old face spent its space on a long date and a humidity reading, and that feels-like, air temperature, and rain became the primary row.
- **21 Aug 2026** — [PR #2](https://github.com/shreemit/kindle-departure-clock/pull/2), "Board hierarchy refresh and battery-saving quiet hours." The commits say they cut battery drain with quiet hours, hourly weather, and suspend by default, and that they show the battery percentage beside the header icon. The weather interval changed again in PR #4.
- **3 Sep 2026** — [PR #3](https://github.com/shreemit/kindle-departure-clock/pull/3), "Open-Meteo 15-minute rain timing and board updates." The commits say wttr.in's coarse hourly rain chance left the board stuck on DRY/CLEAR, so weather moved to Open-Meteo (HRRR 15-minute precipitation, with wttr.in as the fallback). Unused Barlow and Press Start fonts were removed; the board uses Jersey 25. Rain more than two hours out was labeled as an hour only, because a quarter-hour label such as 6:15PM was hard to read on the flap.
- **24 Oct 2026** — [PR #4](https://github.com/shreemit/kindle-departure-clock/pull/4), "Slower weather refresh, clock-time rain, partial redraw." The weather fetch defaults to every 180 minutes. Upcoming rain is the hour the next wet slot starts, with the minutes floored: a 9:30 slot is `9PM` on a 12-hour face and `21H` on a 24-hour face. Minute ticks repaint the regions that changed instead of clearing the whole panel. The same PR removes the `agent_dbg` debug logger, including a macOS debug path it wrote on every tick.

## Takeaways

> **TODO:** Two or three sentences you actually believe. Starting points, to keep or delete: the useful test was a clock with a real device constraint; the single prompt got a clock onto the Kindle, and the later pulls (rain timing, a slower weather fetch, partial redraw) are the rest of the work; name what still had to be true outside the model — the jailbreak, KUAL, a matching FBInk binary, a preview you could check.

> **TODO:** What you want someone who builds with agents to take from this. Only if you have a point to make.

## Sources

"What the clock does" and "Follow-up iterations" were checked against the public repo on 24 Oct 2026: the README, `config.sh`, the repo description, the first commit, and merged pull requests #1 through #4. Last year's failure, the prompt text, and any claim about how agents changed are still TODO. No metrics or quotes were added for this draft.
