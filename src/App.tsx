import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const CPage = lazy(() => import("./concept-c/CPage"));
const PrivacyPage = lazy(() => import("./concept-c/PrivacyPage"));
// Dev helper for producing demo media from the drawn content (see ArtPage).
const ArtPage = lazy(() => import("./concept-c/ArtPage"));

/** The site is Concept C alone (Concepts A and B were removed 2026-09-08 — see git history). */
export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<CPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/art/:scenario/:index?" element={<ArtPage />} />
        {/* Old concept URLs (/a, /b, /c) and anything unknown land on the site. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
