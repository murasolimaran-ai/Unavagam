# Kaveri Palms Estate — Coastal Club UI & Experience Redesign

Transforms **Kaveri Palms Estate** from a minimalist utility layout into an atmospheric **Modern Dark-Hero Coastal Club** experience across both the customer website and the unified admin dashboard, combining a full-bleed dark hero and quick-booking bar with an interactive editorial service showcase, estate gallery, and elevated operational surfaces.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Confirmed preferences from user clarification:
> - **Visual Direction**: Modern dark-hero coastal club with bold typography (`Plus Jakarta Sans` display headlines + `DM Sans` body + `JetBrains Mono` tabular figures).
> - **Scope**: Redesign both the **customer website** and the **unified admin dashboard**.
> - **Homepage Architecture**: Hybrid layout blending a **full-bleed dark hero with quick booking bar and photo gallery** alongside an **editorial story layout with interactive service showcase**.

---

## 1. Overview & Core Concept

- **What It Does**: Elevates the visual craft, spatial hierarchy, and interactive flow across all customer journeys (Turf Arena, Boutique Resort, Courtyard Kitchen, My Bookings, Profile) and the centralized Super Admin Console while preserving 100% of existing business logic, `localStorage` persistence, and live availability locks.
- **Target Audience / Persona**:
  - *Guests & Sports Captains*: Expecting the polish of a real coastal resort and sports club—immersive photography, clear tariff comparisons, frictionless search-to-checkout, and transparent booking tracking.
  - *Estate Operations & Super Admin*: Requiring an authoritative, high-scannability command console with refined dark-navy navigation, crisp tabular KPIs, and clean data tables.
- **Key Value**: Bridges visual desirability (real hospitality brand presence) with operational precision (zero double-booking turf locks, real-time date-overlap room inventory, and live kitchen dispatch).

---

## 2. User Experience & Visual Design

### Key User Flows (Hybrid Full-Bleed + Editorial Showcase)

1. **Top Navigation (3-Zone Contract)**:
   - Transparent-to-frosted sticky header (`64px` height, single row) on the customer site with a crisp single-line wordmark, clean underline-hover navigation links (`Home`, `Turf`, `Resort`, `Restaurant`, `My Bookings`), and an uncluttered action cluster (`Cart`, `Guest Account`, `Admin Panel`).
2. **Full-Bleed Dark Coastal Hero + Quick Booking Bar (Home)**:
   - Edge-to-edge estate photography set behind a calibrated dark maritime scrim (`#071120` to `#0B1B33`), paired with bold `clamp(2.5rem, 4.5vw, 4.25rem)` `text-balance` headline typography, concise value statement, and live availability indicators.
   - Anchored **Quick Booking & Service Bar** inside the hero base with three instant modes:
     - *Resort Check*: Check-in/Check-out date + guests → navigates directly to filtered live room availability.
     - *Turf Slot Check*: Pick date → shows instant open slot count and jumps straight to slot reservation.
     - *Dining & Kitchen*: Jump directly to online food ordering or reserve a dining table.
3. **Interactive Editorial Service Showcase & Estate Photo Gallery**:
   - Interactive 3-tab experience switcher (`01. Championship Turf`, `02. Boutique Resort`, `03. Courtyard Kitchen`) pairing editorial narrative, key specifications, and direct action triggers with asymmetric photography.
   - Curated **Estate Moments Gallery** showcasing the floodlit turf, pool villa, deluxe suites, dining hall, and signature copper-handi cuisine in an asymmetric bento layout.
4. **Dedicated Service & Booking Pages**:
   - **Turf, Resort, and Restaurant landing & booking flows**: Upgraded to full-bleed/scrim dark coastal hero banners with clean editorial typography, balanced 2-column checkout layouts, crisp hairline borders, and sticky tariff summaries (with **Optional Estate Amenities & Add-ons** remaining removed from Resort booking).
   - **My Bookings & Profile**: Tabbed reservation cards with clear typographic status labels, invoice-style tabular breakdowns, and streamlined address/payment management.
5. **Unified Admin Dashboard Redesign**:
   - **Authoritative Coastal Navy Sidebar** (`#0B1628`) paired with a crisp `#F8FAFC` operational workspace canvas, refined top breadcrumb bar (`64px`), and clean single-elevation cards.
   - Executive KPI strips with subtle contrast hierarchy, sharper SVG revenue & split charts, cleaner high-density tabular rows (`36px–44px`), and cohesive typography across Turf, Resort, Restaurant/KDS, and Common Management views.

### Visual Identity & Theme Tokens

- **Aesthetic Direction**: Modern dark-hero coastal club—authoritative deep maritime navy backdrops (`#0B1628`, `#172D4D`) contrasted with crisp alabaster/white surfaces (`#FFFFFF`, `#F8FAFC`), warm coastal sand/amber accent highlights (`#C89B54`), and disciplined service accents (Turf Cobalt `#2563EB`, Resort Emerald `#15803D`, Kitchen Terracotta `#EA580C`).
- **Typography & Hierarchy**:
  - Display Headlines: `Plus Jakarta Sans` (`700–800`, tight `-0.025em` tracking, `text-wrap: balance`, no orphan trailing words).
  - Body Copy & UI Labels: `DM Sans` (`14px–16px`, `1.5–1.65` line height).
  - Financial & Operational Telemetry: `JetBrains Mono` with strict `tabular-nums` alignment.
