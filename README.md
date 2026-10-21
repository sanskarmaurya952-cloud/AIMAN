# AIMAN
## End-to-End Medicine Price Comparison & Jan Aushadhi Discovery Platform

AIMAN is a secure, accessible healthcare platform designed to help users identify medicines, compare prices against Jan Aushadhi generic alternatives, and locate nearby Pradhan Mantri Bhartiya Janaushadhi Kendras.

---

### Core Pillars
1. **Unified Multi-Modal Input:** Single shared pipeline handling manual text search, browser voice recognition, and packaging photo OCR.
2. **Deterministic & Verified Matching:** Data backed by PMBI and NPPA ceiling prices; no fabricated medicines or hallucinated prices.
3. **Strict Non-Prescription Safety:** Mandatory disclaimers; no automatic drug substitution recommendations.
4. **Official White & Navy Design:** High accessibility, clean typography, mobile-first responsiveness.
5. **Kendra Locator:** Geolocation and pincode-based distance calculation.

---

### Tech Stack
- **Framework:** Next.js (TypeScript, React 19, Tailwind CSS)
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
- **OCR Engine:** Tesseract.js (Client/Server local inference)
- **Speech Engine:** Native Web Speech API

---

### Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local

# 3. Start development server
npm run dev
```
