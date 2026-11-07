# DekolonizArt — owner requirements audit

Audit baseline: 7 November 2026. This document is kept with version 3 so the
implementation and the remaining owner decisions stay traceable.

## Audit snapshot before the current completion pass

| # | Requirement | Current implementation | Status | Gap / required change | External dependency |
|---:|---|---|---|---|---|
| 1 | Identity, history, values, vision, objectives | `/about` contains mission, vision, ambition, values; `/history` contains a timeline; media and FAQs are present | COMPLETE | Keep extending existing information architecture | Owner copy/media can still enrich it |
| 2 | DekolonizArt site identity / URL | Metadata, canonical links, sitemap and OG URLs use `NEXT_PUBLIC_SITE_URL`, defaulting to `https://dekolonizart.com` | PARTIAL | Deployment must set the production URL; no DNS change is possible from this repository | Hosting/DNS and final canonical URL |
| 3 | Maintainable content updates | Content is structured in TypeScript (`content/*`) but there is no CMS/admin/API | PARTIAL | Document the limitation; keep reusable models and avoid duplicating records | CMS/hosting decision if non-code editing is required |
| 4 | Movement & Dance classes/workshops | Page exists, but it currently lists productions and has no reusable class/workshop schedule model | PARTIAL | Add an activity model and render the confirmed workshop data without inventing dates | Owner schedules, prices, teachers and registration links |
| 5 | Class/workshop booking | Production booking architecture exists; workshop registration is only a contact CTA | PARTIAL | Reuse a typed registration model for activities | Provider URL/capacity/price where applicable |
| 6 | Ticketing / Vibetix | One booking route per production; Vibetix URL is typed/configurable and absent values fall back to email | PARTIAL | Preserve architecture and make missing configuration explicit | Real per-event Vibetix URLs/IDs |
| 7 | Terms of sale | No route in v3; no approved legal copy | MISSING | Add a clearly marked publication placeholder route | Approved legal text |
| 8 | Refund policy | No route in v3; FAQ wording is not an approved policy | MISSING | Add a clearly marked publication placeholder route | Approved legal text and conditions |
| 9 | Brevo newsletter | Footer validates locally only; no server endpoint | PARTIAL | Add secure server boundary and consent/error states | `BREVO_API_KEY`, numeric `BREVO_LIST_ID` |
| 10 | Donation | Home support component exists; no dedicated page or configured destination | PARTIAL | Add `/support` and keep destination unconfigured until supplied | Donation provider/account URL |
| 11 | Community | No v3 route; no Signal/WhatsApp/signup model | MISSING | Add `/community` with email entry point and explicit pending channel links | Signal/WhatsApp invite URLs |
| 12 | Performances/projects | Productions, detail pages, cast, plot, poster, YouTube intro and booking exist | PARTIAL | Extend optional media/programming model without inventing project data | Organizer/programmer copy and assets |
| 13 | Performance media | Image/poster and YouTube intro are supported; no general audio/media collection | PARTIAL | Establish optional typed media model and render only configured media | Audio/video assets and rights |
| 14 | Artists/cast | Single `artists` source, project cast references, deep links to `/artists#slug` | COMPLETE | Keep one artist record source; enrich only with supplied information | Missing biographies/photos where applicable |
| 15 | Partners/references/coaches | Clickable partner logo data exists; no reference page or coach model | PARTIAL | Add `/references` using the existing partner source and an empty coach state | Coach details and descriptions |
| 16 | Team | `/the-team` exists with names, photos and translated roles | PARTIAL | Keep current page; report missing biographies/responsibilities and stock portraits | Approved team bios/roles/photos |
| 17 | Partner logo animation | v3 uses two static logo assets and no animation implementation | NOT APPLICABLE | No animated defect exists in this version; do not disable a feature that is not present | None confirmed |
| 18 | Clickable partner logos | Existing partner logos link to the two configured real URLs | COMPLETE | Harden external-link accessibility/security if needed | Any future partner URLs |
| 19 | Upcoming events | Shared `agenda`/`productions` source, searchable event page, separate booking/info actions | PARTIAL | Add explicit status/date-ready fields; current agenda dates are display strings | Structured dates for all events |
| 20 | Past event archive | No dedicated archive and no confirmed past event dataset | MISSING | Add archive-ready model/filters only when real historical records exist | Past event data/media |
| 21 | Event status logic | Agenda is ordered/static and date labels are strings; no deterministic status computation | PARTIAL | Add optional structured schedule/status override model without changing existing copy | Confirmed date/time/timezone data |
| 22 | Photos/video storytelling | Authentic posters, workshops, portraits and YouTube intro are used | COMPLETE | Continue using supplied assets only | Additional approved media |
| 23 | EN/DE/FR | Locale routing and typed dictionaries exist; existing copy is translated or marked language-specific | PARTIAL | Translate all newly added UI; flag legal/owner copy that is absent | Approved translations/legal copy |
| 24 | Reusable content models/relationships | Production→artists and event→production exist; activities/references/support are incomplete | PARTIAL | Add missing lightweight models and preserve relationships | Owner data |
| 25 | Content editability | TS data files require code/deploy; no backend/admin | PARTIAL | Include an accurate editability table and recommendation | CMS/backend decision |
| 26 | Contact/professional inquiries | Contact page provides artistic/production email and venue; project pages have booking CTAs | COMPLETE | Keep contact-first decision; do not add an unrequested generic form | Additional department contacts if supplied |
| 27 | No invented business data | Current missing values are represented as null/TBA/pending in core flows | COMPLETE | Continue using explicit unconfigured states | Owner must supply real values |
| 28 | Security | No client-side secrets; booking hands off to provider; YouTube URLs validated | PARTIAL | Add server-only Brevo endpoint and safe external-link handling | Brevo credentials/provider configuration |
| 29 | Responsive behavior | Existing CSS is responsive and accessible across current pages | PARTIAL | Validate new pages/activities at required breakpoints | Browser/device QA |
| 30 | Accessibility | Skip links, semantic headings, keyboard menus, reduced motion, alt text and focus handling exist | PARTIAL | Carry the same patterns into new controls/routes | Manual assistive-tech review |