- **Anti-Slop & Restraint Rules**:
  - **Zero-Pill Metadata**: Static categories, dates, room sizes, and status counts render as unboxed inline text with `·` separators rather than rounded pill chips.
  - **Single-Elevation Depth**: Hairline `1px` borders (`border-slate-200` on light surfaces, `border-white/10` on dark hero cards); no nested cards-within-cards and no thick `border-l-4` accent bars.
  - **No Decorative Pulsing Dots**: Clean typography and explicit status labels without ornamental animated status dots.
  - **60-30-10 Color Discipline**: Neutral light/white workspace canvas (60%), structured card/navigation surfaces (30%), and intentional coastal-club & service accents strictly on primary CTAs and active states (10%).
- **Interactive Feedback & Motion**:
  - Smooth compositor-only hover reveals (`transform` / `opacity` image zoom on photography cards, `<= 200ms` cubic-bezier settling), visible `focus-visible` rings, and immediate feedback on interactive tabs, filters, and forms.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dark Coastal Hero Contrast with Crisp Light Workspace Surfaces**
  - *Chosen Approach*: Use deep maritime navy (`#0B1628`–`#172D4D`) for customer page heroes, footers, promotional bands, and the admin sidebar, while keeping booking forms, menus, price breakdowns, and admin tables on crisp light surfaces (`#FFFFFF` / `#F8FAFC`).
  - *Why*: Delivers the bold, high-contrast coastal club atmosphere on arrival without sacrificing form legibility, tabular financial scannability, or WCAG AA contrast inside dense operational tables.
  - *Alternatives Considered*: Full-app dark mode across all booking forms and admin spreadsheets—avoided because bright-daytime hospitality booking forms and high-density tables read faster on crisp light surfaces.

- **Decision 2: Reusing Existing Curated Local Photography Assets**
  - *Chosen Approach*: Leverage the existing 10 high-resolution estate, turf, villa, room, dining hall, and culinary assets in an upgraded asymmetric bento gallery and full-bleed hero scrims.
  - *Why*: Ensures zero broken external links, instant offline/sandbox loading, and cohesive visual storytelling across the hero, interactive showcase, and photo gallery.

- **Decision 3: Preserving All Shared Business Logic & Data Integrity**
  - *Chosen Approach*: Keep the existing centralized context store, pricing engine, turf slot-locking, resort date-overlap allocation, KDS transitions, and `localStorage` persistence intact while upgrading the presentation layer and adding interactive homepage controls (quick booking bar + service showcase tabs).
  - *Why*: Guarantees zero regressions in bookings, payments, CRM totals, or admin management workflows.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌──────────────────────────────────────────────────────────────────────┐
│                       Shared Platform State                          │
│  Turf Slots · Resort Rooms (20) · Menu & KDS · Tables · CRM · Ledger │
└──────────────┬───────────────────────────────────────┬───────────────┘
               │                                       │
               ▼                                       ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│   Customer Coastal Website   │        │   Unified Admin Console      │
│                              │        │                              │
│ • Sticky 3-Zone Header       │        │ • Dark Coastal Navy Sidebar  │
│ • Full-Bleed Dark Hero       │        │ • Breadcrumb & Search Topbar │
│   + Quick Booking Bar        │        │ • Executive KPI & Split Grid │
│ • Interactive Service Tabs   │        │ • Turf / Resort / KDS / CRM  │
│   + Asymmetric Photo Gallery │        │   High-Density Data Views    │
│ • Booking Wizards & Checkout │        │                              │
└──────────────────────────────┘        └──────────────────────────────┘
```

- **Data Model & State**:
  - Existing entity types (`TurfBooking`, `ResortBooking`, `FoodOrder`, `TableReservation`, `Customer`, `PaymentTransaction`, `Coupon`) and seeded records remain unchanged.
  - Quick booking bar controls on the homepage derive live counts (`availableSlotsToday`, `totalRoomsAvailableToday`) directly from `PlatformContext` and pass selected query parameters (`date`, `checkIn`, `checkOut`, `adults`, `children`) straight into the existing Turf and Resort booking routes.
- **Interactive Component & State Mapping**:
  - **Homepage Quick Booking Bar**: Tabbed switcher (`Resort Stay` | `Turf Slot` | `Dining`) with controlled date/guest inputs and routing handlers into `/resort/rooms`, `/turf/booking`, `/restaurant/menu`, and `/restaurant/table-booking`.
  - **Interactive Service Showcase**: Client-side tab selector switching highlighted imagery, estate metrics, key highlights, and dual primary/secondary navigation CTAs.
  - **Admin Console Theme & Layout**: Unified coastal-navy sidebar with collapsible service groups, unread notification counter, global booking search, and elevated KPI/table styling across all 4 operational sections (`Executive`, `Turf`, `Resort`, `Restaurant`, `Common Management`).
