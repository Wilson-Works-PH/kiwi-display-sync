import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./lib/theme";

const ConceptC = lazy(() => import("./concept-c/CPage"));
// Earlier concepts stay reachable for the team, but are not linked anywhere.
const Classic = lazy(() => import("./pages/Classic"));
const ConceptB = lazy(() => import("./concept-b/BPage"));
// Dev helper for producing demo media from the drawn content (see ArtPage).
const ArtPage = lazy(() => import("./concept-c/ArtPage"));

export default function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<ConceptC />} />
          <Route path="/a" element={<Classic />} />
          <Route path="/b" element={<ConceptB />} />
          <Route path="/c" element={<ConceptC />} />
          <Route path="/art/:scenario/:index?" element={<ArtPage />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}