## Content editability report

| Content type | Current storage | Editable without code? | Recommended action |
|---|---|---:|---|
| Pages / copy | Typed locale dictionaries | No | Keep typed dictionaries short term; choose CMS only with an owner-approved content workflow |
| Events | `content/agenda.ts`, `content/events.ts`, production records | No | Add structured date/status fields; later move to CMS/API if needed |
| Artists | `content/artists.ts` | No | Keep one source; later expose through CMS if non-code editing is a priority |
| Team | `content/team.ts` + locale roles | No | Add optional bio/responsibility fields only when supplied |
| Projects | `content/productions.ts` + locale show copy | No | Extend optional media/programming fields; no duplicate project records |
| Workshops/classes | Activity data model to be added | No | Use one activity model, then decide whether it belongs in a CMS |
| Partners/coaches | `content/media.ts` for partners; coaches absent | No | Reuse partner records and add coach records when supplied |
| Videos | Production YouTube intro field | No | Keep provider-aware media model; do not render empty players |
| Images | `public/img` + typed asset references | No | Keep asset metadata together; later use media library/CMS if needed |
| Newsletter | Footer form; Brevo boundary to be added | Provider-managed | Configure server environment and list ID |
| Donation settings | Support config to be added; currently unconfigured | No | Store provider URL in server-safe config/env, never invent account details |
| Booking URLs | Production `booking` records | No | Set one real URL per event/activity; preserve provider field |

The repository does not currently contain a real CMS or admin backend. Structured
TypeScript files are maintainable source data, but they are not a CMS.

## Owner input still expected after implementation

Only values absent from the repository should remain here. The final section of
this file will be updated after the implementation pass with the exact list.

## Implementation completed in version 3

### Pages created

- `/support` — donation architecture with an explicit unconfigured state and a contact path.
- `/community` — separate community e-mail signup path plus Signal/WhatsApp placeholders.
- `/references` — reuses the canonical partner records and exposes the empty coach state.
- `/terms-of-sale` and `/refund-policy` — publication placeholders that do not present invented legal policy as approved copy.

### Features and models updated

- The home support section now visually fades into the black footer with no terracotta seam; the existing footer rule remains available on other pages.
- Service headers and offer bands were aligned with the requested version 1 / version 4 visual direction while remaining responsive to version 3.
- Movement & Dance now has a reusable `Activity` model for classes/workshops, including format, schedule, location, price, capacity, registration provider and URL. The confirmed `Theater & Geschichte` workshop is rendered; movement class data remains empty until supplied.
- Production data now has an optional `ProductionMedia` model for image, YouTube video and audio excerpts. The detail page renders only configured media and never creates empty players.
- Newsletter signup now has a server-only `/api/newsletter` Brevo boundary, consent checkbox, loading state and clear unavailable/provider error states. No credential is shipped to the browser.
- The `/events` page no longer renders a second in-house event list/search. VibeTix is now the single visible ticketed-event catalogue there; the existing structured event data remains available to the home, theatre and movement presentation views where it serves editorial context rather than duplicating the ticket catalogue.
- Footer navigation and sitemap include the new routes. Partner logos remain sourced once from `content/media.ts`, are clickable, and use safe external-link attributes.

### Final acceptance matrix

