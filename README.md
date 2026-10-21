# AIMAN
## End-to-End Medicine Price Comparison & Jan Aushadhi Discovery Platform

AIMAN is a full-stack, secure, hackathon-ready healthcare platform empowering Indian citizens to identify prescribed medicines, compare commercial branded prices with verified Government **Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)** generic alternatives, and locate nearby Jan Aushadhi Kendras.

---

### Core Pillars & Unified Pipeline
1. **Unified Multi-Modal Input Convergence:**
   - **Manual Search:** Fuzzy, typo-tolerant and salt-composition matching.
   - **Voice Search:** Multi-lingual speech recognition (**English `en-IN`** & **Hindi `hi-IN`**) with editable transcript and confirmation gates.
   - **Photo OCR Scanner:** Client-side WebAssembly inference via Tesseract.js.
   - **Zero Fragmented Systems:** All three inputs converge into **one shared normalization & matching engine**.
2. **Authentic Data Provenance:**
   - Grounded in official public records from the **Pharmaceuticals & Medical Devices Bureau of India (PMBI)** and **National Pharmaceutical Pricing Authority (NPPA)** ceiling price schedules (DPCO 2013).
   - Zero hallucinated medicines or fabricated rates.
3. **Strict Non-Prescription & Safety Boundaries:**
   - Mandatory statutory health disclaimers.
   - No automatic drug substitution recommendations.
4. **Official White & Navy Blue Visual Design:**
   - High-contrast, clean, accessible UI (`#0F172A`, `#1E3A8A`, `#2563EB`, `#FFFFFF`, `#F8FAFC`).
   - Zero neon colors, dark modes, or distracting animations.
5. **Distance-Based Kendra Locator:**
   - Geolocation & Indian PIN code centroid fallback with Haversine distance calculations.

---

### Technology Stack
- **Framework:** Next.js 14 (App Router, TypeScript, React 18)
- **Styling:** Tailwind CSS with custom White & Navy Blue design tokens
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
- **Speech Engine:** Native Web Speech API with dual-language support
- **OCR Engine:** Client-Side Tesseract.js (Zero external server image upload)
- **Icons:** Lucide React

---

### Database Schema & Security
Database migrations are versioned under [`supabase/migrations/`](./supabase/migrations/):
1. `20261021_initial_schema.sql` — `profiles`, `saved_medicines`, `search_history` with full RLS policies and trigger-based profile initialization.
2. `20261021_medicines_schema.sql` — `medicines` and `medicine_aliases` tables with public read RLS policies.

To apply migrations in Supabase:
```sql
-- Paste contents of supabase/migrations/ into Supabase Dashboard > SQL Editor and click Run
```

---

### Local Setup & Installation

```bash
# 1. Clone repository
git clone https://github.com/sanskarmaurya952-cloud/AIMAN.git
cd AIMAN

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Populate NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Run tests
npm test # or: npx tsx tests/e2e_pipeline.test.ts

# 5. Start development server
npm run dev
# Open http://localhost:3000
```

---

### Verification & Test Suite

The platform includes automated end-to-end integration tests:
```bash
# Run unit tests for matching engine & typo tolerance
npx tsx tests/matching.test.ts

# Run end-to-end multi-modal pipeline & Kendra geocoding tests
npx tsx tests/e2e_pipeline.test.ts

# Production build check
npm run build
```

---

### Demo Walkthrough for Evaluators & Hackathon Juries

1. **Explore Landing Page (`/`):** View the official white-and-blue interface and choose between Manual Search, Voice Recognition, or Packaging Scan.
2. **Test Voice Search (`/search`):** Click the microphone icon, select Hindi or English, and speak *"Find price for paracetamol 650"*. Notice the editable transcript, detected salt attributes, and seamless transition into the matching results.
3. **Test Packaging Photo Scan:** Upload a medicine box or strip photo (e.g. *Augmentin 625 Duo*), review the client-side OCR extraction, and click Confirm & Search.
4. **Compare Verified Prices:** Observe unit-normalized prices, official PMBI Product Code (`PMBI-0012`), NPPA ceiling caps, and absolute percentage savings.
5. **Locate Nearby Kendras (`/kendras`):** Click *"Locate Nearby Kendras"*, enter your PIN code (e.g. `110001` or `226001`), and view distance-sorted centres with phone numbers and Google Maps direction links.
6. **User Persistence (`/profile`, `/saved`, `/history`):** Sign in to save medicines to your watchlist and review encrypted search history protected by Row Level Security.