| Requirement | Final status | Evidence / remaining gap |
|---|---|---|
| Identity, history, values, vision, objectives | COMPLETE | Existing `/about` and `/history` cover the requested information architecture. |
| Site URL / DekolonizArt identity | PARTIAL — external deployment | `site.url`, metadata, canonical links, robots and sitemap use `NEXT_PUBLIC_SITE_URL`; hosting/DNS still need confirmation. |
| Editable content architecture | PARTIAL — no CMS | Structured TypeScript source data is reusable, but no admin/CMS exists. |
| Dance & Movement | PARTIAL — owner schedule needed | Activity model and confirmed workshop are present; no confirmed movement class schedule exists. |
| Workshop booking | PARTIAL — URLs/data needed | Registration provider/URL/capacity/price fields exist; current workshop uses e-mail fallback with no URL. |
| Vibetix ticketing | PARTIAL — provider configuration needed | The catalogue embed is integrated on `/events`; the supplied HTML/iframe embed is integrated on Douala Manga Bell. VibeTix currently refuses the cross-origin iframe with `X-Frame-Options: SAMEORIGIN`; a visible new-tab fallback remains available. |
| Terms of Sale | BLOCKED — legal copy needed | Route exists as an explicit legal-review placeholder. |
| Refund Policy | BLOCKED — legal copy needed | Route exists as an explicit legal-review placeholder. |
| Brevo | PARTIAL — environment needed | Secure server boundary is implemented; `BREVO_API_KEY` and `BREVO_LIST_ID` are absent. |
| Donation | COMPLETE for the site integration | WhyDonate’s supplied widget is integrated on `/support`; its Donate button was verified in the browser and WhyDonate owns the donation options/payment flow. |
| Community | PARTIAL — invite links needed | Route, e-mail signup and pending channel states exist; Signal/WhatsApp URLs are null. |
| Performance / Projects | PARTIAL | Existing production pages are professional starting points; programming/organizer material is not supplied. |
| Performance media | PARTIAL | Typed image/video/audio model and conditional renderer exist; no audio/project media data is supplied. |
| Theatre / Artists | COMPLETE for current data | Shared artist source and project-to-artist deep links work; missing artist records remain owner content. |
| Memo / references / coaches / partners | PARTIAL | References route and canonical partner records exist; coaches and richer descriptions are absent. |
| Team | PARTIAL | Names/photos/roles exist; biographies/responsibilities and some authentic portraits are still missing. |
| Animated partner logo issue | NOT APPLICABLE in v3 | v3 has static logos and no animation implementation to debug. |
| Clickable partner logos | COMPLETE | Both configured partners link to their real URLs with accessible labels and safe external links. |
| Upcoming events | PARTIAL | `/events` now uses the VibeTix catalogue for ticketed events; editorial production views still use the shared agenda source and separate booking/info actions. Dates remain display strings. |
| Past-event archive | BLOCKED — history data needed | No confirmed past-event records/media exist to publish without inventing content. |
| Event status logic | PARTIAL — structured dates needed | Current entries use translated display strings/TBA/recurrence; deterministic status cannot safely be inferred for all events yet. |
| Photos/video storytelling | COMPLETE for available assets | Existing authentic posters, workshop photos, portraits and YouTube videos are used; no stock media added. |
| EN / DE / FR | COMPLETE for changed interface | New route and UI strings are typed and translated in all three dictionaries; owner/legal source copy remains pending. |
| Content relationships | PARTIAL | Production→artists and event→production exist; activity/reference/support models now exist, while CMS persistence does not. |
| Contact / professional inquiries | COMPLETE | Contact page exposes artistic/production e-mail and venue; no generic form was reintroduced. |
| Security | COMPLETE for implemented boundary | Brevo is server-only, external links are hardened, YouTube URLs are validated, and no payment flow was fabricated. |
| Responsive/accessibility review | PARTIAL — manual QA remains | Existing patterns plus responsive CSS and semantic controls are preserved; full device/screen-reader QA remains external/manual. |

## Owner input still required

- Confirm the production canonical URL and set `NEXT_PUBLIC_SITE_URL` in hosting; DNS/domain changes are outside this repository.
- Provide `BREVO_API_KEY` and `BREVO_LIST_ID` in the server environment.
- Provide Signal and/or WhatsApp community invite URLs.
- Provide the Vibetix URL/ID for each ticketed production/event, if Vibetix is the intended provider.
- Confirm that the Douala Manga Bell event and its ticket inventory are published and associated with the supplied VibeTix embed. The catalogue currently returns `no_events_found`, and the direct HTML/iframe endpoint receives `X-Frame-Options: SAMEORIGIN`; VibeTix must enable cross-origin embedding for that event URL or the visible fallback link will remain the reliable checkout path.
- Provide approved Terms of Sale and Refund Policy copy, plus approved translations if they must be published in German and French.
- Provide confirmed movement/class dates, instructor, location, price, capacity and registration URL(s). The existing workshop only has the confirmed by-arrangement schedule, location and free price.
- Provide past-event records (dates, venues, recaps, artists and media) for a real archive.
- Provide project programming materials for theatres, cultural institutions, organizers and curators, plus any approved image/video/audio assets and usage rights.
- Provide missing artist/team biographies, responsibilities, authentic portraits and project roles where required.
- Provide coach records and descriptions. The named Borchert Schule and GLS Treuhand references are not present in the repository; supply their confirmed relationship, copy, logos and URLs if they must appear.
- Replace the current generic social-network home URLs with the confirmed DekolonizArt profile URLs.
